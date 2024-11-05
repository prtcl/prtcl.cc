import { useQuery } from 'convex/react';
import { Flex, Stack, VisuallyHidden } from 'styled-system/jsx';
import { api } from '~/convex/api';
import * as Dialog from '~/ui/Dialog';
import Image from '~/ui/Image';
import { useProjectViewer } from './hooks/useProjectViewer';

const PreviewHeader = () => {
  const { projectId } = useProjectViewer();
  const preview = useQuery(api.previews.loadProjectPreview, { projectId });

  return (
    <Flex
      alignItems="start"
      justifyContent="start"
      maxHeight="12rem"
      objectFit="cover"
      overflow="hidden"
      width="100%"
      position="relative"
    >
      <Image
        src={preview?.publicUrl}
        options={{ width: 840, quality: 75 }}
        width="75vw"
        maxWidth="100vw"
      />
    </Flex>
  );
};

const Content = () => {
  const { projectId } = useProjectViewer();
  const project = useQuery(api.projects.loadProject, { projectId });
  const preview = useQuery(api.previews.loadProjectPreview, { projectId });

  console.log({ projectId, project, preview });

  return (
    <Flex width="100%" height="100%">
      <VisuallyHidden>
        <Dialog.Title>{project?.title}</Dialog.Title>
      </VisuallyHidden>
      <Flex
        bg="white"
        shadow={['none', '2xl']}
        flex={1}
        borderRadius={8}
        overflow="hidden"
      >
        <Stack direction="column" gap={4} overflow="hidden">
          <PreviewHeader />
        </Stack>
      </Flex>
    </Flex>
  );
};

export const ProjectViewer = () => {
  const { isOpen, closeViewer } = useProjectViewer();

  return (
    <Dialog.Root isOpen={isOpen} onClose={closeViewer}>
      <Dialog.Overlay />
      <Dialog.Content
        borderRadius={[0, 12]}
        height={['100%', '75vh']}
        width="100%"
        maxWidth={['100%', '75vw']}
        shadow="none"
        overflow="initial"
      >
        <Content />
      </Dialog.Content>
    </Dialog.Root>
  );
};
