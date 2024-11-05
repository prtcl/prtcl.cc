import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import type { Id } from '~/convex/dataModel';

export type ProjectId = Id<'projects'>;

export type ProjectViewerState = {
  isOpen: boolean;
  projectId: ProjectId;
};

export type ProjectViewerContextValue = ProjectViewerState & {
  closeViewer: () => void;
  openProjectViewer: (projectId: ProjectId) => void;
};

export const ProjectViewerContext = createContext<ProjectViewerContextValue>(
  {} as ProjectViewerContextValue,
);

export enum Actions {
  SHOW_PROJECT_DETAILS = 'SHOW_PROJECT_DETAILS',
  CLOSE = 'CLOSE',
}

type ProjectViewerActions =
  | { type: Actions.CLOSE }
  | {
      type: Actions.SHOW_PROJECT_DETAILS;
      payload: { projectId: Id<'projects'> };
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

  const closeViewer = useCallback(() => {
    dispatch({ type: Actions.CLOSE });
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
