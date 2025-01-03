import { useQuery } from 'convex/react';
import { forwardRef, useRef } from 'react';
import { Flex, VisuallyHidden } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { ErrorBoundary } from '~/lib/errors';
import * as Dialog from '~/ui/Dialog';
import { Text } from '~/ui/Text';
import { EmbedViewer } from './components/EmbedViewer';
import { useProjectViewer, ViewerType } from './hooks/useProjectViewer';
import type { ProjectId } from './types';

const NotFound = () => (
  <Flex alignItems="center" justifyContent="center" flex={1} width="100%">
    <Text>Not Found</Text>
  </Flex>
);

const ProjectTitle = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const project = useQuery(api.projects.loadProject, { projectId });
  return (
    <VisuallyHidden>
      <Dialog.Title>{project?.title}</Dialog.Title>
    </VisuallyHidden>
  );
};

const Overlay = forwardRef<HTMLDivElement>(function Overlay(_, ref) {
  const { closeViewer } = useProjectViewer();
  const touchStartY = useRef(0);

  return (
    <Dialog.Overlay
      ref={ref}
      onClick={() => closeViewer()}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
        if (deltaY > 75) {
          e.preventDefault();
          closeViewer();
        }
      }}
    />
  );
});

export const ProjectViewer = () => {
  const { isOpen, closeViewer, projectId, viewerType } = useProjectViewer();

  return (
    <Dialog.Root isOpen={isOpen} onClose={closeViewer} preset="scale">
      <Dialog.Portal>
        <Overlay />
        <Dialog.Content
          borderRadius={12}
          height="fit-content"
          maxWidth={['97%', '95%']}
          onOpenAutoFocus={(e) => e.preventDefault()}
          overflow="hidden"
          shadow="2xl"
          width="100%"
        >
          <ErrorBoundary fallback={() => <NotFound />}>
            {[ViewerType.SOUND, ViewerType.VIDEO].includes(viewerType) && (
              <EmbedViewer projectId={projectId} />
            )}
            <ProjectTitle projectId={projectId} />
          </ErrorBoundary>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
