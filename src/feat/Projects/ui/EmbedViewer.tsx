import { animated, useTransition } from '@react-spring/web';
import { useQuery } from 'convex/react';
import { type CSSProperties } from 'react';
import { Flex, styled, type FlexProps } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { MediaEmbed, Service } from '~/ui/MediaEmbed';
import type { EmbedCodeEntity, ProjectId } from '../types';

const Container = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex px={1.5}>
      <Flex
        borderRadius={12}
        flex={1}
        height="fit-content"
        minHeight="fit-content"
        overflow="hidden"
        shadow="2xl"
        transition="opacity 168ms cubic-bezier(.79,.31,.59,.83)"
        width="100%"
        {...flexProps}
      >
        {children}
      </Flex>
    </Flex>
  );
};

const ViewerPosition = styled(animated.div, {
  base: {
    height: 'fit-content',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

const getEstimatedViewerHeight = (embedCode: EmbedCodeEntity): number => {
  switch (embedCode.service) {
    case Service.BANDCAMP: {
      return embedCode.src.includes('VideoEmbed') ? 380 : 120;
    }
    case Service.YOUTUBE:
    case Service.SOUNDCLOUD: {
      return 300;
    }
    default: {
      return 0;
    }
  }
};

const calculateOffsetStyles = (
  embedCode: EmbedCodeEntity,
  origin: DOMRect,
): CSSProperties => {
  if (origin.top <= window.innerHeight / 2) {
    return { top: origin.top + window.scrollY };
  }
  return {
    top:
      origin.bottom + window.scrollY + 8 - getEstimatedViewerHeight(embedCode),
  };
};

export const EmbedViewer = (props: {
  isOpen: boolean;
  origin: DOMRect | null;
  projectId: ProjectId;
}) => {
  const { projectId, isOpen, origin } = props;
  const embedCode = useQuery(api.projects.loadProjectEmbed, { projectId });
  const transitions = useTransition(isOpen && embedCode, {
    from: { opacity: 1, scale: 0.88 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.88 },
  });

  return transitions((styles, shouldRender) => {
    if (shouldRender) {
      return (
        <ViewerPosition
          style={{ ...styles, ...calculateOffsetStyles(embedCode, origin) }}
        >
          <Container>
            <MediaEmbed
              service={embedCode.service}
              src={embedCode.src}
              title={embedCode.title}
            />
          </Container>
        </ViewerPosition>
      );
    }

    return null;
  });
};
