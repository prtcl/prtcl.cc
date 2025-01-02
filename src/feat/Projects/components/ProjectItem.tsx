import { animated, useSpring } from '@react-spring/web';
import { useQuery } from 'convex/react';
import { memo, useMemo, useRef, useState } from 'react';
import { type PropsWithChildren } from 'react';
import { Box, Stack } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { debounce } from '~/lib/debounce';
import { useInteractions } from '~/lib/viewport';
import { Badge } from '~/ui/Badge';
import * as HoverCard from '~/ui/HoverCard';
import { Image } from '~/ui/Image';
import { Link } from '~/ui/Link';
import { Loader } from '~/ui/Loader';
import { Text } from '~/ui/Text';
import type { ProjectEntity, ProjectId } from '../types';

const InnerPreview = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const [isLoading, setLoading] = useState(false);
  const previewImage = useQuery(api.projects.loadProjectPreview, { projectId });
  const calculatedHeight = Math.max(
    180,
    Math.round(256 * previewImage?.aspectRatio || 0),
  );
  const hasInitialized = useRef(false);
  const toggleLoader = useMemo(
    () =>
      debounce<(loading: boolean) => void>(
        (loading = false) => setLoading(loading),
        50,
      ),
    [],
  );

  if (!hasInitialized.current) {
    hasInitialized.current = true;
    toggleLoader(true);
  }

  return (
    <Box
      height={`${calculatedHeight}px`}
      overflow="hidden"
      position="relative"
      width="256px"
    >
      <Image
        alt={previewImage?.alt}
        height={`${calculatedHeight}px`}
        onLoad={() => {
          toggleLoader.cancel();
          setLoading(false);
        }}
        options={{ width: 256 }}
        src={previewImage?.publicUrl}
        useHighRes
        useAnimation
        width="256px"
      />
      {isLoading && (
        <Box bg="zinc.100/25" borderRadius={12} inset={0} position="absolute">
          <Loader
            color="zinc.300/50"
            left="50%"
            position="absolute"
            size="md"
            top="50%"
            transform="translate(-50%, -50%)"
          />
        </Box>
      )}
    </Box>
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

    return (
      <animated.div style={styles}>
        <Stack direction="column" gap={1}>
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
      </animated.div>
    );
  },
  (prev, next) =>
    prev.item._id === next.item._id && prev.isSelected === next.isSelected,
);
