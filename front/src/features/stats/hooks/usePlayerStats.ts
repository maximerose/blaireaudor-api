import { useState, useMemo } from 'react';
import { useAuthContext } from '@/features/account';
import { PLAYER_STATS_UI } from '@/features/stats/constants';
import { ICONS } from '@/shared';

export interface HintModalData {
  title: string;
  description: string;
}

export interface MetricItem {
  label: string;
  val: string | number;
  icon: string;
  color: string;
  subtext?: string;
  hint?: HintModalData;
}

export interface CategoryItem {
  title: string;
  metrics: MetricItem[];
}

export const usePlayerStats = () => {
  const { user } = useAuthContext();
  const stats = user?.stats;
  const [activeHint, setActiveHint] = useState<HintModalData | null>(null);

  const categories = useMemo((): CategoryItem[] => {
    if (!stats) return [];

    const karmaValue = stats.report_to_received_ratio;
    const isPredateur = karmaValue > 1;
    const isMartyr = karmaValue < 1;

    const karmaLabel = isPredateur
      ? PLAYER_STATS_UI.DELATION.KARMA.PREDATEUR
      : isMartyr
        ? PLAYER_STATS_UI.DELATION.KARMA.MARTYR
        : PLAYER_STATS_UI.DELATION.KARMA.NEUTRAL;

    const karmaColor = isPredateur
      ? 'text-success-bright'
      : isMartyr
        ? 'text-danger-bright'
        : 'text-gold';

    return [
      {
        title: PLAYER_STATS_UI.RANKS.TITLE,
        metrics: [
          {
            ...PLAYER_STATS_UI.RANKS.BEST,
            val: stats.min_rank
              ? PLAYER_STATS_UI.FORMAT.RANK(stats.min_rank)
              : '-',
          },
          {
            ...PLAYER_STATS_UI.RANKS.WORST,
            val: stats.max_rank
              ? PLAYER_STATS_UI.FORMAT.RANK(stats.max_rank)
              : '-',
          },
        ],
      },
      {
        title: PLAYER_STATS_UI.POINTS.TITLE,
        metrics: [
          {
            ...PLAYER_STATS_UI.POINTS.TOTAL,
            val: PLAYER_STATS_UI.FORMAT.POINTS(stats.total_points_received),
          },
          {
            ...PLAYER_STATS_UI.POINTS.AVG,
            val: PLAYER_STATS_UI.FORMAT.POINTS(
              stats.average_points_per_competition,
            ),
          },
          {
            ...PLAYER_STATS_UI.POINTS.MAX,
            val: PLAYER_STATS_UI.FORMAT.POINTS(stats.max_competition_score),
          },
        ],
      },
      {
        title: PLAYER_STATS_UI.ACTIONS.TITLE,
        metrics: [
          {
            ...PLAYER_STATS_UI.ACTIONS.TOTAL,
            val: PLAYER_STATS_UI.FORMAT.ACTIONS(stats.total_actions_received),
          },
          {
            ...PLAYER_STATS_UI.ACTIONS.AVG,
            val: PLAYER_STATS_UI.FORMAT.ACTIONS(
              stats.average_actions_received_per_competition,
            ),
          },
          {
            ...PLAYER_STATS_UI.ACTIONS.MAX,
            val: PLAYER_STATS_UI.FORMAT.ACTIONS(
              stats.max_competition_actions_received,
            ),
          },
        ],
      },
      {
        title: PLAYER_STATS_UI.DELATION.TITLE,
        metrics: [
          {
            ...PLAYER_STATS_UI.DELATION.TOTAL,
            val: PLAYER_STATS_UI.FORMAT.ACTIONS(stats.total_actions_reported),
          },
          {
            ...PLAYER_STATS_UI.DELATION.PRECISION,
            val: PLAYER_STATS_UI.FORMAT.PERCENT(stats.report_approval_ratio),
          },
          {
            label: karmaLabel,
            val: karmaValue,
            icon: ICONS.REFEREE,
            color: karmaColor,
            hint: PLAYER_STATS_UI.DELATION.KARMA.hint,
          },
          {
            ...PLAYER_STATS_UI.DELATION.OPPORTUNISM,
            val: PLAYER_STATS_UI.FORMAT.PERCENT(stats.bonus_actions_ratio),
          },
        ],
      },
      {
        title: PLAYER_STATS_UI.RELATIONAL.TITLE,
        metrics: [
          {
            ...PLAYER_STATS_UI.RELATIONAL.MAIN_ENEMY,
            val: stats.max_reports_from_single_actor?.value || 'Aucun',
            subtext:
              stats.max_reports_from_single_actor?.subtext ||
              '0 alignement subi',
          },
          {
            ...PLAYER_STATS_UI.RELATIONAL.FAVORITE_VICTIM,
            val: stats.max_reports_to_single_receiver?.value || 'Aucun',
            subtext:
              stats.max_reports_to_single_receiver?.subtext ||
              '0 dossier envoyé',
          },
          {
            ...PLAYER_STATS_UI.RELATIONAL.VENDETTA,
            val:
              stats.max_reciprocal_reports_with_single_peer?.value || 'Aucune',
            subtext:
              stats.max_reciprocal_reports_with_single_peer?.subtext ||
              '0 coup échangé',
          },
        ],
      },
    ];
  }, [stats]);

  const teaserMetrics = useMemo((): MetricItem[] => {
    if (!stats) return [];

    return [
      {
        ...PLAYER_STATS_UI.RANKS.BEST,
        val: stats.min_rank ? PLAYER_STATS_UI.FORMAT.RANK(stats.min_rank) : '-',
      },
      {
        ...PLAYER_STATS_UI.POINTS.TOTAL,
        val: PLAYER_STATS_UI.FORMAT.POINTS(stats.total_points_received),
      },
      {
        ...PLAYER_STATS_UI.RANKS.WORST,
        val: stats.max_rank ? PLAYER_STATS_UI.FORMAT.RANK(stats.max_rank) : '-',
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
