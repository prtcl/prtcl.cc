import { useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import { api } from '~/convex/api';
import { createEnumGuard, type EnumToString } from '~/types/utils';

export enum FeatureFlags {
  PROJECT_PREVIEWS = 'isProjectPreviewsEnabled',
  PROJECT_VIEWER = 'isProjectViewerEnabled',
}

type FlagValues = EnumToString<typeof FeatureFlags>;
export type FeaturesMap = Map<FlagValues, boolean>;

export const isFeatureFlag = createEnumGuard(FeatureFlags);

const bootstrapFlagState = () => {
  const q = new URLSearchParams(location.search);
  const initialFeatures = (q.get('features') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(isFeatureFlag);

  return new Map(initialFeatures.map((f) => [f, true]));
};

export const useFeatureFlags = () => {
  const [initialOverrides] = useState(() => bootstrapFlagState());
  const features = useQuery(api.features.loadFeatureFlags);
  const isLoading = features === undefined;
  const featuresMap = useMemo<FeaturesMap>(
    () =>
      (features || []).reduce<FeaturesMap>((res, feat) => {
        if (isFeatureFlag(feat.key)) {
          res.set(feat.key, initialOverrides.get(feat.key) || feat.value);
        }

        return res;
      }, new Map()),

    [features, initialOverrides],
  );

  return {
    features: featuresMap,
    isLoading,
  };
};
