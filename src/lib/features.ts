import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { api } from '~/convex/api';

export enum FeatureFlags {
  PROJECT_PREVIEWS = 'isProjectPreviewsEnabled',
  PROJECT_VIEWER = 'isProjectViewerEnabled',
}

export type FeaturesMap = Map<`${FeatureFlags}`, boolean>;

export const useFeatureFlags = () => {
  const features = useQuery(api.features.loadFeatureFlags);
  const isLoading = features === undefined;
  const featuresMap = useMemo<FeaturesMap>(
    () =>
      new Map(
        (features || []).map((feat) => [feat.key as FeatureFlags, feat.value]),
      ),
    [features],
  );

  return {
    features: featuresMap,
    isLoading,
  };
};
