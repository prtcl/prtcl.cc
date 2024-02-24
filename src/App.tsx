import { Box, Text } from 'theme-ui';
import { ContentOverlay, Layout, VizContainer } from '~/components/Layout';
import ListItem from '~/components/ListItem';
import Stack from '~/components/Stack/Stack';
import Visualization from '~/components/Visualization';
import { tagline, contact, links } from '~/data/content';

const App = () => {
  return (
    <Layout>
      <VizContainer>
        <Visualization />
      </VizContainer>
      <ContentOverlay>
        <Stack
          spacing={3}
          sx={{ maxWidth: ['100%', '18em'], px: 3, pt: 4, pb: 3 }}
        >
          <Box>
            <Text sx={{ color: 'primary' }}>{tagline}</Text>
          </Box>
          <Stack spacing={[2, 1]}>
            {contact.map((link) => (
              <ListItem key={link.url} link={link} />
            ))}
          </Stack>
        </Stack>
        <Stack spacing={2} sx={{ px: 3, pt: 1 }}>
          {links.map((link) => (
            <ListItem
              key={link.url}
              link={link}
              sx={{ color: 'text', fontWeight: 500 }}
            />
          ))}
        </Stack>
      </ContentOverlay>
    </Layout>
  );
};

export default App;
