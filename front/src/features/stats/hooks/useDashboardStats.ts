import { usePlayerStats } from './usePlayerStats';

export const useDashboardStats = () => {
  const {
    stats,
    teaserMetrics,
    focusReceived,
    focusReported,
    activeHint,
    setActiveHint,
  } = usePlayerStats();

  return {
    stats,
    teaserMetrics,
    activeHint,
    setActiveHint,
    maxReceived: focusReceived,
    maxReported: focusReported,
  };
};
