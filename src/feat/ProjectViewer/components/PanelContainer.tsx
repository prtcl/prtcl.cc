import { type PropsWithChildren } from 'react';
import { Flex, Stack } from 'styled-system/jsx';

export const PanelContainer = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <Flex
      bg="white"
      borderRadius={[8, 12]}
      direction="column"
      flex={1}
      overflowX="hidden"
      overflowY="auto"
      position="relative"
      shadow="2xl"
      zIndex={0}
    >
      {children}
    </Flex>
  );
};

export const PanelHeader = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <Flex
      maxHeight="fit-content"
      position={['initial', 'initial', 'fixed']}
      px={[0, 1]}
      py={[0.25, 0.5]}
      width="100%"
      zIndex={1}
    >
      {children}
    </Flex>
  );
};

export const PanelFooter = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <Stack
      alignItems="center"
      direction="row"
      flex={1}
      gap={1.5}
      justifyContent="center"
      maxHeight="fit-content"
      overflow="hidden"
      pl={4}
      pr={[1, 2]}
      py={[0.5, 1]}
      shadow="md"
      userSelect="none"
      width="100%"
    >
      {children}
    </Stack>
  );
};