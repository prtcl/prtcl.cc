import { useQuery } from 'convex/react';
import { Stack } from 'styled-system/jsx';
import Link from '~/components/Link';
import { api } from '~/convex/api';

const Projects = () => {
  const projects = useQuery(api.projects.loadProjects);

  if (!projects) {
    return null;
  }

  return (
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
  );
};

export default Projects;
