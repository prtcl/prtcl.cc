import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Flex, type FlexProps } from 'styled-system/jsx';
import { ErrorBoundary } from '~/lib/errors';
import { useOrientation } from '~/lib/viewport';
import { Text } from '~/ui/Text';
import { useProjectViewer, ViewerType } from './hooks/useProjectViewer';
import { EmbedViewer } from './ui/EmbedViewer';

const Overlay = forwardRef<HTMLDivElement, FlexProps>(
  function Overlay(props, ref) {
    const { children, ...flexProps } = props;
    const { closeViewer, isOpen } = useProjectViewer();
    if (!isOpen) {
      return null;
    }

    return (
      <Flex
        ref={ref}
        position="fixed"
        inset={0}
        onClick={() => closeViewer()}
        onTouchMove={() => closeViewer()}
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
  const { closeViewer, viewerType, ...viewerProps } = useProjectViewer();
  const { orientation } = useOrientation();
  useEffect(() => closeViewer(), [orientation, closeViewer]);

  return (
    <ErrorBoundary fallback={() => <NotFound />}>
      {createPortal(
        <>
          <Overlay />
          {[ViewerType.SOUND, ViewerType.VIDEO].includes(viewerType) && (
            <EmbedViewer {...viewerProps} />
          )}
        </>,
        document.body,
      )}
    </ErrorBoundary>
  );
};
