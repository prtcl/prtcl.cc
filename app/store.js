
import { drunk, exp, metro, ms, rand, scale } from 'plonk';
import times from 'lodash-es/times';

const N_POLYGONS = 60,
      N_POINTS = 5,
      BOUNDS_MIN = 0.32,
      BOUNDS_MAX = 0.68;

const speedDrunk = drunk(0.006, 0.006, 0.005),
      driftDrunk = drunk(0.0005, 0.002);

export const state = {
  direction: times(N_POINTS, () => [rand(-1, 1), rand(-1, 1)]),
  polygons: createPolygons(),
  speed: 0
};

export default {
  state,
  run () {
    metro(ms('60fps'), tickHandler)
      .catch(console.error);
  }
};

function createPolygons () {
  const origin = createOrigin();

  return times(N_POLYGONS, (i) => {
    const polygon = createPolygon();

    for (let j = 0; j < polygon.points.length; j++) {
      const point = polygon.points[j];

      point[0] = origin[j][0];
      point[1] = origin[j][1];
    }

    if (i !== 0) {
      polygon.strength = exp(scale(i, 1, N_POLYGONS, 1, 0)) * 0.25;
    }

    return polygon;
  });
}

function createOrigin () {
  const min = BOUNDS_MIN,
        max = BOUNDS_MAX;

  return times(N_POINTS, () => [rand(min, max), rand(min, max)]);
}

function createPolygon () {
  return {
    fill: true,
    strength: 1,
    points: times(N_POINTS, () => [0, 0])
  };
}

function tickHandler () {

  state.speed = speedDrunk();

  const polygons = state.polygons,
        first = polygons[0];

  for (let i = 0; i < first.points.length; i++) {
    const point = first.points[i];

    if (point[0] >= BOUNDS_MAX) {
      state.direction[i][0] = rand(-1, 0);
    } else if (point[0] <= BOUNDS_MIN) {
      state.direction[i][0] = rand(0, 1);
    }

    if (point[1] >= BOUNDS_MAX) {
      state.direction[i][1] = rand(-1, 0);
    } else if (point[1] <= BOUNDS_MIN) {
      state.direction[i][1] = rand(0, 1);
    }

    point[0] += (state.direction[i][0] * state.speed);
    point[1] += (state.direction[i][1] * state.speed);
  }

  const previous = getPreviousPoints();

  for (let i = 1; i < polygons.length; i++) {
    const polygon = polygons[i];

    for (let j = 0; j < polygon.points.length; j++) {
      const point = polygon.points[j];

      point[0] = previous[i - 1][j][0];
      point[1] = previous[i - 1][j][1] - driftDrunk();
    }
  }
}

function getPreviousPoints () {
  return state.polygons.map((polygon) => {
    return polygon.points.map((point) => {
      return [point[0], point[1]];
    });
  });
}
