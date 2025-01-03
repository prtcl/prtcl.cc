import { type PropsWithChildren } from 'react';
import { ProjectViewer } from './ProjectViewer';
import {
  ProjectViewerContext,
  useProjectViewerState,
} from './hooks/useProjectViewer';

export const ProjectProvider = (props: PropsWithChildren) => (
  <ProjectViewerContext.Provider value={useProjectViewerState()}>
    {props.children}
    <ProjectViewer />
  </ProjectViewerContext.Provider>
);
