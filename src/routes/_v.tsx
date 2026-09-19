import { ClientOnly, createFileRoute, Outlet } from '@tanstack/react-router';
import { Box, Flex, styled } from 'styled-system/jsx';
import { Visualization, VisualizationProvider } from '~/feat/Visualization';

const Layout = () => {
  return (
    <VisualizationProvider>
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
        <Flex width="100%" height="100%" mixBlendMode="difference">
          <Outlet />
        </Flex>
      </styled.main>
    </VisualizationProvider>
  );
};

export const Route = createFileRoute('/_v')({
  component: Layout,
});
