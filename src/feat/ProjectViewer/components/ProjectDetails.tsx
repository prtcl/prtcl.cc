import {
  animated,
  useTransition,
  type TransitionFrom,
  type TransitionTo,
} from '@react-spring/web';
import { useQuery } from 'convex/react';
import { Flex } from 'styled-system/jsx';
import { api } from '~/convex/api';
import Image from '~/ui/Image';
import type { Directions } from '../hooks/useNextPrev';
import type { ProjectId } from '../hooks/useProjectViewer';
import { MediaEmbed } from './MediaEmbed';

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

const InnerDetails = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const details = useQuery(api.details.loadProjectDetails, { projectId });
  const { embed, coverImage } = details || {};

  console.log(details);

  return (
    <Flex direction="column" flex={1} width="100%" height="100%">
      {details ? (
        <>
          {coverImage && (
            <Flex
              alignItems="start"
              flexShrink={0}
              justifyContent="start"
              objectFit="cover"
              overflow="hidden"
              position="relative"
              width="100%"
              _selection={{ bg: 'transparent' }}
            >
              <Image
                alt={coverImage.alt}
                minHeight="fit-content"
                objectFit="contain"
                objectPosition="top"
                options={{ width: 1280, quality: 75, fit: 'cover' }}
                src={coverImage.url}
                useAnimation={false}
                width="100%"
                _selection={{ bg: 'transparent' }}
              />
            </Flex>
          )}
          {embed && (
            <MediaEmbed
              service={embed.service}
              src={embed.src}
              title={embed.title}
            />
          )}
        </>
      ) : null}
    </Flex>
  );
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
          <InnerDetails projectId={currentId} />
        </animated.div>
      ))}
    </Flex>
  );
};
