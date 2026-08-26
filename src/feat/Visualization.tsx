import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import { useEffect, useRef, useState } from 'react';
import * as p from '@prtcl/plonk';
import * as t from 'three';
import { useBreakpoints } from '~/lib/viewport';

const N_BUGS_MOBILE = 17;
const N_BUGS_DESKTOP = 17;
const N_POINTS = 3;

class Dyn {
  ina = new p.Integrator({ factor: 0.005 });
  gen = new p.Sine({ duration: p.ms('0.33hz') });
  df = new p.Drunk({ min: 0.03, max: 0.07, step: 0.05 });
  rs = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: 0, max: 33 },
  });
  color = new t.Color();

  tick() {
    const no = this.ina.next(this.df.next());
    const nr = this.ina.next(this.rs.scale(p.tanh(this.gen.next(), 2)));
    // Blend rgba(nr, 13, 1, no * 0.25) over white
    const a = no * 0.15;
    this.color.setRGB(1 - a * (1 - nr / 255), 1 - a * (1 - 13 / 255), 1 - a * (1 - 1 / 255));

    return this.color;
  }
}

class Point {
  meshes: t.Mesh<t.CircleGeometry, t.MeshBasicMaterial, t.Object3DEventMap>[];
  materials: t.MeshBasicMaterial[];
  state: { x: number; y: number; z: number; r: number; o: number };

  constructor() {
    const outerMat = new t.MeshBasicMaterial({
      color: '#000',
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });
    const innerMat = new t.MeshBasicMaterial({
      color: '#000',
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const outerMesh = new t.Mesh(new t.CircleGeometry(1, 32), outerMat);
    const innerMesh = new t.Mesh(new t.CircleGeometry(1, 32), innerMat);

    this.meshes = [outerMesh, innerMesh];
    this.materials = [outerMat, innerMat];
    this.state = { x: 0, y: 0, z: 0, r: 0, o: 0 };
  }

  update(x: number, y: number, z: number, r: number, o: number) {
    this.meshes.at(0)!.position.set(x, y, z);
    this.meshes.at(0)!.scale.setScalar(r);
    this.materials.at(0)!.opacity = o * 0.96;

    this.meshes.at(1)!.position.set(x, y, z);
    this.meshes.at(1)!.scale.setScalar(r / (Math.E * 3));
    this.materials.at(1)!.opacity = o;

    this.state.x = x;
    this.state.y = y;
    this.state.z = z;
    this.state.r = r;
    this.state.o = o;
  }
}

class Wobbler {
  gen: p.Sine;
  slew: p.Integrator;
  amp: p.Scale;

  constructor(range: number) {
    this.gen = new p.Sine({ duration: p.rand({ min: p.ms('1hz'), max: p.ms('3hz') }) });
    this.slew = new p.Integrator({ factor: 0.5 });
    this.amp = new p.Scale({ from: { min: -1, max: 1 }, to: { min: -range, max: range } });
  }

  next() {
    return this.amp.scale(this.slew.next(this.gen.next()));
  }
}

class Wiggler {
  lsd: p.Drunk;
  lz: p.Lorenz;
  los: p.Scale;
  lrs: p.Scale;
  lzs: p.Scale;

  constructor(size: number) {
    this.lsd = new p.Drunk({ min: 0.005, max: 0.15, step: 0.01 });
    this.lz = new p.Lorenz({ damping: 0.25, rate: this.lsd.next() });
    this.los = new p.Scale({ from: { min: -1, max: 1 }, to: { min: 0.88, max: 1 } });
    this.lrs = new p.Scale({ from: { min: -1, max: 1 }, to: { min: size / 4, max: size } });
    this.lzs = new p.Scale({ from: { min: -1, max: 1 }, to: { min: -50, max: 100 } });
  }

  next() {
    const wig = this.lz.next();
    this.lz.setRate(this.lsd.next());
    return {
      wx: wig.x * 0.25,
      wy: wig.y * 0.075,
      z: this.lzs.scale(wig.z),
      r: this.lrs.scale(wig.z),
      o: this.los.scale(wig.z),
    };
  }
}

class Position {
  rx: p.Rand;
  ry: p.Rand;
  sd: p.Rand;
  px: p.Slew;
  py: p.Slew;
  dx: p.Drunk;
  dy: p.Drunk;

  constructor() {
    this.rx = new p.Rand({ min: 0, max: 1 });
    this.ry = new p.Rand({ min: 0, max: 1 });
    this.sd = new p.Rand({ min: 809, max: 6472 });
    this.px = new p.Slew({ duration: this.sd.value(), value: this.rx.next() });
    this.py = new p.Slew({ duration: this.sd.value(), value: this.ry.next() });
    this.dx = new p.Drunk({ min: -0.25, max: 0.25, step: 0.001 });
    this.dy = new p.Drunk({ min: -0.25, max: 0.25, step: 0.001 });
  }

  update() {
    this.px.setValue(this.rx.next());
    this.py.setValue(this.ry.next());
    this.px.setDuration(this.sd.next());
    this.py.setDuration(this.sd.value());
  }

  next() {
    return {
      x: this.px.next() + this.dx.next(),
      y: this.py.next() + this.dy.next(),
    };
  }
}

class Bug {
  lastInterval = 0;
  points: Point[];
  opts: { id: number; updateInterval: number; sx: p.Scale; sy: p.Scale; isMobile: boolean };
  wiggler: Wiggler;
  wobbler: Wobbler;
  position: Position;
  jitter: p.Rand;

  constructor(id: number, updateInterval: number, sx: p.Scale, sy: p.Scale, isMobile: boolean) {
    const size = Math.round(p.rand({ min: 2, max: isMobile ? 27 : 17 }));
    this.opts = { id, updateInterval, sx, sy, isMobile };
    this.wiggler = new Wiggler(size);
    this.wobbler = new Wobbler(p.rand({ max: size / 2 }));
    this.position = new Position();
    this.points = Array.from({ length: N_POINTS }, () => new Point());
    this.jitter = new p.Rand({
      min: Math.max(0, updateInterval - updateInterval / 4),
      max: updateInterval + updateInterval / 4,
    });
  }

  tick(state: p.TimerState) {
    const { updateInterval, sx, sy, isMobile } = this.opts;

    if (state.iterations === 1 || state.totalElapsed - this.lastInterval > updateInterval) {
      this.lastInterval = state.totalElapsed;
      this.opts.updateInterval = this.jitter.next();
      this.position.update();
    }

    const { wx, wy, z, r, o } = this.wiggler.next();
    const pos = this.position.next();

    const cxScale = isMobile ? 1 : 0.42;
    const cyScale = isMobile ? 1 : 0.66;
    const cx = (pos.x + wx) * cxScale + (1 - cxScale) / 2;
    const cy = (pos.y + wy) * cyScale + (1 - cyScale) / 2;

    const x = sx.scale(cx);
    const y = sy.scale(cy) + this.wobbler.next();

    for (let i = this.points.length - 1; i >= 0; i--) {
      const point = this.points[i];
      const prev = this.points[i - 1]?.state;

      if (i === 0) {
        point.update(x, y, z, r, o);
      } else {
        point.update(prev.x, prev.y, prev.z, prev.r, o * 0.68 * Math.pow(0.68, i));
      }
    }
  }
}

type VisualizationState = {
  sx: p.Scale;
  sy: p.Scale;
  bugs: Bug[];
  dyn: Dyn;
};

const getInitialState = (isMobile: boolean): VisualizationState => {
  const sx = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 0, max: 1 } });
  const sy = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 0, max: 1 } });
  const br = new p.Drunk({ min: 100, max: 2000 });
  const count = isMobile ? N_BUGS_MOBILE : N_BUGS_DESKTOP;
  const bugs = Array.from(
    { length: count },
    (_, k) => new Bug(k, Math.round(br.next()), sx, sy, isMobile),
  );
  return { sx, sy, bugs, dyn: new Dyn() };
};

