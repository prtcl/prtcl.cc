import { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Flex, type FlexProps } from 'styled-system/jsx';
import { ErrorBoundary } from '~/lib/errors';
import { Text } from '~/ui/Text';
import { EmbedViewer } from './components/EmbedViewer';
import { useProjectViewer, ViewerType } from './hooks/useProjectViewer';

const Overlay = forwardRef<HTMLDivElement, FlexProps>(
  function Overlay(props, ref) {
    const { children, ...flexProps } = props;
    const { closeViewer, isOpen } = useProjectViewer();
    const touchStartY = useRef(0);
    if (!isOpen) {
      return null;
    }

    return (
      <Flex
        ref={ref}
        position="fixed"
        inset={0}
        bg="purple/25"
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
        {...flexProps}
      >
        {children}
      </Flex>
    );
  },
);

const NotFound = () =>
  createPortal(
    <Overlay alignItems="center" bg="zinc.100/68" justifyContent="center">
      <Text>Not Found</Text>
    </Overlay>,
    document.body,
  );

export const ProjectViewer = () => {
  const { isOpen, projectId, viewerType } = useProjectViewer();
  return (
    <ErrorBoundary fallback={() => <NotFound />}>
      {createPortal(
        <>
          <Overlay />
          {[ViewerType.SOUND, ViewerType.VIDEO].includes(viewerType) && (
            <EmbedViewer projectId={projectId} isOpen={isOpen} />
          )}
        </>,
        document.body,
      )}
    </ErrorBoundary>
  );
};
