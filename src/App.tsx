import { usePaginatedQuery } from 'convex/react';
import { type PropsWithChildren } from 'react';
import { Box, Stack } from 'styled-system/jsx';
import { api } from '~/convex/api';
import { ProjectItem, useProjectViewer } from '~/feat/Projects';
import { Visualization } from '~/feat/Visualization';
import { VizContainer, ContentOverlay, Root } from '~/lib/layout';
import { useBreakpoints, useInteractions } from '~/lib/viewport';
import { Button } from '~/ui/Button';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';

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
    justifyContent="flex-start"
    my={1}
    onClick={props.onClick}
    textAlign="left"
    visual="ghost"
    width={['100%', 'fit-content']}
  >
    {props.children}
  </Button>
);

const ContentContainer = (
  props: PropsWithChildren & { state: 'foreground' | 'background' },
) => {
  const { children, state } = props;
  return (
    <Box
      transition={`
        opacity 168ms cubic-bezier(.79,.31,.59,.83),
        scale 336ms cubic-bezier(.79,.31,.59,.83)
      `}
      width="100%"
      height="100%"
      {...(state === 'background'
        ? { opacity: 0.5, scale: 0.99 }
        : { opacity: 1, scale: 1 })}
    >
      {children}
    </Box>
  );
};

const LOAD_ITEMS_COUNT = 7;

const App = () => {
  const { isMobile } = useBreakpoints();
  const { hasTouch } = useInteractions();
  const { isOpen, openProjectViewer, projectId } = useProjectViewer();
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
      <VizContainer>
        <Visualization />
      </VizContainer>
      {projects && !isLoading && (
        <ContentOverlay animation="fade-in 340ms linear">
          <ContentContainer state={isOpen ? 'background' : 'foreground'}>
            <Stack direction="column" gap={4} px={[3, 4]} pt={8} pb={12}>
              <Bio />
              <Stack gap={2}>
                {projects.map((project) => {
                  return (
                    <ProjectItem
                      key={project._id}
                      isSelected={isOpen && projectId === project._id}
                      item={project}
                      onSelect={(_, target) => {
                        if ((isMobile || hasTouch) && !!project.embedId) {
                          openProjectViewer(
                            project,
                            target.getBoundingClientRect(),
                          );
                        } else {
                          window.open(project.url, '_blank');
                        }
                      }}
                    />
                  );
                })}
                {canLoadMore && (
                  <LoadMore onClick={() => loadMore(LOAD_ITEMS_COUNT)}>
                    More...
                  </LoadMore>
                )}
              </Stack>
            </Stack>
          </ContentContainer>
        </ContentOverlay>
      )}
    </Root>
  );
};

export default App;
