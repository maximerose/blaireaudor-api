import { useState, useMemo } from 'react';
import { useAuthContext } from '@/features/account';
import { ICONS } from '@/shared';
import { DASHBOARD_UI } from '@/features/dashboard/constants';

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

export const useDashboardStats = () => {
  const { user } = useAuthContext();
  const stats = user?.stats;
  const [activeHint, setActiveHint] = useState<HintModalData | null>(null);

  const categories = useMemo((): CategoryItem[] => {
    if (!stats) return [];

    const ui = DASHBOARD_UI.STATS_PANEL;

    return [
      {
        title: ui.POINTS.TITLE,
        metrics: [
          {
            label: ui.POINTS.TOTAL.LABEL,
            val: ui.POINTS.TOTAL.VAL(stats.total_accumulated_points),
            icon: ICONS.POINTS,
            color: 'text-gold',
          },
          {
            label: ui.POINTS.AVG.LABEL,
            val: ui.POINTS.AVG.VAL(stats.average_points),
            icon: ICONS.CALENDAR,
            color: 'text-info-bright',
          },
          {
            label: ui.POINTS.MAX.LABEL,
            val: ui.POINTS.MAX.VAL(stats.max_season_score),
            icon: ICONS.FLAG,
            color: 'text-danger-bright',
          },
        ],
      },
      {
        title: ui.ACTIONS.TITLE,
        metrics: [
          {
            label: ui.ACTIONS.TOTAL.LABEL,
            val: ui.ACTIONS.TOTAL.VAL(stats.total_actions_count),
            icon: ICONS.BADGER,
            color: 'text-gold',
          },
          {
            label: ui.ACTIONS.AVG.LABEL,
            val: ui.ACTIONS.AVG.VAL(stats.recidivism_ratio),
            icon: ICONS.ALARM,
            color: 'text-info-bright',
          },
          {
            label: ui.ACTIONS.MAX.LABEL,
            val: ui.ACTIONS.MAX.VAL(stats.max_season_actions),
            icon: ICONS.EMPTY,
            color: 'text-danger-bright',
          },
        ],
      },
      {
        title: ui.DELATION.TITLE,
        metrics: [
          {
            label: ui.DELATION.TOTAL.LABEL(stats.total_reported_count),
            val: ui.DELATION.TOTAL.VAL(stats.total_reported_count),
            icon: ICONS.GUEST_EYE,
            color: 'text-gold',
          },
          {
            label: ui.DELATION.PRECISION.LABEL,
            val: ui.DELATION.PRECISION.VAL(stats.precision_rate),
            icon: ICONS.CHECK,
            color: 'text-info-bright',
            hint: {
              title: ui.DELATION.PRECISION.LABEL,
              description: ui.DELATION.PRECISION.HINT,
            },
          },
          {
            label: ui.DELATION.KARMA.LABEL,
            val: stats.karma_index,
            icon: ICONS.REFEREE,
            color: 'text-danger-bright',
            hint: {
              title: ui.DELATION.KARMA.LABEL,
              description: ui.DELATION.KARMA.HINT,
            },
          },
        ],
      },
    ];
  }, [stats]);

  return {
    stats,
    categories,
    activeHint,
    setActiveHint,
  };
};
