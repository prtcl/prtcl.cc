import {
  useEffect,
  type CanvasHTMLAttributes,
  type MutableRefObject,
  useRef,
  useState,
  useMemo,
} from 'react';
import CanvasApi from './lib/CanvasApi';

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
      canvasRef,
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

type CanvasRef = MutableRefObject<HTMLCanvasElement>;

export interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  canvasRef: CanvasRef;
  onReady: (ref: CanvasRef) => void;
}

const Canvas = (props: CanvasProps) => {
  const { canvasRef, onReady, ...canvasProps } = props;
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (canvasRef.current && !hasInitialized.current) {
      onReady(canvasRef);
      hasInitialized.current = true;
    }
  }, [canvasRef, onReady]);

  return (
    <canvas
      {...canvasProps}
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Canvas;
