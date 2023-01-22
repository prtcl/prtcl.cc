import React, { useCallback } from 'react';
import { scale } from 'plonk';
import Canvas, { CanvasAPI, Dimensions, PolygonCoord } from '../Canvas';
import useVisualizationState, { Polygon } from './hooks/useVisualizationState';

const scalePolygonToCoordinates = (polygon: Polygon, dimensions: Dimensions) => {
  const { points } = polygon;
  const coords: PolygonCoord[] = [];
  const end = points.length;
  let p = 0;

  while (p < end) {
    const point = points[p];

    coords.push([
      scale(point.x, 0, 1, 0, dimensions.width),
      scale(point.y, 0, 1, 0, dimensions.height),
    ]);

    p++;
  }

  return coords;
};

const Visualization = () => {
  const state = useVisualizationState();

  console.log(state.current);

  const handleTick = useCallback((dimensions: Dimensions, helpers: CanvasAPI) => {
    const { width, height } = dimensions;
    const { alpha, clear, drawPolygon, stroke, strokeWeight } = helpers;

    const { polygons } = state.current;
    const first = polygons[0];
    const coords = scalePolygonToCoordinates(first, dimensions);

    // clear(width, height);
    stroke(0, 0, 0);
    strokeWeight(1);
    alpha(first.strength);
    drawPolygon(coords, false);
  }, [state]);

  return <Canvas draw={handleTick} />;
};

export default Visualization;
