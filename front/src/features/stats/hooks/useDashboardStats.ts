import { usePlayerStats } from './usePlayerStats';

export const useDashboardStats = () => {
  const { stats, teaserMetrics, focusCards, activeHint, setActiveHint } =
    usePlayerStats();

  return {
    stats,
    teaserMetrics,
    activeHint,
    setActiveHint,
    focusCards,
  };
};
