import type { BoxProps } from 'theme-ui';
import { Box } from 'theme-ui';

export const VizContainer = (props: BoxProps) => {
  const { children, ...boxProps } = props;

  return (
    <Box
      {...boxProps}
      sx={{
        ...boxProps.sx,
        height: '100%',
        width: '100%',
      }}
    >
      {props.children}
    </Box>
  );
};

export const ContentOverlay = (props: BoxProps) => {
  const { children, ...boxProps } = props;

  return (
    <Box
      {...boxProps}
      sx={{
        ...boxProps.sx,
        backdropFilter: 'blur(5px)',
        height: '100%',
        left: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 9999,
      }}
    >
      {children}
    </Box>
  );
};

export const Layout = (props: BoxProps) => {
  const { children, ...boxProps } = props;

  return (
    <Box
      {...boxProps}
      sx={{
        ...boxProps.sx,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {children}
    </Box>
  );
};
