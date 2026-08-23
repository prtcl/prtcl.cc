import { useEffect, useRef, useState } from 'react';
import * as p from '@prtcl/plonk';
import { useFrames } from '@prtcl/plonk-hooks';
import { Flex } from 'styled-system/jsx';
import { Canvas, CanvasApi, useCanvas } from '~/lib/canvas';
import { debounce } from '~/lib/debounce';
import { useBreakpoints } from '~/lib/viewport';

type Bug = {
  id: number;
  tick: (state: p.TimerState, canvas: CanvasApi) => void;
};

type VisualizationState = {
  sx: p.Scale;
  sy: p.Scale;
  bugs: Bug[];
};

const N_BUGS_MOBILE = 32;
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

  const size = Math.round(p.rand({ min: 2, max: 27 }));

  const lsd = new p.Drunk({ min: 0.01, max: 0.15, step: 0.01 });
  const lz = new p.Lorenz({ damping: 0.25, rate: lsd.next() });
  const los = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: 0, max: 1 },
  });
  const lrs = new p.Scale({
    from: { min: -1, max: 1 },
    to: { min: size / 4, max: size },
  });

  const tick = (state: p.TimerState, canvas: CanvasApi) => {
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

    const r = lrs.scale(wig.z);
    const o = los.scale(wig.z);

    canvas.fill({ r: 0, g: 0, b: 0, a: o * 0.96 });
    canvas.drawCircle({ x, y, radius: r });

    canvas.fill({ r: 0, g: 0, b: 0, a: o });
    canvas.drawCircle({ x, y, radius: r / (Math.E * 3) });
  };

  return { id, tick };
};

const getInitialState = (isMobile: boolean): VisualizationState => {
  const sx = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 0, max: 1 } });
  const sy = new p.Scale({ from: { min: 0, max: 1 }, to: { min: 0, max: 1 } });
  const br = new p.Drunk({ min: 100, max: 2000 });
  const count = isMobile ? N_BUGS_MOBILE : N_BUGS_DESKTOP;
  const bugs = Array.from({ length: count }, (_, k) =>
    makeBug(k, Math.round(br.next()), sx, sy, isMobile),
  );

  return { sx, sy, bugs };
};

export const Visualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useBreakpoints();
  const { canvas, props: canvasProps, isReady } = useCanvas();
  const [state] = useState<VisualizationState>(() => getInitialState(isMobile));

  useEffect(() => {
    if (!canvas) return;
    const applyBounds = () => {
      const bounds = containerRef.current!.getBoundingClientRect();
      canvas.resize(bounds);
      const qw = bounds.width / 8;
      const qh = bounds.height / 8;

      state.sx.setRanges({ to: { min: -qw, max: bounds.width + qw } });
      state.sy.setRanges({ to: { min: -qh, max: bounds.height + qh } });
    };
    applyBounds();

    const handleResize = debounce(applyBounds, 500);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [canvas, state]);

  useFrames(({ state: timerState }) => {
    if (!isReady || !canvas) return;
    const { width, height } = canvas.size;

    canvas.alpha(0.5);
    canvas.fill({ r: 255, g: 255, b: 255 });
    canvas.drawRect({ x: 0, y: 0, width, height });
    canvas.alpha(1);

    for (const bug of state.bugs) {
      bug.tick(timerState, canvas);
    }
  });

  return (
    <Flex ref={containerRef} width="100%" height="100%">
      <Canvas {...canvasProps} />
    </Flex>
  );
};
