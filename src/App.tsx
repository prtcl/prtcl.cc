import { Stack } from 'styled-system/jsx';
import Bio from '~/components/Bio';
import Projects from '~/components/Projects';
import { Container, Overlay, Root } from '~/lib/layout';
import { Visualization } from '~/lib/visualization';

const App = () => (
  <Root>
    <Container>
      <Visualization />
    </Container>
    <Overlay>
      <Stack direction="column" gap={4} py={8}>
        <Bio />
        <Projects />
      </Stack>
    </Overlay>
  </Root>
);

export default App;
