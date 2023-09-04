import { useBreakpointIndex } from '@theme-ui/match-media';

const useBreakpoints = () => {
  const index = useBreakpointIndex();

  return {
    isMobile: index === 0,
  };
};

export default useBreakpoints;
