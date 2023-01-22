import { useEffect, useRef, useState, useCallback } from 'react';
import { alpha, clear, fill, drawPolygon, rect, stroke, strokeWeight } from '../lib/helpers';

export interface CanvasAPI {
  alpha: ReturnType<typeof alpha>;
  clear: ReturnType<typeof clear>;
  fill: ReturnType<typeof fill>;
  drawPolygon: ReturnType<typeof drawPolygon>;
  rect: ReturnType<typeof rect>;
  stroke: ReturnType<typeof stroke>;
  strokeWeight: ReturnType<typeof strokeWeight>;
}

export const bindHelpers = (context: CanvasRenderingContext2D, helpers: {
  [key: string]: typeof clear | typeof alpha | typeof fill | typeof drawPolygon | typeof strokeWeight | typeof stroke | typeof rect;
}): CanvasAPI =>
  Object.entries(helpers).reduce(
    (res, [name, helper]) => ({
      ...res,
      [name]: helper(context),
    }),
    {} as CanvasAPI
  );

type CanvasApiState = {
  helpers: CanvasAPI;
  isReady: boolean;
}

interface UseCanvasApiProps {
  containerRect?: DOMRect;
}

const useCanvasApi = (props: UseCanvasApiProps) => {
  const { containerRect } = props;

  const canvasRef = useRef<HTMLCanvasElement>();

  const [state, setState] = useState<CanvasApiState>({
    isReady: false,
    helpers: null,
  });

  const { isReady, helpers } = state;

  const resizeCanvas = useCallback((updatedBounds: DOMRect) => {
    const { width, height } = updatedBounds;
    const canvas = canvasRef.current;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;
  }, []);

  useEffect(() => {
    if (containerRect) {
      resizeCanvas(containerRect);
    }
  }, [containerRect]);

  useEffect(() => {
    if (!isReady && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const helpers = bindHelpers(context, {
        alpha,
        clear,
        drawPolygon,
        fill,
        rect,
        stroke,
        strokeWeight,
      });

      setState(prevState => ({
        ...prevState,
        helpers,
        isReady: true,
      }));
    }
  }, [canvasRef, isReady]);

  return {
    canvasRef,
    helpers,
  };
};

export default useCanvasApi;
