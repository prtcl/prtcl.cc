
import { drunk, exp, metro, ms, rand, scale } from 'plonk';
import times from 'lodash-es/times';

const N_POLYGONS = 100,
      N_POINTS = 4,
      BOUNDS_MIN = 0.05,
      BOUNDS_MAX = 0.95;

const driftDrunk = drunk(-0.0001, 0.0001);

export const state = {
  direction: times(N_POINTS, () => [rand(-1, 1), rand(-1, 1)]),
  polygons: createPolygons(),
  previous: times(N_POLYGONS, () => times(N_POINTS, () => [0, 0])),
  speed: 0.002
};

export default {
  state,
  run () {
    metro(ms('60fps'), tickHandler)
      .catch(console.error);
  }
};

function createPolygons () {
  const min = BOUNDS_MIN,
        max = BOUNDS_MAX;

  const origin = times(N_POINTS, () => [rand(min, max), rand(min, max)]);

  return times(N_POLYGONS, (i) => {
    const polygon = createPolygon();

    for (let j = 0; j < N_POINTS; j++) {
      const point = polygon.points[j],
            orig = origin[j];

      point[0] = orig[0];
      point[1] = orig[1];
    }

    if (i !== 0) {
      polygon.strength = exp(scale(i, 1, N_POLYGONS, 1, 0)) * 0.25;
    }

    return polygon;
  });
}

function createPolygon () {
  return {
    fill: true,
    strength: 1,
    points: times(N_POINTS, () => [0, 0])
  };
}

function tickHandler () {
  const polygons = state.polygons,
        previous = state.previous,
        first = polygons[0];

  for (let i = N_POLYGONS - 1; i >= 0; i--) {
    const poly = polygons[i],
          points = poly.points,
          prev = previous[i];

    for (let k = N_POINTS - 1; k >= 0; k--) {
      const point = points[k],
            prevPoint = prev[k];

      prevPoint[0] = point[0];
      prevPoint[1] = point[1];
    }
  }

  for (let i = 0; i < N_POINTS; i++) {
    const point = first.points[i],
          dir = state.direction[i];

    if (point[0] >= BOUNDS_MAX) {
      dir[0] = rand(-1, 0);
    } else if (point[0] <= BOUNDS_MIN) {
      dir[0] = rand(0, 1);
    }

    if (point[1] >= BOUNDS_MAX) {
      dir[1] = rand(-1, 0);
    } else if (point[1] <= BOUNDS_MIN) {
      dir[1] = rand(0, 1);
    }

    point[0] += (dir[0] * state.speed);
    point[1] += (dir[1] * state.speed);
  }

  for (let i = 1; i < N_POLYGONS; i++) {
    const poly = polygons[i],
          points = poly.points,
          prev = previous[i - 1];

    for (let k = 0; k < N_POINTS; k++) {
      const point = points[k],
            prevPoint = prev[k];

      point[0] = prevPoint[0];
      point[1] = prevPoint[1] - (0.001 + driftDrunk());
    }
  }
}
