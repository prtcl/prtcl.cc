import { Box, styled } from 'styled-system/jsx';

export const Container = styled(Box, {
  base: {
    width: '100%',
    height: '100%',
  },
});

export const Overlay = styled(Box, {
  base: {
    backdropFilter: 'blur(5px)',
    height: '100%',
    left: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 9999,
  },
});

export const Root = styled('main', {
  base: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});
