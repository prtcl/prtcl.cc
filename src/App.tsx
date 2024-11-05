import { usePaginatedQuery } from 'convex/react';
import { type PropsWithChildren } from 'react';
import { Box, Stack } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { Preview } from '~/feat/Preview';
import { useProjectViewer } from '~/feat/ProjectViewer';
import { Visualization } from '~/feat/Visualization';
import { FeatureFlags, useFeatureFlags } from '~/lib/features';
import { Container, Overlay, Root } from '~/lib/layout';
import Badge from '~/ui/Badge';
import Button from '~/ui/Button';
import Link from '~/ui/Link';
import Text from '~/ui/Text';

const Bio = () => {
  return (
    <Stack gap={3} maxW={['100%', '18rem']}>
      <Box>
        <Text color="primary">
          Cory O&apos;Brien is a software engineer and sound artist who lives in
          NYC
        </Text>
      </Box>
      <Link href="mailto:cory@prtcl.cc" color="primary">
        cory@prtcl.cc
      </Link>
    </Stack>
  );
};

const LoadMore = (props: PropsWithChildren & { onClick: () => void }) => (
  <Button
    color="zinc.700"
    my={1}
    onClick={props.onClick}
    visual="ghost"
    width={['100%', 'fit-content']}
    textAlign="left"
    justifyContent="flex-start"
  >
    {props.children}
  </Button>
);

export const formatTimestamp = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US');

const LOAD_ITEMS_COUNT = 7;

const App = () => {
  const { features } = useFeatureFlags();
  const { openProjectViewer } = useProjectViewer();
  const {
    results: projects,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.projects.loadProjects,
    {},
    { initialNumItems: LOAD_ITEMS_COUNT },
  );
  const canLoadMore = status !== 'Exhausted';
  const isLoading = status === 'LoadingFirstPage';

  return (
    <Root>
      <Container>
        <Visualization />
      </Container>
      {projects && !isLoading && (
        <Overlay animation="fade-in 340ms linear">
          <Stack direction="column" gap={4} px={[3, 4]} py={8}>
            <Bio />
            <Stack gap={2}>
              {projects.map((project) => {
                const { _id, title, url, category, publishedAt } = project;

                return (
                  <Stack key={_id} direction="column" gap={1}>
                    {features.get(FeatureFlags.PROJECT_PREVIEWS) ? (
                      <Preview projectId={_id}>
                        <Link
                          href={url}
                          color="text"
                          fontWeight={500}
                          onClick={(e) => {
                            e.preventDefault();
                            openProjectViewer(_id);
                          }}
                        >
                          {title}
                        </Link>
                      </Preview>
                    ) : (
                      <Link href={url} color="text" fontWeight={500}>
                        {title}
                      </Link>
                    )}
                    <Stack direction="row" gap={2}>
                      <Badge>{category}</Badge>
                      <Text fontSize="xs" color="zinc.700">
                        {formatTimestamp(publishedAt)}
                      </Text>
                    </Stack>
                  </Stack>
                );
              })}
              {canLoadMore && (
                <LoadMore onClick={() => loadMore(LOAD_ITEMS_COUNT)}>
                  More...
                </LoadMore>
              )}
            </Stack>
          </Stack>
        </Overlay>
      )}
    </Root>
  );
};

export default App;
