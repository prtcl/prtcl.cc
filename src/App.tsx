import { Box, Stack } from 'styled-system/jsx';
import Link from '~/components/Link';
import Text from '~/components/Text';
import { contact, links } from '~/data/content';
import { Container, Overlay, Root } from '~/lib/layout';
import { Visualization } from '~/lib/visualization';

const Bio = () => {
  return (
    <Stack gap={3} px={[3, 4]} maxW={['100%', '18rem']}>
      <Box>
        <Text color="primary">
          Cory O&apos;Brien is a software engineer and sound artist who lives in
          NYC
        </Text>
      </Box>
      <Stack gap={1}>
        {contact.map((link) => (
          <Link key={link.url} href={link.url} color="primary">
            {link.title}
          </Link>
        ))}
      </Stack>
    </Stack>
  );
};

const Projects = () => {
  return (
    <Stack gap={2} px={[3, 4]}>
      {links.map((link) => (
        <Link key={link.url} href={link.url} color="text" fontWeight={500}>
          {link.title}
        </Link>
      ))}
    </Stack>
  );
};

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
