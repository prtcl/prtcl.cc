import { animated, useTransition } from '@react-spring/web';
import { useQuery } from 'convex/react';
import { Flex, styled, type FlexProps } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { MediaEmbed } from '~/ui/MediaEmbed';
import type { ProjectId } from '../types';

const Container = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex px={0.5}>
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
    position: 'fixed',
    top: 0,
    width: '100%',
  },
});

export const EmbedViewer = (props: {
  projectId: ProjectId;
  isOpen: boolean;
}) => {
  const { projectId, isOpen } = props;
  const embedCode = useQuery(api.projects.loadProjectEmbed, { projectId });
  const transitions = useTransition(isOpen && embedCode, {
    from: { opacity: 0, scale: 0.88 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.88 },
  });

  return transitions((styles, shouldRender) => {
    if (shouldRender) {
      return (
        <ViewerPosition style={styles}>
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
