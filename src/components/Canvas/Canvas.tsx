import React, { useCallback } from 'react';
import useAnimationFrame from '../../hooks/useAnimationFrame';
import useMeasure from '../../hooks/useMeasure';
import useCanvasApi, { CanvasAPI } from './hooks/useCanvasApi';
import styles from './Canvas.less';

interface CanvasProps {
  draw: (dimensions: DOMRect, helpers: CanvasAPI) => void;
}

const Canvas = (props: CanvasProps) => {
  const { draw } = props;

  const { measureRef, bounds } = useMeasure();
  const { canvasRef, helpers } = useCanvasApi({ containerRect: bounds });

  const handleTick = useCallback(() => {
    if (!helpers) {
      return;
    }

    draw(bounds, helpers);
  }, [bounds, helpers]);

  useAnimationFrame({ onTick: handleTick });

  return (
    <div ref={measureRef} className={styles.container}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
