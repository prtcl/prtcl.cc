import {
  animated,
  useTransition,
  type TransitionFrom,
  type TransitionTo,
} from '@react-spring/web';
import { useQuery } from 'convex/react';
import { Flex, type FlexProps } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { Image } from '~/ui/Image';
import { Markdown } from '~/ui/Markdown';
import { MediaEmbed } from '~/ui/MediaEmbed';
import type { Directions } from '../hooks/useNextPrev';
import type { ProjectId } from '../types';

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

const ScrollContainer = (props: FlexProps) => {
  const { children, ...flexProps } = props;

  return (
    <Flex
      direction="column"
      flex={1}
      width="100%"
      height="100%"
      overflowX="hidden"
      overflowY="auto"
      {...flexProps}
    >
      {children}
    </Flex>
  );
};

const ImageContainer = (props: FlexProps) => {
  const { children, ...flexProps } = props;

  return (
    <Flex
      alignItems="start"
      flex={1}
      height="100%"
      justifyContent="start"
      objectFit="cover"
      overflow="hidden"
      position="relative"
      width="100%"
      _selection={{ bg: 'transparent' }}
      {...flexProps}
    >
      {children}
    </Flex>
  );
};

const EmbedContainer = (props: FlexProps) => {
  const { children, ...flexProps } = props;

  return (
    <Flex flex={1} minHeight="fit-content" width="100%" {...flexProps}>
      {children}
    </Flex>
  );
};

const ContentContainer = (props: FlexProps) => {
  const { children, ...flexProps } = props;

  return (
    <Flex
      alignSelf="center"
      bg={['initial', 'zinc.100/98']}
      borderColor={['initial', 'zinc.100']}
      borderRadius={12}
      borderWidth={[0, 1]}
      bottom={['initial', 4]}
      direction="column"
      mt={[-2.5, 0]}
      padding={[0, 3]}
      pb={[5, 2.5]}
      position={['initial', 'fixed']}
      pt={[0, 3]}
      px={2.5}
      shadow={['initial', 'lg']}
      width={['initial', 'calc(100% - 2rem)', 'calc(100% - 2rem)', '84%']}
      {...flexProps}
    >
      {children}
    </Flex>
  );
};

const InnerDetails = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const details = useQuery(api.details.loadProjectDetails, { projectId });
  const { content, embed, coverImage } = details || {};

  return (
    <ScrollContainer>
      <>
        {coverImage && (
          <ImageContainer
            {...(content
              ? {
                  flexGrow: 1,
                  flexBasis: 'fit-content',
                  flexShrink: 0,
                  py: [4, 0],
                }
              : {})}
          >
            <Image
              alt={coverImage.alt}
              height="100%"
              objectFit="contain"
              objectPosition="center"
              options={{ width: 1280, quality: 75, fit: 'cover' }}
              src={coverImage.url}
              useAnimation={false}
              width="100%"
              flexShrink={0}
              _selection={{ bg: 'transparent' }}
            />
          </ImageContainer>
        )}
        {content && (
          <ContentContainer>
            <Markdown color="zinc.900">{content}</Markdown>
          </ContentContainer>
        )}
        {embed && (
          <EmbedContainer>
            <MediaEmbed
              service={embed.service}
              src={embed.src}
              title={embed.title}
            />
          </EmbedContainer>
        )}
      </>
    </ScrollContainer>
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
