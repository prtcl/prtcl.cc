import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';
import { CanvasApi } from './lib/CanvasApi';
import { isCanvasMutableRef } from './types';

type CanvasState = {
  isReady: boolean;
  canvas: CanvasApi;
};

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CanvasState>(() => ({
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

const InnerCanvas = styled('canvas', {
  base: {
    height: '100vh',
    minHeight: '100lvh',
    width: '100vw',
  },
});

export interface CanvasProps extends HTMLStyledProps<'canvas'> {
  onReady: () => void;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  function Canvas(props, innerRef) {
    const { onReady, ...canvasProps } = props;
    const hasInitialized = useRef(false);
    useEffect(() => {
      if (isCanvasMutableRef(innerRef)) {
        hasInitialized.current = true;
        onReady();
      }
    }, [innerRef, onReady]);

    return <InnerCanvas ref={innerRef} {...canvasProps} />;
  },
);
