import { useQuery } from 'convex/react';
import { Flex, type FlexProps } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { MediaEmbed } from '~/ui/MediaEmbed';
import type { ProjectId } from '../types';

const Container = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      borderRadius={12}
      flex={1}
      height="fit-content"
      minHeight="fit-content"
      opacity={0}
      overflow="hidden"
      shadow="2xl"
      transition="opacity 168ms cubic-bezier(.79,.31,.59,.83)"
      width="100%"
      {...flexProps}
    >
      {children}
    </Flex>
  );
};

export const EmbedViewer = (props: {
  projectId: ProjectId;
  isOpen: boolean;
}) => {
  const { projectId, isOpen } = props;
  const embedCode = useQuery(api.projects.loadProjectEmbed, { projectId });

  return (
    <Container opacity={embedCode === undefined ? 0 : 1}>
      {embedCode && isOpen && (
        <MediaEmbed
          service={embedCode.service}
          src={embedCode.src}
          title={embedCode.title}
        />
      )}
    </Container>
  );
};
