import { Flex } from 'styled-system/jsx';
import Link from '~/ui/Link';

const formatProjectUrl = (content: string): string => {
  const url = new URL(content);
  let path = url.pathname;

  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
  }

  return `${url.host.replace('www.', '')}${path}${url.search}`;
};

export const ProjectUrl = (props: { url: string }) => {
  const { url } = props;
  const displayUrl = formatProjectUrl(url);

  return (
    <Flex flex={1} minWidth={0} overflow="hidden" width={0}>
      <Link
        color="zinc.600"
        display="block"
        fontSize={['0.9168rem', '1rem']}
        fontStyle="italic"
        fontWeight={500}
        href={url}
        maxWidth={['100%', '18rem', '20rem', '25rem', '28rem']}
        overflow="hidden"
        target="_blank"
        textDecoration="underline"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        width="100%"
        _hover={{
          textDecoration: 'none',
        }}
      >
        &raquo; {displayUrl}
      </Link>
    </Flex>
  );
};
