import React, { useCallback } from 'react';
import { scale } from 'plonk';
import Canvas, { CanvasAPI, PolygonCoord } from '../Canvas';
import useVisualizationState, { Polygon } from './hooks/useVisualizationState';

const scalePolygonToCoordinates = (polygon: Polygon, dimensions: DOMRect) => {
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

  const handleTick = useCallback((dimensions: DOMRect, helpers: CanvasAPI) => {
    const { width, height } = dimensions;
    const { alpha, clear, drawPolygon, stroke, strokeWeight } = helpers;
    const { polygons } = state.current;

    clear(width, height);
    stroke(12, 12, 12);
    strokeWeight(1);

    const end = polygons.length;
    let p = 0;

    while (p < end) {
      const poly = polygons[p];
      const coords = scalePolygonToCoordinates(poly, dimensions);
      const shouldFill = p === 0;

      alpha(poly.strength);
      drawPolygon(coords, shouldFill);

      p++;
    }
  }, [state]);

  return <Canvas draw={handleTick} />;
};

export default Visualization;
