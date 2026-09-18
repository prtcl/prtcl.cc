import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import ReactMarkdown from 'react-markdown';
import { Box, Center, Stack } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';

const Bio = () => {
  const summary = useQuery(api.summaries.getActiveSummary);
  if (!summary) return null;

  return (
    <Center width="100%" height="100%">
      <Box maxWidth={['26rem', '32rem']} width="100%">
        <Stack direction="column" gap={[4, 3]} px={3} py={6}>
          <Stack gap={3}>
            <Text>
              Cory O&apos;Brien is a software engineer and sound artist who lives in London.
            </Text>
            <Text>
              He currently works at Reuters News as lead engineer, and spends most days field
              recording or patching in Symbolic Sound Kyma.
            </Text>
            <ReactMarkdown
              components={{
                a: ({ href, children }) => <Link href={href ?? '#'}>{children}</Link>,
                p: ({ children }) => <Text>{children}</Text>,
              }}
            >
              {summary.content}
            </ReactMarkdown>
          </Stack>
          <Stack gap={[4, 3]} direction="row" alignItems="center">
            <Link href="https://coryobrien.bandcamp.com">Bandcamp</Link>
            <Link href="https://github.com/prtcl">Github</Link>
            <Link href="mailto:cory@prtcl.cc">cory@prtcl.cc</Link>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export const Route = createFileRoute('/_v/')({
  component: Bio,
});
