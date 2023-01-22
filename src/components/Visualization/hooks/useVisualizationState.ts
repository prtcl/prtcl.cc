import { useRef, useEffect, useCallback } from 'react';
import { drunk, exp, ms, rand, scale } from 'plonk';

export type Point = {
  id: number;
  x: number;
  y: number;
  direction: {
    x: number;
    y: number;
  };
};

export type Polygon = {
  id: number;
  points: Point[];
  strength: number;
}

type VisualizationState = {
  polygons: Polygon[];
  speed: number;
};

const N_POLYGONS = 100;
const N_POINTS = 4;
const BOUNDS_MIN = 0.05;
const BOUNDS_MAX = 0.95;
const SPEED_MIN = 0.001;
const SPEED_MAX = 0.01;

const initializePolygons = () => {
  const polygons: Polygon[] = [];
  let polyCount = 0;

  while (polyCount < N_POLYGONS) {
    const points: Point[] = [];
    let pointCount = 0;

    while (pointCount < N_POINTS) {
      points.push({
        id: pointCount + 1,
        x: rand(BOUNDS_MIN, BOUNDS_MAX),
        y: rand(BOUNDS_MIN, BOUNDS_MAX),
        direction: {
          x: rand(-1, 1),
          y: rand(-1, 1),
        },
      });

      pointCount++;
    }

    polygons.push({
      id: polyCount + 1,
      strength: polyCount === 0 ? 1 : exp(scale(polyCount, 1, N_POLYGONS, 1, 0)) * 0.25,
      points,
    });

    polyCount++;
  }

  return polygons;
};

const initializeState = (): VisualizationState => {
  const polygons = initializePolygons();

  return {
    polygons,
    speed: (SPEED_MAX - SPEED_MIN) / 2,
  };
};

const speedDrunk = drunk(SPEED_MIN, SPEED_MAX);

const updateFirstPolygon = (state: VisualizationState) => {
  const { polygons } = state;
  const firstPolygon = polygons[0];
  const end = firstPolygon.points.length;
  let p = 0;

  while (p < end) {
    const point = firstPolygon.points[p];
    let hasHitBounds = false;

    if (point.x >= BOUNDS_MAX) {
      point.direction.x = rand(-1, 0);
      hasHitBounds = true;
    } else if (point.x <= BOUNDS_MIN) {
      point.direction.x = rand(0, 1);
      hasHitBounds = true;
    }

    if (point.y >= BOUNDS_MAX) {
      point.direction.y = rand(-1, 0);
      hasHitBounds = true;
    } else if (point.y <= BOUNDS_MIN) {
      point.direction.y = rand(0, 1);
      hasHitBounds = true;
    }

    if (hasHitBounds) {
      state.speed = speedDrunk();
    }

    point.x += (point.direction.x * state.speed);
    point.y += (point.direction.y * state.speed);

    p++;
  }
};

const useVisualizationState = () => {
  const state = useRef<VisualizationState>(initializeState());

  const tickHandler = useCallback(() => {
    updateFirstPolygon(state.current);
  }, [state]);

  useEffect(() => {
    const timerId = setInterval(tickHandler, ms('60fps'));

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return state;
};


export default useVisualizationState;
