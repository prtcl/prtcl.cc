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
    <Box maxWidth="26rem" width="100%">
      <Stack gap={3} px={3} py={8}>
        <Box>
          <Text color="white">
            Cory O&apos;Brien is a software engineer and sound artist who lives
            in London
          </Text>
        </Box>
        <Link href="mailto:cory@prtcl.cc" color="white">
          cory@prtcl.cc
        </Link>
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