const Scene = (props: { state: VisualizationState }) => {
  const { state } = props;
  const { viewport, scene } = useThree();
  const groupRef = useRef<t.Group>(null);
  const startTime = useRef(performance.now());
  const iterations = useRef(0);

  useEffect(() => {
    const group = groupRef.current!;
    for (const bug of state.bugs) {
      for (const point of bug.points) {
        group.add(...point.meshes);
      }
    }

    return () => {
      for (const bug of state.bugs) {
        for (const point of bug.points) {
          group.remove(...point.meshes);
        }
      }
    };
  }, [state]);

  useEffect(() => {
    const { width, height } = viewport;
    const qw = width / 8;
    const qh = height / 8;
    state.sx.setRanges({ to: { min: -width / 2 - qw, max: width / 2 + qw } });
    state.sy.setRanges({ to: { min: height / 2 + qh, max: -height / 2 - qh } });
  }, [viewport, state]);

  useFrame(() => {
    const totalElapsed = p.now() - startTime.current;
    iterations.current += 1;

    const timerState = {
      iterations: iterations.current,
      totalElapsed,
    } as p.TimerState;

    scene.background = state.dyn.tick();

    for (const bug of state.bugs) {
      bug.tick(timerState);
    }
  });

  return <group ref={groupRef} />;
};

export const Visualization = () => {
  const { isMobile } = useBreakpoints();
  const [state] = useState(() => getInitialState(isMobile));

  return (
    <Canvas
      camera={{ fov: 60, near: 1, far: 2000, position: [0, 0, 600] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene state={state} />
      <EffectComposer>
        <DepthOfField focusDistance={100} focalLength={0.01} bokehScale={2} />
      </EffectComposer>
    </Canvas>
  );
};
