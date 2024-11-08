import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import type { Doc, Id } from '~/convex/dataModel';

export type ProjectId = Id<'projects'>;
export type ProjectEntity = Doc<'projects'>;

export type ProjectViewerState = {
  isOpen: boolean;
  projectId: ProjectId;
};

export type ProjectViewerContextValue = ProjectViewerState & {
  closeViewer: () => void;
  openProjectViewer: (projectId: ProjectId) => void;
  updateProjectId: (projectId: ProjectId) => void;
};

export const ProjectViewerContext = createContext<ProjectViewerContextValue>(
  {} as ProjectViewerContextValue,
);

export enum Actions {
  SHOW_PROJECT_DETAILS = 'SHOW_PROJECT_DETAILS',
  CLOSE = 'CLOSE',
  UPDATE_PROJECT_ID = 'UPDATE_PROJECT_ID',
}

type ProjectViewerActions =
  | { type: Actions.CLOSE }
  | {
      type: Actions.SHOW_PROJECT_DETAILS;
      payload: { projectId: ProjectId };
    }
  | {
      type: Actions.UPDATE_PROJECT_ID;
      payload: { projectId: ProjectId };
    };

const reducer = (
  state: ProjectViewerState,
  action: ProjectViewerActions,
): ProjectViewerState => {
  switch (action.type) {
    case Actions.SHOW_PROJECT_DETAILS: {
      return {
        ...state,
        isOpen: true,
        projectId: action.payload.projectId,
      };
    }
    case Actions.UPDATE_PROJECT_ID: {
      return {
        ...state,
        projectId: action.payload.projectId,
      };
    }
    case Actions.CLOSE: {
      return {
        ...state,
        isOpen: false,
      };
    }
    default: {
      return state;
    }
  }
};

export const useProjectViewerState = (): ProjectViewerContextValue => {
  const [state, dispatch] = useReducer(reducer, {}, () => ({
    isOpen: false,
    projectId: null,
  }));

  const openProjectViewer = useCallback(
    (projectId: ProjectId) => {
      dispatch({
        type: Actions.SHOW_PROJECT_DETAILS,
        payload: { projectId },
      });
    },
    [dispatch],
  );

  const updateProjectId = useCallback(
    (projectId: ProjectId) => {
      dispatch({
        type: Actions.UPDATE_PROJECT_ID,
        payload: { projectId },
      });
    },
    [dispatch],
  );

  const closeViewer = useCallback(() => {
    dispatch({ type: Actions.CLOSE });
  }, [dispatch]);

  return useMemo(
    () => ({
      ...state,
      closeViewer,
      openProjectViewer,
      updateProjectId,
    }),
    [state, openProjectViewer, updateProjectId, closeViewer],
  );
};

export const useProjectViewer = () => useContext(ProjectViewerContext);
