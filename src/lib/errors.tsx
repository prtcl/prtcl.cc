import { ConvexError } from 'convex/values';
import { Flex } from 'styled-system/jsx';
import { Text } from '~/ui/Text';

export const Fallback = (props: { title: string; error?: unknown }) => {
  const { title, error } = props;
  if (error) {
    console.error(error);
  }

  return (
    <Flex alignItems="center" justifyContent="center" flex={1} width="100%">
      <Text>{title}</Text>
    </Flex>
  );
};

export function isNotFoundError(error: unknown) {
  return error instanceof ConvexError && error.data.code === 404;
}
