import { usePlayerStats } from './usePlayerStats';

export const useDashboardStats = () => {
  const { stats, teaserMetrics, activeHint, setActiveHint } = usePlayerStats();

  return {
    stats,
    teaserMetrics,
    activeHint,
    setActiveHint,
    maxReceived: stats?.max_points_single_action_received || null,
    maxReported: stats?.max_points_single_action_reported || null,
  };
};
