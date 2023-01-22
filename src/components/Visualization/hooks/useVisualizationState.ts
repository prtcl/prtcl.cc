import { useRef, useEffect, useCallback } from 'react';
import { drunk, exp, ms, rand, scale } from 'plonk';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';

export type Point = {
  x: number;
  y: number;
  direction: {
    x: number;
    y: number;
  };
};

export type Polygon = {
  id: string;
  points: Point[];
}

type PolygonStrengths = Record<string, number>

type VisualizationState = {
  polygons: Polygon[];
  polygonStrength: PolygonStrengths;
  speed: number;
};

const N_POLYGONS = 300;
const INITIAL_POLYGONS = 1;
const N_POINTS = 4;
const BOUNDS_MIN = 0.05;
const BOUNDS_MAX = 0.95;
const SPEED_MIN = 0.001;
const SPEED_MAX = 0.007;

const initializePolygons = () => {
  const polygons: Polygon[] = [];
  let polyCount = 0;

  while (polyCount < INITIAL_POLYGONS) {
    const id = uniqueId();
    const points: Point[] = [];
    let pointCount = 0;

    while (pointCount < N_POINTS) {
      points.push({
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
      id,
      points,
    });

    polyCount++;
  }

  return polygons;
};

const initializePolygonStrength = () => {
  const polygonStrength: PolygonStrengths = {};
  let p = 0;

  while (p < N_POLYGONS) {
    const strength = p === 0 ? 1 : exp(scale(p, 1, N_POLYGONS + 1, 1, 0)) * 0.25;

    polygonStrength[p] = strength;

    p++;
  }

  return polygonStrength;
};

const initializeState = (): VisualizationState => {
  const polygons = initializePolygons();
  const polygonStrength = initializePolygonStrength();

  return {
    polygonStrength,
    polygons,
    speed: (SPEED_MAX - SPEED_MIN) / 2,
  };
};

const speedDrunk = drunk(SPEED_MIN, SPEED_MAX);

const clonePolygon = (poly: Polygon) => ({ ...cloneDeep(poly), id: uniqueId() });

const updateFirstPolygon = (state: VisualizationState) => {
  const { polygons } = state;

  const firstPolygon = clonePolygon(polygons[0]);
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

  polygons.unshift(firstPolygon);

  if (end === N_POLYGONS) {
    polygons.pop();
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
