import {
  useEffect,
  type CanvasHTMLAttributes,
  type MutableRefObject,
  useRef,
} from 'react';

type CanvasRef = MutableRefObject<HTMLCanvasElement>;

export interface CanvasProps
  extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'ref'> {
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
