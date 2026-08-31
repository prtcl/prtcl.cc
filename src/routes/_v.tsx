import { ClientOnly, createFileRoute, Outlet } from '@tanstack/react-router';
import { Box, Center, styled } from 'styled-system/jsx';
import { Visualization } from '~/feat/Visualization';

const Layout = () => {
  return (
    <styled.main height="100%" position="relative" width="100%" zIndex={0}>
      <ClientOnly>
        <Box
          height="100vh"
          inset={0}
          minHeight="100lvh"
          pointerEvents="none"
          position="fixed"
          width="100vw"
          zIndex={0}
        >
          <Visualization />
        </Box>
      </ClientOnly>
      <Center
        alignItems="center"
        minHeight={['100%', '100vh']}
        mixBlendMode="difference"
        position="relative"
        width="100%"
      >
        <Outlet />
      </Center>
    </styled.main>
  );
};

export const Route = createFileRoute('/_v')({
  component: Layout,
});
