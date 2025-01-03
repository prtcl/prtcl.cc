import { useQuery } from 'convex/react';
import { useMemo, useRef, useState } from 'react';
import { type PropsWithChildren } from 'react';
import { Box } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { debounce } from '~/lib/debounce';
import { useInteractions } from '~/lib/viewport';
import * as HoverCard from '~/ui/HoverCard';
import { Image } from '~/ui/Image';
import { Loader } from '~/ui/Loader';
import type { ProjectId } from '../types';

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
