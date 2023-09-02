import type { BoxProps } from 'theme-ui';
import { Box } from 'theme-ui';

const Stack = (props: BoxProps & { spacing?: number }) => {
  const { children, spacing = 2, ...boxProps } = props;

  return (
    <Box
      {...boxProps}
      sx={{ ...boxProps.sx, display: 'grid', gridGap: spacing }}
    >
      {children}
    </Box>
  );
};

export default Stack;
