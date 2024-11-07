import { useQuery } from 'convex/react';
import { Flex, Spacer, Stack, VisuallyHidden } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { useBreakpoints } from '~/lib/viewport';
import * as Dialog from '~/ui/Dialog';
import IconButton from '~/ui/IconButton';
import { BackIcon, ChevronLeftIcon } from '~/ui/icons';
import {
  PanelContainer,
  PanelFooter,
  PanelHeader,
} from './components/PanelContainer';
import { PreviewHeader } from './components/PreviewHeader';
import { ProjectUrl } from './components/ProjectUrl';
import { useProjectViewer } from './hooks/useProjectViewer';

const Close = () => {
  const { breakpoint } = useBreakpoints();
  const { closeViewer } = useProjectViewer();

  return (
    <IconButton
      ml={[-1, -1.5]}
      mt={[-0.5, -1]}
      onPress={closeViewer}
      size={breakpoint === 1 ? 'sm' : 'md'}
    >
      <BackIcon
        color={['zinc.600', 'zinc.600', 'zinc.600', 'zinc.700']}
        size={breakpoint === 1 ? 'sm' : 'md'}
      />
    </IconButton>
  );
};

const InnerContent = () => {
  const { projectId } = useProjectViewer();
  const project = useQuery(api.projects.loadProject, { projectId });

  console.log({ projectId, project });

  return (
    <Flex width="100%" height="100%">
      <PanelContainer>
        <PanelHeader>
          <Close />
        </PanelHeader>
        <Stack direction="column" gap={4} flex={1} mt={[-2, -2]}>
          <PreviewHeader projectId={projectId} />
          <Flex flex={1}></Flex>
          <PanelFooter>
            {project ? <ProjectUrl url={project.url} /> : <Spacer />}
            <Stack direction="row" gap={[0, 1]}>
              <IconButton onPress={() => console.log('left')}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onPress={() => console.log('right')}>
                <ChevronLeftIcon transform="rotate(180deg)" />
              </IconButton>
            </Stack>
          </PanelFooter>
        </Stack>
      </PanelContainer>
      <VisuallyHidden>
        <Dialog.Title>{project?.title}</Dialog.Title>
      </VisuallyHidden>
    </Flex>
  );
};

export const ProjectViewer = () => {
  const { isOpen, closeViewer } = useProjectViewer();

  return (
    <Dialog.Root isOpen={isOpen} onClose={closeViewer}>
      <Dialog.Overlay />
      <Dialog.Content
        borderRadius={0}
        height="100%"
        maxHeight={['96%', '95vh', '95vh', '92vh', '84vh']}
        maxWidth={['95%', '95vw', '95vw', '92vw', '68vw']}
        onOpenAutoFocus={(e) => e.preventDefault()}
        overflow="initial"
        shadow="none"
        width="100%"
      >
        <InnerContent />
      </Dialog.Content>
    </Dialog.Root>
  );
};
