import { useQuery } from 'convex/react';
import { type PropsWithChildren } from 'react';
import { Flex } from 'styled-system/jsx';
import { api } from '~/convex/api';
import type { Id } from '~/convex/dataModel';
import useBreakpoints from '~/hooks/useBreakpoints';
import * as HoverCard from '~/ui/HoverCard';
import Image from '~/ui/Image';

const Content = (props: { projectId: Id<'projects'> }) => {
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

export const Preview = (
  props: PropsWithChildren<{ projectId: Id<'projects'> }>,
) => {
  const { children, projectId } = props;
  const { isMobile } = useBreakpoints();

  if (isMobile) {
    return children;
  }

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{children}</HoverCard.Trigger>
      <HoverCard.Content>
        <Content projectId={projectId} />
      </HoverCard.Content>
    </HoverCard.Root>
  );
};
