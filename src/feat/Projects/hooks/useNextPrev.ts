import { useQuery } from 'convex/react';
import { createContext, useContext, useMemo } from 'react';
import { api } from '~/convex/api';
import { type ProjectId } from './useProjectViewer';

export type NextPrev = {
  next: ProjectId | null;
  prev: ProjectId | null;
};

export type NextPrevContextValue = {
  nextPrev: Map<ProjectId, NextPrev>;
  projectIds: ProjectId[];
};

export type Directions = -1 | 1 | 0;

export const NextPrevContext = createContext<NextPrevContextValue>(
  {} as NextPrevContextValue,
);

export const useNextPrevApi = (): NextPrevContextValue => {
  const projectIds = useQuery(api.projects.loadProjectIds);
  const { nextPrev } = useMemo(() => {
    return (projectIds || []).reduce<{
      nextPrev: Map<ProjectId, NextPrev>;
      prev: ProjectId | null;
    }>(
      (res, projectId, index) => {
        res.nextPrev.set(projectId, {
          next: projectIds[index + 1] || null,
          prev: res.prev || null,
        });
        res.prev = projectId;

        return res;
      },
      {
        nextPrev: new Map(),
        prev: null,
      },
    );
  }, [projectIds]);

  return useMemo(
    () => ({
      nextPrev,
      projectIds,
    }),
    [nextPrev, projectIds],
  );
};

export const useNextPrev = (projectId: ProjectId): NextPrev => {
  const { nextPrev } = useContext(NextPrevContext);
  return {
    ...nextPrev.get(projectId),
  };
};
