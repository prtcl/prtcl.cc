import { useState } from 'react';
import { Drunk, Env, Rand, ms } from '@prtcl/plonk';
import { useMetro } from '@prtcl/plonk-hooks';
import type { PolyPoint, Pos, Shape } from '../types';

const N_SHAPES = 3;
const N_POINTS = 13;

export type VisualizationState = {
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

const useVisualization = () => {
  const [state] = useState<VisualizationState>(() => getInitialState());

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

  return state;
};

export default useVisualization;
