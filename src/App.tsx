import { Box, Center, Stack, styled } from 'styled-system/jsx';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';
import { Visualization } from './feat/Visualization';

const Root = styled('main', {
  base: {
    height: '100%',
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
});

const VizContainer = styled(Box, {
  base: {
    height: '100vh',
    inset: 0,
    minHeight: '100lvh',
    pointerEvents: 'none',
    position: 'fixed',
    width: '100vw',
    zIndex: 0,
  },
});

const Bio = () => {
  return (
    <Box maxWidth={['26rem', '32rem']} width="100%">
      <Stack direction="column" gap={[4, 3]} px={3} py={8}>
        <Stack gap={3}>
          <Text color="white">
            Cory O&apos;Brien is a software engineer and sound artist who lives in London.
          </Text>
          <Text color="white">
            He currently works at Reuters News as lead engineer, and spends most days field
            recording or patching in Symbolic Sound Kyma.
          </Text>
          <Text color="white">
            Research areas: systems/cybernetics, ocean wildlife, audio synthesis and physical
            modeling.
          </Text>
        </Stack>
        <Stack gap={[4, 3]} direction="row" alignItems="center">
          <Link href="https://coryobrien.bandcamp.com" color="white">
            Bandcamp
          </Link>
          <Link href="https://github.com/prtcl" color="white">
            Github
          </Link>
          <Link href="mailto:cory@prtcl.cc" color="white">
            cory@prtcl.cc
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export const App = () => {
  return (
    <Root>
      <VizContainer>
        <Visualization />
      </VizContainer>
      <Center
        alignItems="center"
        minHeight={['100%', '100vh']}
        mixBlendMode="difference"
        position="relative"
        width="100%"
      >
        <Bio />
      </Center>
    </Root>
  );
};
