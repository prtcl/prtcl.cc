import type { PropsWithChildren } from 'react';
import { Box } from 'theme-ui';

export const Layout = (props: PropsWithChildren) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {props.children}
    </Box>
  );
};
