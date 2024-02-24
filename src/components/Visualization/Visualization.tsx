import { useEffect, useRef, useState } from 'react';
import { Drunk, Env, Rand, ms } from 'plonk';
import { useFrames, useMetro } from 'plonk-hooks';
import { Flex } from 'theme-ui';
import useBreakpoints from '~/hooks/useBreakpoints';
import { Canvas, useCanvasApi } from '~/lib/canvas';

const N_SHAPES = 3;
const N_POINTS = 13;

type Pos = {
  x: Drunk;
  y: Drunk;
};

type PolyPoint = {
  x: Drunk;
  y: Drunk;
};

type ColorRand = {
  r: Rand;
  g: Rand;
  b: Rand;
};

type Drift = {
  x: Env;
  y: Env;
};

type Shape = {
  pos: Pos;
  points: PolyPoint[];
  color: ColorRand;
  drift: Drift;
};

type VisualizationState = {
  jump: Rand;
  shapes: Shape[];
  speed: Drunk;
};

const getInitialState = (): VisualizationState => {
  const shapes: Shape[] = [];
  let shapeCount = 0;

  while (shapeCount < N_SHAPES) {
    const pos: Pos = {
      x: new Drunk({ step: 0.01 }),
      y: new Drunk({ step: 0.01 }),
    };
    const points: PolyPoint[] = [];
    let pointCount = 0;

    while (pointCount < N_POINTS) {
      points.push({
        x: new Drunk({ step: 0.01 }),
        y: new Drunk({ step: 0.01 }),
      });

      pointCount += 1;
    }

    shapes.push({
      points,
      pos,
      color: {
        r: new Rand({ max: 33 }),
        g: new Rand({ max: 33 }),
        b: new Rand({ max: 33 }),
      },
      drift: {
        x: new Env({ duration: ms('5s'), from: -1, to: 1 }),
        y: new Env({ duration: ms('5s'), from: -1, to: 1 }),
      },
    });

    shapeCount += 1;
  }

  return {
    jump: new Rand({ min: ms('2s'), max: ms('15s') }),
    shapes,
    speed: new Drunk({ min: 0.0001, max: 0.01 }),
  };
};

const Visualization = () => {
  const { isMobile } = useBreakpoints();
  const containerRef = useRef<HTMLElement>();
  const { canvas, props: canvasProps, isReady } = useCanvasApi();
  const [state] = useState<VisualizationState>(() => getInitialState());

  useEffect(() => {
    const resize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.resize(rect);
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [canvas]);

  useMetro(
    ({ setTime }) => {
      state.shapes.forEach((shape) => {
        const dt = new Rand({ min: ms('12s'), max: ms('25s') });
        const dx = new Rand();

        shape.pos.x.reset({ step: state.speed.next() });
        shape.pos.y.reset({ step: state.speed.next() });
        shape.points.forEach((point) => {
          point.x.reset({ step: state.speed.next() * 2 });
          point.y.reset({ step: state.speed.next() * 2 });
        });
        shape.color.r.next();
        shape.color.g.next();
        shape.color.b.next();

        shape.drift.x.reset({
          duration: dt.next(),
          ...(Math.random() >= 0.5
            ? {
                from: dx.next(),
                to: dx.next() * -1,
              }
            : {
                from: dx.next() * -1,
                to: dx.next(),
              }),
        });
        shape.drift.y.reset({
          duration: dt.next(),
          ...(Math.random() >= 0.5
            ? {
                from: 1,
                to: -1,
              }
            : {
                from: -1,
                to: 1,
              }),
        });
      });

      setTime(state.jump.next());
    },
    { time: 500 },
  );

  useFrames(() => {
    if (!isReady) {
      return;
    }

    const { width, height } = canvas.size;

    canvas.alpha(0.05);
    canvas.fill({ r: 255, g: 255, b: 255 });
    canvas.drawRect({
      x: 0,
      y: 0,
      width,
      height,
    });

    state.shapes.forEach((shape) => {
      const driftX = shape.drift.x.next() * (width / (isMobile ? 2 : 4));
      const driftY = shape.drift.y.next() * (height / 4);
      const posX = shape.pos.x.next() * (width / 2) + driftX;
      const posY = shape.pos.y.next() * (height / 2) + driftY;

      canvas.alpha(0.01);
      canvas.strokeWeight(0);
      canvas.fill({
        r: shape.color.r.value(),
        g: shape.color.g.value(),
        b: shape.color.b.value(),
      });

      canvas.drawPolygon(
        {
          coords: shape.points.map((point) => {
            const x = posX + point.x.next() * (width / 2);
            const y = posY + point.y.next() * (height / 2);

            return [x, y];
          }),
        },
        { shouldFill: true },
      );
    });
  });

  return (
    <Flex ref={containerRef} sx={{ width: '100%', height: '100%' }}>
      <Canvas {...canvasProps} />
    </Flex>
  );
};

export default Visualization;
