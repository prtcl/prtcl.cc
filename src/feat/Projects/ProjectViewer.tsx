import { useQuery } from 'convex/react';
import { useState } from 'react';
import useKey from 'react-use/lib/useKey';
import { Flex, Stack, VisuallyHidden } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { ErrorBoundary } from '~/lib/errors';
import * as Dialog from '~/ui/Dialog';
import { IconButton } from '~/ui/IconButton';
import { Text } from '~/ui/Text';
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

const DetailsPanel = () => {
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

  return (
    <>
      <Flex direction="column" flex={1}>
        <ProjectDetails direction={direction} projectId={projectId} />
        <PanelFooter>
          <ProjectUrl url={project?.url} direction={direction} />
          <Stack direction="row" gap={[0, 1]}>
            <IconButton onPress={() => handleLeft()} isDisabled={prev === null}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onPress={() => handleRight()}
              isDisabled={next === null}
            >
              <ChevronLeftIcon transform="rotate(180deg)" />
            </IconButton>
          </Stack>
        </PanelFooter>
      </Flex>
      <VisuallyHidden>
        <Dialog.Title>{project?.title}</Dialog.Title>
      </VisuallyHidden>
    </>
  );
};

const NotFound = () => (
  <Flex alignItems="center" justifyContent="center" flex={1} width="100%">
    <Text>Not Found</Text>
  </Flex>
);

export const ProjectViewer = () => {
  const { isOpen, closeViewer } = useProjectViewer();

  return (
    <Dialog.Root isOpen={isOpen} onClose={closeViewer}>
      <Dialog.Overlay />
      <Dialog.Content
        borderRadius={[16, 16, 16, 12]}
        height="100%"
        mt="calc(env(safe-area-inset-bottom, 0px) / 2 * -1)"
        maxHeight={[
          'calc(97% - (env(safe-area-inset-bottom, 0px) * 2))',
          'calc(97% - (env(safe-area-inset-bottom, 0px) * 2))',
          'calc(96% - (env(safe-area-inset-bottom, 0px) * 2))',
          '92vh',
          '84vh',
        ]}
        maxWidth={['97%', '95%', '95vw', '92vw', '82vw', '74vw', '80rem']}
        onOpenAutoFocus={(e) => e.preventDefault()}
        overflow="hidden"
        shadow="2xl"
        width="100%"
      >
        <PanelContainer>
          <PanelHeader>
            <IconButton ml={-1} mt={-1} onPress={() => closeViewer()} size="md">
              <BackIcon
                color={['zinc.500', 'zinc.500', 'zinc.400', 'zinc.300']}
                size="md"
              />
            </IconButton>
          </PanelHeader>
          <ErrorBoundary fallback={() => <NotFound />}>
            <DetailsPanel />
          </ErrorBoundary>
        </PanelContainer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
