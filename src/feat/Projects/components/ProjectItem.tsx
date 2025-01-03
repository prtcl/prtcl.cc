import { animated, useSpring } from '@react-spring/web';
import { memo } from 'react';
import { Flex, Stack } from 'styled-system/jsx';
import { Badge } from '~/ui/Badge';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';
import { LinkIcon, WaveIcon } from '~/ui/icons';
import type { ProjectEntity, ProjectId } from '../types';
import { Preview } from './Preview';

export const formatTimestamp = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US');

export interface ProjectItemProps {
  isSelected: boolean;
  item: ProjectEntity;
  onSelect: (projectId: ProjectId) => void;
}

export const ProjectItem = memo<ProjectItemProps>(
  function ProjectItem(props) {
    const { isSelected, item, onSelect } = props;
    const { _id, title, url, category, publishedAt } = item;
    const styles = useSpring({
      from: { opacity: 1, marginBlock: '0rem' },
      to: isSelected
        ? { opacity: 0, marginBlock: '0.68rem' }
        : { opacity: 1, marginBlock: '0rem' },
    });

    return (
      <animated.div style={styles}>
        <Stack direction="column" gap={1}>
          <Preview projectId={_id}>
            <Link
              color="text"
              fontWeight={500}
              href={url}
              target="_blank"
              onClick={(e) => {
                e.preventDefault();
                onSelect(_id);
              }}
            >
              {title}
            </Link>
          </Preview>
          <Stack direction="row" gap={2}>
            <Badge>{category}</Badge>
            <Text fontSize="xs" color="zinc.700">
              {formatTimestamp(publishedAt)}
            </Text>
            <Flex alignItems="center" justifyContent="center">
              {['sound', 'video'].includes(item.category) && item.embedId ? (
                <WaveIcon color="primary" size="sm" mt="-1px" />
              ) : (
                <LinkIcon color="primary" size="sm" />
              )}
            </Flex>
          </Stack>
        </Stack>
      </animated.div>
    );
  },
  (prev, next) =>
    prev.item._id === next.item._id && prev.isSelected === next.isSelected,
);
