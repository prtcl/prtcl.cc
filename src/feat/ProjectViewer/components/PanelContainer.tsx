import { type PropsWithChildren } from 'react';
import { Flex, Stack } from 'styled-system/jsx';

export const PanelContainer = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <Flex
      bg="white"
      borderRadius={[8, 12]}
      flex={1}
      overflowX="hidden"
      overflowY="auto"
      shadow="2xl"
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
      bg="zinc.100"
      direction="row"
      flex={1}
      gap={2}
      justifyContent="center"
      maxHeight={12}
      shadow="md"
      overflow="hidden"
      width="100%"
    >
      {children}
    </Stack>
  );
};
