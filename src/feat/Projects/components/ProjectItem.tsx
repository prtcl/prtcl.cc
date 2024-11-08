import { useQuery } from 'convex/react';
import { memo } from 'react';
import { type PropsWithChildren } from 'react';
import { Flex, Stack } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { useInteractions } from '~/lib/viewport';
import { Badge } from '~/ui/Badge';
import * as HoverCard from '~/ui/HoverCard';
import { Image } from '~/ui/Image';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';
import type { ProjectEntity, ProjectId } from '../types';

const InnerPreview = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const preview = useQuery(api.previews.loadProjectPreview, { projectId });

  return (
    <Flex overflow="hidden" width="256px" height="180px">
      <Image
        height="180px"
        options={{ width: 256 }}
        src={preview?.publicUrl}
        useHighRes
        width="256px"
      />
    </Flex>
  );
};

export const Preview = (props: PropsWithChildren<{ projectId: ProjectId }>) => {
  const { children, projectId } = props;
  const { hasHover } = useInteractions();

  if (!hasHover) {
    return children;
  }

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{children}</HoverCard.Trigger>
      <HoverCard.Content>
        <InnerPreview projectId={projectId} />
      </HoverCard.Content>
    </HoverCard.Root>
  );
};

export const formatTimestamp = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US');

export interface ProjectItemProps {
  isPreviewEnabled: boolean;
  isViewerEnabled: boolean;
  item: ProjectEntity;
  onSelect: (projectId: ProjectId) => void;
}

export const ProjectItem = memo<ProjectItemProps>(
  function ProjectItem(props) {
    const { item, isPreviewEnabled, isViewerEnabled, onSelect } = props;
    const { _id, title, url, category, publishedAt } = item;

    return (
      <Stack key={_id} direction="column" gap={1}>
        {isPreviewEnabled ? (
          <Preview projectId={_id}>
            <Link
              href={url}
              color="text"
              fontWeight={500}
              {...(isViewerEnabled
                ? {
                    onClick: (e) => {
                      e.preventDefault();
                      onSelect(_id);
                    },
                  }
                : {})}
            >
              {title}
            </Link>
          </Preview>
        ) : (
          <Link href={url} color="text" fontWeight={500}>
            {title}
          </Link>
        )}
        <Stack direction="row" gap={2}>
          <Badge>{category}</Badge>
          <Text fontSize="xs" color="zinc.700">
            {formatTimestamp(publishedAt)}
          </Text>
        </Stack>
      </Stack>
    );
  },
  (prev, next) => prev.item._id === next.item._id,
);
