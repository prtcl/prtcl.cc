import {
  forwardRef,
  type CanvasHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CanvasApi } from './lib/CanvasApi';
import { isCanvasMutableRef, type CanvasRef } from './types';

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<{
    isReady: boolean;
    canvas: CanvasApi;
  }>(() => ({
    isReady: false,
    canvas: undefined,
  }));

  const canvasProps = useMemo<CanvasProps>(
    () => ({
      ref: canvasRef,
      onReady: () => {
        setState({
          canvas: new CanvasApi(canvasRef.current),
          isReady: true,
        });
      },
    }),
    [],
  );

  return {
    ...state,
    props: canvasProps,
  };
};

export interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  ref: CanvasRef;
  onReady: (ref: CanvasRef) => void;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  function Canvas(props, innerRef) {
    const { onReady, ...canvasProps } = props;
    const hasInitialized = useRef(false);

    useEffect(() => {
      if (isCanvasMutableRef(innerRef)) {
        hasInitialized.current = true;
        onReady(innerRef);
      }
    }, [innerRef, onReady]);

    return (
      <canvas
        {...canvasProps}
        ref={innerRef}
        style={{ width: '100%', height: '100%' }}
      />
    );
  },
);
