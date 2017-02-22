
import { exp, metro, ms, rand, scale } from 'plonk';
import times from 'lodash/times';

const N_POLYGONS = 60,
      N_POINTS = 3,
      BOUNDS_MIN = 0.3,
      BOUNDS_MAX = 0.7;

export const state = {
  direction: [],
  polygons: [],
  speed: 0.005
};

export default {
  state,
  run
};

function createPolygon () {
  const polygon = {
    fill: true,
    strength: 1,
    points: times(N_POINTS, () => [0, 0])
  };
  return polygon;
}

function run () {

  state.direction = times(N_POINTS, () => [rand(-1, 1), rand(-1, 1)]);

  const origin = times(N_POINTS, () => [rand(BOUNDS_MIN, BOUNDS_MAX), rand(BOUNDS_MIN, BOUNDS_MAX)]);

  times(N_POLYGONS, (i) => {
    const polygon = createPolygon();

    polygon.points.forEach((point, j) => {
      point[0] = origin[j][0];
      point[1] = origin[j][1];
    });

    if (i !== 0) {
      polygon.strength = exp(scale(i, 1, N_POLYGONS, 1, 0)) * 0.15;
    }

    state.polygons.push(polygon);
  });

  metro(ms('60fps'), tick);
}

function tick () {

  if (Math.floor(Math.random() * 50) === 0) {
    state.speed = rand(0.0045, 0.0051);
  }

  const previous = state.polygons.map((polygon) => {
    return polygon.points.map((point) => {
      return [point[0], point[1]];
    });
  });

  state.polygons.forEach((polygon, i) => {
    if (i === 0) {
      polygon.points.forEach((point, j) => {
        if (point[0] >= BOUNDS_MAX) {
          state.direction[j][0] = rand(-1, 0);
        } else if (point[0] <= BOUNDS_MIN) {
          state.direction[j][0] = rand(0, 1);
        }
        if (point[1] >= BOUNDS_MAX) {
          state.direction[j][1] = rand(-1, 0);
        } else if (point[1] <= BOUNDS_MIN) {
          state.direction[j][1] = rand(0, 1);
        }
        point[0] += (state.direction[j][0] * state.speed);
        point[1] += (state.direction[j][1] * state.speed);
      });
    } else {
      polygon.points.forEach((point, j) => {
        point[0] = previous[i - 1][j][0];
        point[1] = previous[i - 1][j][1];
      });
    }
  });
}
