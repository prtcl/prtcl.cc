import { useEffect, useRef, useState } from 'react';
import { alpha, clear, fill, rect, stroke, strokeWeight } from '../lib/helpers';

export interface CanvasAPI {
  alpha: ReturnType<typeof alpha>;
  clear: ReturnType<typeof clear>;
  fill: ReturnType<typeof fill>;
  rect: ReturnType<typeof rect>;
  stroke: ReturnType<typeof stroke>;
  strokeWeight: ReturnType<typeof strokeWeight>;
}

export type Dimensions = {
  width: number;
  height: number;
}

export const bindHelpers = (context: CanvasRenderingContext2D, helpers: {
  [key: string]: typeof clear | typeof alpha | typeof fill | typeof strokeWeight | typeof stroke | typeof rect;
}): CanvasAPI =>
  Object.entries(helpers).reduce(
    (res, [name, helper]) => ({
      ...res,
      [name]: helper(context),
    }),
    {} as CanvasAPI
  );

type CanvasApiState = {
  dimensions: Dimensions;
  helpers: CanvasAPI;
  isReady: boolean;
}

const useCanvasApi = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  const [state, setState] = useState<CanvasApiState>({
    isReady: false,
    dimensions: null,
    helpers: null,
  });

  const { isReady, helpers, dimensions } = state;

  useEffect(() => {
    if (!isReady && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const helpers = bindHelpers(context, {
        alpha,
        clear,
        fill,
        rect,
        stroke,
        strokeWeight,
      });

      setState(prevState => ({
        ...prevState,
        dimensions: { width: canvas.width, height: canvas.height },
        helpers,
        isReady: true,
      }));
    }
  }, [canvasRef, isReady]);

  return {
    canvasRef,
    dimensions,
    helpers,
  };
};

export default useCanvasApi;
