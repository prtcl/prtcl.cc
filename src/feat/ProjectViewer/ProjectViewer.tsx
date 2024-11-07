import { useQuery } from 'convex/react';
import { useState } from 'react';
import useKey from 'react-use/lib/useKey';
import { Flex, Stack, VisuallyHidden } from 'styled-system/jsx';
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
import { ProjectDetails } from './components/ProjectDetails';
import { ProjectUrl } from './components/ProjectUrl';
import { useNextPrev, type Directions } from './hooks/useNextPrev';
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
  const { projectId, updateProjectId } = useProjectViewer();
  const project = useQuery(api.projects.loadProject, { projectId });
  const { next, prev } = useNextPrev(projectId);
  const [direction, setDirection] = useState<Directions>(0);

  const handleLeft = () => {
    if (prev) {
      updateProjectId(prev);
      setDirection(-1);
    }
  };
  const handleRight = () => {
    if (next) {
      updateProjectId(next);
      setDirection(1);
    }
  };
  useKey('ArrowLeft', handleLeft, {}, [prev]);
  useKey('ArrowRight', handleRight, {}, [next]);

  console.log({ projectId, project, next, prev, direction });

  return (
    <Flex width="100%" height="100%">
      <PanelContainer>
        <PanelHeader>
          <Close />
        </PanelHeader>
        <Flex direction="column" flex={1} mt={[-2, -2]}>
          <ProjectDetails direction={direction} projectId={projectId} />
          <PanelFooter>
            <ProjectUrl url={project?.url} direction={direction} />
            <Stack direction="row" gap={[0, 1]}>
              <IconButton onPress={handleLeft} isDisabled={prev === null}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onPress={handleRight} isDisabled={next === null}>
                <ChevronLeftIcon transform="rotate(180deg)" />
              </IconButton>
            </Stack>
          </PanelFooter>
        </Flex>
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
