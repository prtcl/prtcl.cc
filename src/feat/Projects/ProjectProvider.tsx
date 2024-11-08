import { type PropsWithChildren } from 'react';
import { ProjectViewer } from './ProjectViewer';
import { NextPrevContext, useNextPrevApi } from './hooks/useNextPrev';
import {
  ProjectViewerContext,
  useProjectViewerState,
} from './hooks/useProjectViewer';

const ProjectViewerProvider = (props: PropsWithChildren) => (
  <ProjectViewerContext.Provider value={useProjectViewerState()}>
    {props.children}
  </ProjectViewerContext.Provider>
);

const NextPrevProvider = (props: PropsWithChildren) => (
  <NextPrevContext.Provider value={useNextPrevApi()}>
    {props.children}
  </NextPrevContext.Provider>
);

export const ProjectProvider = (props: PropsWithChildren) => (
  <ProjectViewerProvider>
    <NextPrevProvider>
      {props.children}
      <ProjectViewer />
    </NextPrevProvider>
  </ProjectViewerProvider>
);
