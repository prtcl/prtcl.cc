import { useQuery } from 'convex/react';
import { Flex, Stack, VisuallyHidden } from 'styled-system/jsx';
import { api } from '~/convex/api';
import * as Dialog from '~/ui/Dialog';
import { PanelContainer } from './components/PanelContainer';
import { PreviewHeader } from './components/PreviewHeader';
import { useProjectViewer, type ProjectId } from './hooks/useProjectViewer';

const InnerContent = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const project = useQuery(api.projects.loadProject, { projectId });

  console.log({ projectId, project });

  return (
    <Flex width="100%" height="100%">
      <VisuallyHidden>
        <Dialog.Title>{project?.title}</Dialog.Title>
      </VisuallyHidden>
      <PanelContainer>
        <Stack direction="column" gap={4}>
          <PreviewHeader projectId={projectId} />
        </Stack>
      </PanelContainer>
    </Flex>
  );
};

export const ProjectViewer = () => {
  const { isOpen, closeViewer, projectId } = useProjectViewer();

  return (
    <Dialog.Root isOpen={isOpen} onClose={closeViewer}>
      <Dialog.Overlay />
      <Dialog.Content
        borderRadius={0}
        height="100%"
        maxHeight={['96svh', '95vh', '95vh', '92vh', '84vh']}
        maxWidth={['93vw', '95vw', '95vw', '92vw', '68vw']}
        overflow="initial"
        shadow="none"
        width="100%"
      >
        <InnerContent projectId={projectId} />
      </Dialog.Content>
    </Dialog.Root>
  );
};
