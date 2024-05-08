import { useQuery } from 'convex/react';
import { Box, Stack } from 'styled-system/jsx';
import Badge from '~/components/Badge';
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
    <Stack gap={3} maxW={['100%', '18rem']}>
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

export const formatTimestamp = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US');

const App = () => {
  const projects = useQuery(api.projects.loadProjects);

  return (
    <Root>
      <Container>
        <Visualization />
      </Container>
      {projects && (
        <Overlay animation="fade-in 340ms linear">
          <Stack direction="column" gap={4} px={[3, 4]} py={8}>
            <Bio />
            <Stack gap={2}>
              {projects.map((project) => {
                const { _id, title, url, category, publishedAt } = project;

                return (
                  <Stack key={_id} direction="column" gap={1}>
                    <Link href={url} color="text" fontWeight={500}>
                      {title}
                    </Link>
                    <Stack direction="row" gap={2}>
                      <Badge>{category}</Badge>
                      <Text fontSize="xs" color="zinc.700">
                        {formatTimestamp(publishedAt)}
                      </Text>
                    </Stack>
                  </Stack>
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
