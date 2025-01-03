import { animated, useSpring } from '@react-spring/web';
import { memo } from 'react';
import { Stack } from 'styled-system/jsx';
import { Badge } from '~/ui/Badge';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';
import type { ProjectEntity, ProjectId } from '../types';
import { Preview } from './Preview';

export const formatTimestamp = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US');

export interface ProjectItemProps {
  isPreviewEnabled: boolean;
  isSelected: boolean;
  isViewerEnabled: boolean;
  item: ProjectEntity;
  onSelect: (projectId: ProjectId) => void;
}

export const ProjectItem = memo<ProjectItemProps>(
  function ProjectItem(props) {
    const { isPreviewEnabled, isSelected, isViewerEnabled, item, onSelect } =
      props;
    const { _id, title, url, category, publishedAt } = item;
    const styles = useSpring({
      from: { opacity: 1, marginBlock: '0rem' },
      to: isSelected
        ? { opacity: 0, marginBlock: '0.68rem' }
        : { opacity: 1, marginBlock: '0rem' },
    });
    const innerContent = (
      <Link
        color="text"
        fontWeight={500}
        href={url}
        target="_blank"
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
    );

    return (
      <animated.div style={styles}>
        <Stack direction="column" gap={1}>
          {isPreviewEnabled ? (
            <Preview projectId={_id}>{innerContent}</Preview>
          ) : (
            innerContent
          )}
          <Stack direction="row" gap={2}>
            <Badge>{category}</Badge>
            <Text fontSize="xs" color="zinc.700">
              {formatTimestamp(publishedAt)}
            </Text>
          </Stack>
        </Stack>
      </animated.div>
    );
  },
  (prev, next) =>
    prev.item._id === next.item._id && prev.isSelected === next.isSelected,
);
