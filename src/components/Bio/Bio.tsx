import { Box } from 'theme-ui';
import bio from '~/data/bio';
import Stack from '~/components/Stack';
import ListItem from '~/components/ListItem';

const Bio = () => {
  return (
    <Stack spacing={3} sx={{ maxWidth: ['100%', '18em'], px: 3, py: 4 }}>
      <Box>
        <p>{bio.tagline}</p>
      </Box>
      <Stack spacing={1}>
        {bio.links.map((link) => (
          <ListItem key={link.url} link={link} />
        ))}
      </Stack>
    </Stack>
  );
};

export default Bio;
