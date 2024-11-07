import {
  animated,
  useTransition,
  type TransitionFrom,
  type TransitionTo,
} from '@react-spring/web';
import { useQuery } from 'convex/react';
import { Flex, Stack } from 'styled-system/jsx';
import { api } from '~/convex/api';
import Image from '~/ui/Image';
import type { Directions } from '../hooks/useNextPrev';
import type { ProjectId } from '../hooks/useProjectViewer';

const Overlay = () => (
  <Flex
    bgGradient="to-b"
    bottom={0}
    gradientFrom="transparent"
    gradientTo="white"
    height="100%"
    left={0}
    position="absolute"
    width="100%"
    zIndex={1}
    _selection={{ bg: 'transparent' }}
  />
);

const PreviewHeader = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const preview = useQuery(api.previews.loadProjectPreview, { projectId });

  return (
    <Flex
      alignItems="start"
      flexShrink={0}
      height={['9rem', '12rem']}
      justifyContent="start"
      maxHeight={['9rem', '12rem']}
      objectFit="cover"
      overflow="hidden"
      position="relative"
      width="100%"
      zIndex={0}
      _selection={{ bg: 'transparent' }}
    >
      <Image
        height={['9rem', '12rem']}
        maxHeight={['9rem', '12rem']}
        minHeight="fit-content"
        objectFit="contain"
        objectPosition="top"
        options={{ width: 1280, quality: 75, fit: 'cover' }}
        src={preview?.publicUrl}
        useAnimation={false}
        width="100%"
        zIndex={0}
        _selection={{ bg: 'transparent' }}
      />
      <Overlay />
    </Flex>
  );
};

const fromTransition = (direction: Directions): TransitionFrom<ProjectId> => {
  const distance = 25;
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

const toTransition = (direction: Directions): TransitionTo<ProjectId> => {
  const distance = 25;
  if (direction !== 0) {
    return {
      transform: `translate3d(${direction === 1 ? -distance : distance}%, 0, 0)`,
      opacity: 0,
    };
  }

  return {
    transform: 'translate3d(0%, 0, 0)',
    opacity: 0,
  };
};

export const ProjectDetails = (props: {
  direction: Directions;
  projectId: ProjectId;
}) => {
  const { direction, projectId } = props;
  const transitions = useTransition(projectId, {
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
      overflow="hidden"
      width="100%"
      height="100%"
      position="relative"
    >
      {transitions((style, currentId) => (
        <animated.div
          key={currentId}
          style={{
            ...style,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          <Stack direction="column" gap={4} width="100%" height="100%">
            <PreviewHeader projectId={currentId} />
            <Flex flex={1}></Flex>
          </Stack>
        </animated.div>
      ))}
    </Flex>
  );
};
