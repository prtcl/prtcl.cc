import { useQuery } from 'convex/react';
import { Box, Stack } from 'styled-system/jsx';
import Link from '~/components/Link';
import Text from '~/components/Text';
import { api } from '~/convex/api';
import { Container, Overlay, Root } from '~/lib/layout';
import { Visualization } from '~/lib/visualization';

export type LinkConfig = {
  title: string;
  url: string;
};

export const contact: LinkConfig[] = [
  {
    title: 'Bandcamp',
    url: 'https://coryobrien.bandcamp.com',
  },
  {
    title: 'Github',
    url: 'https://github.com/prtcl',
  },
  {
    title: 'cory@prtcl.cc',
    url: 'mailto:cory@prtcl.cc',
  },
];

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

const App = () => {
  const projects = useQuery(api.projects.loadProjects);

  return (
    <Root>
      <Container>
        <Visualization />
      </Container>
      {projects && (
        <Overlay animation="fade-in 340ms linear">
          <Stack direction="column" gap={4} py={8}>
            <Bio />
            <Stack gap={2} px={[3, 4]}>
              {projects.map((project) => {
                const { _id, url, label } = project;

                return (
                  <Link key={_id} href={url} color="text" fontWeight={500}>
                    {label}
                  </Link>
                );
              })}
            </Stack>
          </Stack>
        </Overlay>
      )}
    </Root>
  );
};

export default App;
