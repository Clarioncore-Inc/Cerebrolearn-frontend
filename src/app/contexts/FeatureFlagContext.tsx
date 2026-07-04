import React, { createContext, useContext } from 'react';

interface FeatureFlags {
  isIQOnlyMode: boolean;
  showLearnerFeatures: boolean;
  showInstructorFeatures: boolean;
  showCourseFeatures: boolean;
}

// Set VITE_APP_MODE=iq-only in the deployment environment to hide all
// learner/instructor/course marketing and navigation. Defaults to the
// full platform so existing local/dev setups are unaffected.
const isIQOnlyMode = import.meta.env.VITE_APP_MODE === 'iq-only';

const featureFlags: FeatureFlags = {
  isIQOnlyMode,
  showLearnerFeatures: !isIQOnlyMode,
  showInstructorFeatures: !isIQOnlyMode,
  showCourseFeatures: !isIQOnlyMode,
};

const FeatureFlagContext = createContext<FeatureFlags>(featureFlags);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}
