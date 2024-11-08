import {
  animated,
  useTransition,
  type TransitionFrom,
  type TransitionTo,
} from '@react-spring/web';
import { Flex } from 'styled-system/jsx';
import { Link } from '~/ui/Link';
import type { Directions } from '../hooks/useNextPrev';

const formatProjectUrl = (content: string): string => {
  const url = new URL(content);
  let path = url.pathname;

  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
  }

  return `${url.host.replace('www.', '')}${path}${url.search}`;
};

const fromTransition = (direction: Directions): TransitionFrom<string> => {
  const distance = 2;
  if (direction !== 0) {
    return {
      transform: `translate3d(${direction === 1 ? distance : -distance}%, 0, 0)`,
      opacity: 0.68,
    };
  }

  return {
    transform: 'translate3d(0%, 0, 0)',
    opacity: 0,
  };
};

const toTransition = (direction: Directions): TransitionTo<string> => {
  const distance = 2;
  if (direction !== 0) {
    return {
      transform: `translate3d(${direction === 1 ? -distance : distance}%, 0, 0)`,
      opacity: 0,
      position: 'absolute',
    };
  }

  return {
    transform: 'translate3d(0%, 0, 0)',
    opacity: 0,
  };
};

export const ProjectUrl = (props: { url?: string; direction: Directions }) => {
  const { url, direction } = props;

  const transitions = useTransition(url, {
    from: fromTransition(direction),
    enter: {
      transform: 'translate3d(0%, 0, 0)',
      opacity: 1,
    },
    leave: toTransition(direction),
  });

  return (
    <Flex
      flex={1}
      height="100%"
      minWidth={0}
      overflow="hidden"
      position="relative"
      width={0}
    >
      {transitions((style, projectUrl) => (
        <>
          {projectUrl && (
            <animated.div
              style={{
                ...style,
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                width: '100%',
              }}
            >
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
                &raquo; {formatProjectUrl(projectUrl)}
              </Link>
            </animated.div>
          )}
        </>
      ))}
    </Flex>
  );
};
