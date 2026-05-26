import { useState, useMemo } from 'react';
import { useAuthContext } from '@/features/account';
import { PLAYER_STATS_CATEGORIES } from '@/features/stats/constants';
import type {
  CategoryItem,
  HintModalData,
  MetricItem,
  StatFocusData,
} from '@/features/stats/types';

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

  const focusReceived = useMemo((): StatFocusData | null => {
    const record = stats?.max_points_single_action_received;
    if (!record) return null;
    const involvedName =
      record.involved_player_name || (record as any).involvedPlayerName;
    return {
      points: record.points,
      description: record.description,
      competitionName:
        record.competition_name || (record as any).competitionName,
      involvedName,
      date: record.date,
      isMe: Boolean(
        involvedName &&
        user?.player?.display_name &&
        involvedName === user.player.display_name,
      ),
    };
  }, [stats, user]);

  const focusReported = useMemo((): StatFocusData | null => {
    const record = stats?.max_points_single_action_reported;
    if (!record) return null;
    const involvedName =
      record.involved_player_name || (record as any).involvedPlayerName;
    return {
      points: record.points,
      description: record.description,
      competitionName:
        record.competition_name || (record as any).competitionName,
      involvedName,
      date: record.date,
      isMe: Boolean(
        involvedName &&
        user?.player?.display_name &&
        involvedName === user.player.display_name,
      ),
    };
  }, [stats, user]);

  return {
    stats,
    categories,
    teaserMetrics,
    focusReceived,
    focusReported,
    activeHint,
    setActiveHint,
  };
};
