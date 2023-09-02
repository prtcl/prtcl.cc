import { useEffect, useMemo, useRef, useState } from 'react';
import type { CanvasProps } from '../components/Canvas';
import CanvasApi from '../lib/CanvasApi';

const useCanvasApi = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
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
    canvasProps,
  };
};

export default useCanvasApi;
