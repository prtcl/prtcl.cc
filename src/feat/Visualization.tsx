import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import { useEffect, useRef, useState } from 'react';
import * as p from '@prtcl/plonk';
import * as THREE from 'three';
import { useBreakpoints } from '~/lib/viewport';

type Bug = {
  id: number;
  meshes: THREE.Mesh[];
  tick: (state: p.TimerState) => void;
};

type Dyn = {
  tick: () => THREE.Color;
};

type VisualizationState = {
  sx: p.Scale;
  sy: p.Scale;
  bugs: Bug[];
  dyn: Dyn;
};

const makeDyn = (): Dyn => {
  const ina = new p.Integrator({ factor: 0.005 });
  const gen = new p.Sine({ duration: p.ms('0.33hz') });
  const df = new p.Drunk({ min: 0.03, max: 0.07, step: 0.05 });
  const rs = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: 0, max: 33 },
  });
  const color = new THREE.Color();

  const tick = () => {
    const no = ina.next(df.next());
    const nr = ina.next(rs.scale(p.tanh(gen.next(), 2)));
    // Blend rgba(nr, 13, 1, no * 0.25) over white
    const a = no * 0.15;
    color.setRGB(
      1 - a * (1 - nr / 255),
      1 - a * (1 - 13 / 255),
      1 - a * (1 - 1 / 255),
    );

    return color;
  };

  return { tick };
};

const N_BUGS_MOBILE = 27;
const N_BUGS_DESKTOP = 23;

const makeBug = (
  id: number,
  updateInterval: number,
  sx: p.Scale,
  sy: p.Scale,
  isMobile: boolean,
): Bug => {
  let lastInterval = 0;

  const rx = new p.Rand({ min: 0, max: 1 });
  const ry = new p.Rand({ min: 0, max: 1 });
  const sd = new p.Rand({ min: 809, max: 6472 });

  const px = new p.Slew({ duration: sd.value(), value: rx.next() });
  const py = new p.Slew({ duration: sd.value(), value: ry.next() });

  const dx = new p.Drunk({ min: -0.25, max: 0.25, step: 0.001 });
  const dy = new p.Drunk({ min: -0.25, max: 0.25, step: 0.001 });

  const size = Math.round(p.rand({ min: 2, max: isMobile ? 27 : 17 }));

  const lsd = new p.Drunk({ min: 0.01, max: 0.15, step: 0.01 });
  const lz = new p.Lorenz({ damping: 0.25, rate: lsd.next() });
  const los = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: 0.88, max: 1 },
  });
  const lrs = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: size / 4, max: size },
  });
  const lzs = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: -50, max: 100 },
  });

  const outerMat = new THREE.MeshBasicMaterial({
    color: '#000',
    transparent: true,
    depthTest: true,
    depthWrite: true,
  });
  const innerMat = new THREE.MeshBasicMaterial({
    color: '#000',
    transparent: true,
    depthTest: true,
    depthWrite: true,
  });

  const outerMesh = new THREE.Mesh(new THREE.CircleGeometry(1, 32), outerMat);
  const innerMesh = new THREE.Mesh(new THREE.CircleGeometry(1, 32), innerMat);

  const tick = (state: p.TimerState) => {
    if (
      state.iterations === 1 ||
      state.totalElapsed - lastInterval > updateInterval
    ) {
      lastInterval = state.totalElapsed;
      px.setValue(rx.next());
      py.setValue(ry.next());
      px.setDuration(sd.next());
      py.setDuration(sd.value());
    }

    const wig = lz.next();
    lz.setRate(lsd.next());

    const wx = wig.x * 0.25;
    const wy = wig.y * 0.075;

    const cxScale = isMobile ? 1 : 0.42;
    const cyScale = isMobile ? 1 : 0.66;
    const cx = (px.next() + dx.next() + wx) * cxScale + (1 - cxScale) / 2;
    const cy = (py.next() + dy.next() + wy) * cyScale + (1 - cyScale) / 2;

    const x = sx.scale(cx);
    const y = sy.scale(cy);
    const z = lzs.scale(wig.z);
    const r = lrs.scale(wig.z);
    const o = los.scale(wig.z);

    outerMesh.position.set(x, y, z);
    outerMesh.scale.setScalar(r);
    outerMat.opacity = o * 0.96;

    innerMesh.position.set(x, y, z);
    innerMesh.scale.setScalar(r / (Math.E * 3));
    innerMat.opacity = o;
  };

  return { id, meshes: [outerMesh, innerMesh], tick };
};

const getInitialState = (isMobile: boolean): VisualizationState => {
  const sx = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 0, max: 1 } });
  const sy = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 0, max: 1 } });
  const br = new p.Drunk({ min: 100, max: 2000 });
  const count = isMobile ? N_BUGS_MOBILE : N_BUGS_DESKTOP;
  const bugs = Array.from({ length: count }, (_, k) =>
    makeBug(k, Math.round(br.next()), sx, sy, isMobile),
  );
  return { sx, sy, bugs, dyn: makeDyn() };
};

const Scene = (props: { state: VisualizationState }) => {
  const { state } = props;
  const { viewport, scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(performance.now());
  const iterations = useRef(0);

  useEffect(() => {
    const group = groupRef.current!;
    for (const bug of state.bugs) {
      for (const mesh of bug.meshes) {
        group.add(mesh);
      }
    }

    return () => {
      for (const bug of state.bugs) {
        for (const mesh of bug.meshes) {
          group.remove(mesh);
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
