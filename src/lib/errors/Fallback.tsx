import { Flex } from 'styled-system/jsx';
import { Text } from '~/ui/Text';

export const Fallback = (props: { title: string }) => {
  const { title } = props;

  return (
    <Flex alignItems="center" justifyContent="center" flex={1} width="100%">
      <Text>{title}</Text>
    </Flex>
  );
};
