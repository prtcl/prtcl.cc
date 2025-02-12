import { useEffect, useRef } from 'react';

export const useScrollDelta = (
  callback: () => void,
  { threshold }: { threshold: number },
) => {
  const cb = useRef(callback);
  cb.current = callback;
  useEffect(() => {
    let origin = window.scrollY;
    const watch: EventListener = () => {
      const delta = window.scrollY - origin;
      const isTriggered =
        window.scrollY > origin ? delta >= threshold : delta <= -threshold;

      if (isTriggered) {
        origin = window.scrollY;
        cb.current();
      }
    };
    window.addEventListener('scroll', watch);
    return () => {
      window.removeEventListener('scroll', watch);
    };
  }, [threshold]);
};
