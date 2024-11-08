import { memo } from 'react';
import { Stack } from 'styled-system/jsx';
import { Preview } from '~/feat/Preview';
import { Badge } from '~/ui/Badge';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';
import type { ProjectEntity, ProjectId } from '../hooks/useProjectViewer';

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
