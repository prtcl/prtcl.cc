import { Box, Stack } from 'styled-system/jsx';
import Link from '~/components/Link';
import Text from '~/components/Text';

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

export default Bio;
