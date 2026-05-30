import { useAuthContext } from '@/features/account/context/AuthContext';
import {
  PLAYER_FOCUS_STATS,
  PLAYER_STATS_CATEGORIES,
} from '@/features/stats/constants';
import type {
  CategoryItem,
  HintModalData,
  MetricItem,
} from '@/features/stats/types';
import { useMemo, useState } from 'react';

export const usePlayerStats = () => {
  const { user } = useAuthContext();
  const stats = user?.stats;
  const [activeHint, setActiveHint] = useState<HintModalData | null>(null);

  const categories = useMemo((): CategoryItem[] => {
    if (!stats) return [];

    return PLAYER_STATS_CATEGORIES.map((category) => ({
      title: category.title,
      metrics: category.metrics.map((metric) => ({
        id: metric.id,
        label: metric.getLabel(stats),
        icon: metric.icon,
        color: metric.getColor(stats),
        val: metric.getValue(stats),
        subtext: metric.getSubtext ? metric.getSubtext(stats) : undefined,
        competitionName: metric.getCompetitionName
          ? metric.getCompetitionName(stats)
          : undefined,
        hint: metric.hint,
      })),
    }));
  }, [stats]);

  const teaserMetrics = useMemo((): MetricItem[] => {
    if (!categories.length) return [];

    const allMetrics = categories.flatMap((c) => c.metrics);

    const getMetric = (id: string) => allMetrics.find((m) => m.id === id);

    return [
      getMetric('min_rank'),
      getMetric('total_points_received'),
      getMetric('max_rank'),
    ].filter(Boolean) as MetricItem[];
  }, [categories]);

  const focusCards = useMemo(() => {
    if (!stats) return [];
    return PLAYER_FOCUS_STATS.map((config) => ({
      ...config,
      data: config.getData(stats, user),
    }));
  }, [stats, user]);

  return {
    stats,
    categories,
    teaserMetrics,
    focusCards,
    activeHint,
    setActiveHint,
  };
};
