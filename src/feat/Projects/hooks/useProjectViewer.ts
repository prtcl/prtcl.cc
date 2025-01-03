import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import type { ProjectEntity, ProjectId } from '../types';

export enum ViewerType {
  SOUND = 'sound',
  VIDEO = 'video',
  TEXT = 'text',
}

export type ProjectViewerState = {
  isOpen: boolean;
  projectId: ProjectId | null;
  viewerType: ViewerType | null;
};

export type ProjectViewerContextValue = ProjectViewerState & {
  openProjectViewer: (project: ProjectEntity) => void;
  closeViewer: () => void;
};

export const ProjectViewerContext = createContext<ProjectViewerContextValue>(
  {} as ProjectViewerContextValue,
);

export enum Actions {
  OPEN_PROJECT_VIEWER = 'OPEN_PROJECT_VIEWER',
  CLOSE_VIEWER = 'CLOSE_VIEWER',
}

type ProjectViewerActions =
  | {
      type: Actions.OPEN_PROJECT_VIEWER;
      payload: { projectId: ProjectId; viewerType: ViewerType };
    }
  | { type: Actions.CLOSE_VIEWER };

const reducer = (
  state: ProjectViewerState,
  action: ProjectViewerActions,
): ProjectViewerState => {
  switch (action.type) {
    case Actions.OPEN_PROJECT_VIEWER: {
      const { projectId, viewerType } = action.payload;
      return { ...state, isOpen: true, projectId, viewerType };
    }
    case Actions.CLOSE_VIEWER: {
      return { ...state, isOpen: false };
    }
    default: {
      return state;
    }
  }
};

const getViewerType = (project: ProjectEntity): ViewerType => {
  if (project.embedId) {
    if (project.category === 'sound') {
      return ViewerType.SOUND;
    }
    if (project.category === 'video') {
      return ViewerType.VIDEO;
    }
  }
  return ViewerType.TEXT;
};

export const useProjectViewerState = (): ProjectViewerContextValue => {
  const [state, dispatch] = useReducer(reducer, {}, () => ({
    isOpen: false,
    projectId: null,
    viewerType: null,
  }));
  const openProjectViewer = useCallback(
    (projectId: ProjectEntity) => {
      dispatch({
        type: Actions.OPEN_PROJECT_VIEWER,
        payload: {
          projectId: projectId._id,
          viewerType: getViewerType(projectId),
        },
      });
    },
    [dispatch],
  );
  const closeViewer = useCallback(() => {
    dispatch({ type: Actions.CLOSE_VIEWER });
  }, [dispatch]);

  return useMemo(
    () => ({
      ...state,
      closeViewer,
      openProjectViewer,
    }),
    [state, openProjectViewer, closeViewer],
  );
};

export const useProjectViewer = () => useContext(ProjectViewerContext);
