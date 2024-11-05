import type { PropsWithChildren } from 'react';
import { ProjectViewer } from './ProjectViewer';
import {
  ProjectViewerContext,
  useProjectViewerState,
} from './hooks/useProjectViewer';

export const ProjectProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const context = useProjectViewerState();

  return (
    <ProjectViewerContext.Provider value={context}>
      {children}
      <ProjectViewer />
    </ProjectViewerContext.Provider>
  );
};
