import { Box, styled } from 'styled-system/jsx';

export const Root = styled('main', {
  base: {
    height: '100%',
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
});

export const VizContainer = styled(Box, {
  base: {
    height: '100%',
    inset: 0,
    pointerEvents: 'none',
    position: 'fixed',
    width: '100%',
    zIndex: 0,
  },
});

export const ContentOverlay = styled(Box, {
  base: {
    backdropFilter: 'blur(5px)',
    minHeight: '100%',
    width: '100%',
    zIndex: 1,
  },
});
