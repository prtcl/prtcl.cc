import { Box, styled } from 'styled-system/jsx';

export const Container = styled(Box, {
  base: {
    height: '100%',
    inset: 0,
    pointerEvents: 'none',
    position: 'fixed',
    width: '100%',
  },
});

export const Overlay = styled(Box, {
  base: {
    backdropFilter: 'blur(5px)',
    height: '100%',
    left: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
});

export const Root = styled('main', {
  base: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});
