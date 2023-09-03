import { useEffect, useRef, useState } from 'react';
import { Flex } from 'theme-ui';
import { Canvas, useCanvasApi } from '~/lib/canvas';
import { Drunk, Rand, useFrames, useMetro } from '~/lib/plonk';

const N_SHAPES = 1;
const N_POINTS = 13;

type Pos = {
  x: Drunk;
  y: Drunk;
};

type PolyPoint = {
  x: Drunk;
  y: Drunk;
};

type Shape = {
  pos: Pos;
  points: PolyPoint[];
  color: {
    r: Rand;
    g: Rand;
    b: Rand;
  };
};

type VisualizationState = {
  shapes: Shape[];
  jump: Rand;
  speed: Drunk;
};

const Visualization = () => {
  const containerRef = useRef<HTMLElement>();
  const { canvas, props: canvasProps, isReady } = useCanvasApi();
  const [state] = useState<VisualizationState>(() => {
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
      });

      shapeCount += 1;
    }

    return {
      jump: new Rand({ min: 250, max: 5000 }),
      shapes,
      speed: new Drunk({ min: 0.0001, max: 0.01 }),
    };
  });

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
        shape.pos.x.reset({ step: state.speed.next() });
        shape.pos.y.reset({ step: state.speed.next() });
        shape.points.forEach((point) => {
          point.x.reset({ step: state.speed.next() * 2 });
          point.y.reset({ step: state.speed.next() * 2 });
        });
        shape.color.r.next();
        shape.color.g.next();
        shape.color.b.next();
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
      const posX = shape.pos.x.next() * (width / 2);
      const posY = shape.pos.y.next() * (height / 2);

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
