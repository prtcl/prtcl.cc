import useMedia from 'react-use/lib/useMedia';

export const useInteractions = () => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasHover = useMedia('(hover: hover)');

  return {
    hasTouch,
    hasHover,
  };
};

// From Panda config
// --breakpoints-sm: 640px;
// --breakpoints-md: 768px;
// --breakpoints-lg: 1024px;
// --breakpoints-xl: 1280px;
// --breakpoints-2xl: 1536px;

export type Breakpoint = 1 | 2 | 3 | 4 | 5 | 6;

export const useBreakpoints = () => {
  const isMobile = useMedia('(max-width: 640px)');
  const isMedium = useMedia('(min-width: 641px) and (max-width: 768px)');
  const isLarge = useMedia('(min-width: 769px) and (max-width: 1024px)');
  const isXl = useMedia('(min-width: 1025px) and (max-width: 1280px)');
  const is2Xl = useMedia('(min-width: 1281px) and (max-width: 1536px)');
  const isFull = useMedia('(min-width: 1537px) ');

  let breakpoint: Breakpoint = 1;

  if (isMedium) {
    breakpoint = 2;
  } else if (isLarge) {
    breakpoint = 3;
  } else if (isXl) {
    breakpoint = 4;
  } else if (is2Xl) {
    breakpoint = 5;
  } else if (isFull) {
    breakpoint = 6;
  }

  return {
    breakpoint,
    is2Xl,
    isLarge,
    isMedium,
    isMobile,
    isXl,
  };
};
