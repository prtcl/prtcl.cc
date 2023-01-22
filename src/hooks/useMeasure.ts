import { useRef, useCallback, useState, useEffect } from 'react';
import debounce from '../utils/debounce';

const useMeasure = () => {
  const measureRef = useRef<HTMLDivElement>();
  const [bounds, setBounds] = useState<DOMRect>();

  const updateDimensions = useCallback(() => {
    setBounds(measureRef.current.getBoundingClientRect());
  }, [measureRef]);

  useEffect(() => {
    const resize = debounce(updateDimensions, 150);
    window.addEventListener('resize', resize);

    updateDimensions();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return {
    bounds,
    measureRef,
  };
};

export default useMeasure;
