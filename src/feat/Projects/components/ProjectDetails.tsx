import {
  animated,
  useTransition,
  type TransitionFrom,
  type TransitionTo,
} from '@react-spring/web';
import { useQuery } from 'convex/react';
import { useCallback, useState } from 'react';
import useMeasure from 'react-use/lib/useMeasure';
import { Flex, type FlexProps } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { Image } from '~/ui/Image';
import { Loader } from '~/ui/Loader';
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

const CoverImage = (props: {
  hasSeenImages: Set<ProjectId>;
  projectId: ProjectId;
}) => {
  const { projectId, hasSeenImages } = props;
  const [containerRef, containerRect] = useMeasure();
  const [isLoading, setLoading] = useState(true);
  const coverImage = useQuery(api.projects.loadProjectCoverImage, {
    projectId,
  });
  const handleLoad = useCallback(() => {
    hasSeenImages.add(projectId);
    setLoading(false);
  }, [hasSeenImages, projectId]);

  if (!coverImage) {
    return null;
  }

  const { aspectRatio } = coverImage;
  const calculatedHeight = containerRect.width
    ? Math.min(
        Math.round(containerRect.width * aspectRatio),
        containerRect.height,
      )
    : 0;

  return (
    <Flex
      alignItems="start"
      flexBasis="fit-content"
      flexGrow={1}
      flexShrink={[0, 1]}
      height="100%"
      justifyContent="start"
      objectFit="cover"
      overflow="hidden"
      position="relative"
      py={[4, 0]}
      ref={containerRef}
      width="100%"
      _selection={{ bg: 'transparent' }}
    >
      <Image
        alt={coverImage.alt}
        flexShrink={0}
        height="100%"
        objectFit="contain"
        objectPosition="center"
        onLoad={() => handleLoad()}
        options={{ width: 1280, quality: 75, fit: 'cover' }}
        src={coverImage.publicUrl}
        style={{ minHeight: `${calculatedHeight}px` }}
        useAnimation={!hasSeenImages.has(projectId)}
        width="100%"
        _selection={{ bg: 'transparent' }}
      />
      {isLoading && (
        <Loader
          color="zinc.300/50"
          left="50%"
          position="absolute"
          size="md"
          top="50%"
          transform="translate(-50%, -50%)"
        />
      )}
    </Flex>
  );
};

const EmbedCode = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const embedCode = useQuery(api.projects.loadProjectEmbed, { projectId });

  if (!embedCode) {
    return null;
  }

  return (
    <Flex flex={1} minHeight="fit-content" width="100%">
      <MediaEmbed
        service={embedCode.service}
        src={embedCode.src}
        title={embedCode.title}
      />
    </Flex>
  );
};

const Content = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const content = useQuery(api.projects.loadProjectContent, { projectId });

  if (!content) {
    return null;
  }

  return (
    <Flex
      alignSelf="center"
      bg={['initial', 'zinc.100/98']}
      borderColor={['initial', 'zinc.100']}
      borderRadius={12}
      borderWidth={[0, 1]}
      bottom={['initial', 6]}
      direction="column"
      flexGrow={[1, 0]}
      flexShrink={0}
      height={['100%', 'fit-content']}
      maxWidth={['initial', 'calc(100% - 2rem)', 'calc(100% - 2rem)', '84%']}
      mt={[-1.5, 0]}
      padding={[0, 3]}
      pb={[6, 4]}
      position={['initial', 'fixed']}
      pt={[0, 4]}
      px={['0.68rem', 4]}
      shadow={['initial', 'lg']}
    >
      <Markdown color="zinc.900">{content.content}</Markdown>
    </Flex>
  );
};

export const ProjectDetails = (props: {
  direction: Directions;
  projectId: ProjectId;
}) => {
  const { direction, projectId } = props;
  const [hasSeenImages] = useState<Set<ProjectId>>(() => new Set());
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
          <ScrollContainer>
            <CoverImage projectId={currentId} hasSeenImages={hasSeenImages} />
            <Content projectId={currentId} />
            <EmbedCode projectId={currentId} />
          </ScrollContainer>
        </animated.div>
      ))}
    </Flex>
  );
};
