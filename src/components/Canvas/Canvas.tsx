import React, { useCallback } from 'react';
import useAnimationFrame from './hooks/useAnimationFrame';
import useCanvasApi, { CanvasAPI, Dimensions } from './hooks/useCanvasApi';

type CanvasProps = {
  draw: (dimensions: Dimensions, helpers: CanvasAPI) => void;
};

const Canvas = (props: CanvasProps) => {
  const { draw } = props;

  const { canvasRef, dimensions, helpers } = useCanvasApi();

  const handleTick = useCallback(() => {
    if (!helpers) {
      return;
    }

    draw(dimensions, helpers);
  }, [dimensions, helpers]);

  useAnimationFrame({ onTick: handleTick });

  console.log({ canvasRef, dimensions, helpers });

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default Canvas;
