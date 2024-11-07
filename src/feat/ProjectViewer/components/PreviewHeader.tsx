import { useQuery } from 'convex/react';
import { type PropsWithChildren } from 'react';
import { Flex } from 'styled-system/jsx';
import { api } from '~/convex/api';
import Image from '~/ui/Image';
import { type ProjectId } from '../hooks/useProjectViewer';

const Container = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <Flex
      alignItems="start"
      justifyContent="start"
      maxHeight={['9rem', '12rem']}
      objectFit="cover"
      overflow="hidden"
      position="relative"
      width="100%"
      _selection={{ bg: 'transparent' }}
    >
      {children}
    </Flex>
  );
};

const Overlay = () => {
  return (
    <Flex
      bgGradient="to-b"
      bottom={0}
      gradientFrom="transparent"
      gradientTo="white"
      height="100%"
      left={0}
      position="absolute"
      width="100%"
      _selection={{ bg: 'transparent' }}
    />
  );
};

export const PreviewHeader = (props: { projectId: ProjectId }) => {
  const { projectId } = props;
  const preview = useQuery(api.previews.loadProjectPreview, { projectId });

  return (
    <Container>
      <Image
        maxWidth="100vw"
        options={{ width: 840, quality: 75 }}
        src={preview?.publicUrl}
        width="100%"
        _selection={{ bg: 'transparent' }}
      />
      <Overlay />
    </Container>
  );
};
