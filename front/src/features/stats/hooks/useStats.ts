import { useState, useMemo } from 'react';
import { useAuthContext } from '@/features/account';
import { STATS_UI } from '@/features/stats/constants';

export interface HintModalData {
  title: string;
  description: string;
}

export interface MetricItem {
  label: string;
  val: string | number;
  icon: string;
  color: string;
  hint?: HintModalData;
}

export interface CategoryItem {
  title: string;
  metrics: MetricItem[];
}

export const useStats = () => {
  const { user } = useAuthContext();
  const stats = user?.stats;
  const [activeHint, setActiveHint] = useState<HintModalData | null>(null);

  const categories = useMemo((): CategoryItem[] => {
    if (!stats) return [];

    return [
      {
        title: STATS_UI.RANKS.TITLE,
        metrics: [
          {
            ...STATS_UI.RANKS.BEST,
            val: stats.best_rank ? STATS_UI.FORMAT.RANK(stats.best_rank) : '-',
          },
          {
            ...STATS_UI.RANKS.WORST,
            val: stats.worst_rank
              ? STATS_UI.FORMAT.RANK(stats.worst_rank)
              : '-',
          },
        ],
      },
      {
        title: STATS_UI.POINTS.TITLE,
        metrics: [
          {
            ...STATS_UI.POINTS.TOTAL,
            val: STATS_UI.FORMAT.POINTS(stats.total_accumulated_points),
          },
          {
            ...STATS_UI.POINTS.AVG,
            val: STATS_UI.FORMAT.POINTS(stats.average_points),
          },
          {
            ...STATS_UI.POINTS.MAX,
            val: STATS_UI.FORMAT.POINTS(stats.max_season_score),
          },
        ],
      },
      {
        title: STATS_UI.ACTIONS.TITLE,
        metrics: [
          {
            ...STATS_UI.ACTIONS.TOTAL,
            val: STATS_UI.FORMAT.ACTIONS(stats.total_actions_count),
          },
          {
            ...STATS_UI.ACTIONS.AVG,
            val: STATS_UI.FORMAT.ACTIONS(stats.recidivism_ratio),
          },
          {
            ...STATS_UI.ACTIONS.MAX,
            val: STATS_UI.FORMAT.ACTIONS(stats.max_season_actions),
          },
        ],
      },
      {
        title: STATS_UI.DELATION.TITLE,
        metrics: [
          {
            ...STATS_UI.DELATION.TOTAL,
            val: STATS_UI.FORMAT.ACTIONS(stats.total_reported_count),
          },
          {
            ...STATS_UI.DELATION.PRECISION,
            val: STATS_UI.FORMAT.PERCENT(stats.precision_rate),
          },
          {
            ...STATS_UI.DELATION.KARMA,
            val: stats.karma_index,
          },
        ],
      },
    ];
  }, [stats]);

  // 2. Triplette de tête pour le teaser de la page d'accueil (Dashboard principal)
  const teaserMetrics = useMemo((): MetricItem[] => {
    if (!stats) return [];

    return [
      {
        ...STATS_UI.RANKS.BEST,
        val: stats.best_rank ? STATS_UI.FORMAT.RANK(stats.best_rank) : '-',
      },
      {
        ...STATS_UI.POINTS.TOTAL,
        val: STATS_UI.FORMAT.POINTS(stats.total_accumulated_points),
      },
      {
        ...STATS_UI.RANKS.WORST,
        val: stats.worst_rank ? STATS_UI.FORMAT.RANK(stats.worst_rank) : '-',
      },
    ];
  }, [stats]);

  return {
    stats,
    categories,
    teaserMetrics,
    activeHint,
    setActiveHint,
  };
};
