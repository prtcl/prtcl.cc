import { type PropsWithChildren } from 'react';
import { Flex } from 'styled-system/jsx';

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
