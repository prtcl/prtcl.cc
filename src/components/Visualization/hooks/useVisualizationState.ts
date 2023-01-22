import { useRef } from 'react';
import { drunk, exp, rand, scale } from 'plonk';

type Point = {
  id: number;
  x: number;
  y: number;
  direction: {
    x: number;
    y: number;
  };
};

type Polygon = {
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
    speed: 0.002,
  };
};

const useVisualizationState = () => {
  const state = useRef<VisualizationState>(initializeState());

  return state;
};


export default useVisualizationState;
