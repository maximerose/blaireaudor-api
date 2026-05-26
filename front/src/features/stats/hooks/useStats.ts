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
            val: stats.min_rank ? STATS_UI.FORMAT.RANK(stats.min_rank) : '-',
          },
          {
            ...STATS_UI.RANKS.WORST,
            val: stats.max_rank ? STATS_UI.FORMAT.RANK(stats.max_rank) : '-',
          },
        ],
      },
      {
        title: STATS_UI.POINTS.TITLE,
        metrics: [
          {
            ...STATS_UI.POINTS.TOTAL,
            val: STATS_UI.FORMAT.POINTS(stats.total_points_received),
          },
          {
            ...STATS_UI.POINTS.AVG,
            val: STATS_UI.FORMAT.POINTS(stats.average_points_per_competition),
          },
          {
            ...STATS_UI.POINTS.MAX,
            val: STATS_UI.FORMAT.POINTS(stats.max_competition_score),
          },
        ],
      },
      {
        title: STATS_UI.ACTIONS.TITLE,
        metrics: [
          {
            ...STATS_UI.ACTIONS.TOTAL,
            val: STATS_UI.FORMAT.ACTIONS(stats.total_actions_received),
          },
          {
            ...STATS_UI.ACTIONS.AVG,
            val: STATS_UI.FORMAT.ACTIONS(
              stats.average_actions_received_per_competition,
            ),
          },
          {
            ...STATS_UI.ACTIONS.MAX,
            val: STATS_UI.FORMAT.ACTIONS(
              stats.max_competition_actions_received,
            ),
          },
        ],
      },
      {
        title: STATS_UI.DELATION.TITLE,
        metrics: [
          {
            ...STATS_UI.DELATION.TOTAL,
            val: STATS_UI.FORMAT.ACTIONS(stats.total_actions_reported),
          },
          {
            ...STATS_UI.DELATION.PRECISION,
            val: STATS_UI.FORMAT.PERCENT(stats.report_approval_ratio),
          },
          {
            ...STATS_UI.DELATION.KARMA,
            val: stats.report_to_received_ratio,
          },
        ],
      },
    ];
  }, [stats]);

  const teaserMetrics = useMemo((): MetricItem[] => {
    if (!stats) return [];

    return [
      {
        ...STATS_UI.RANKS.BEST,
        val: stats.min_rank ? STATS_UI.FORMAT.RANK(stats.min_rank) : '-',
      },
      {
        ...STATS_UI.POINTS.TOTAL,
        val: STATS_UI.FORMAT.POINTS(stats.total_points_received),
      },
      {
        ...STATS_UI.RANKS.WORST,
        val: stats.max_rank ? STATS_UI.FORMAT.RANK(stats.max_rank) : '-',
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
