import type { EnrichedLeaderboardItem } from '@/features/competition';
import { PROGRESS_BANNER_METRICS } from '@/features/stats/constants';
import type { MetricItem, ProgressBannerData } from '@/features/stats/types';
import { useMemo } from 'react';

interface UseProgressBannerUIProps {
  myParticipation: EnrichedLeaderboardItem;
  leaderboard: EnrichedLeaderboardItem[];
  myPlayerId: string | undefined;
  totalPoints: number;
}

export const useProgressBannerUI = ({
  myParticipation,
  leaderboard,
  myPlayerId,
  totalPoints,
}: UseProgressBannerUIProps) => {
  const leader = leaderboard[0];

  const pointsBehind = useMemo(() => {
    return leader && leader.player.id !== myPlayerId
      ? leader.score - myParticipation.score
      : 0;
  }, [leader, myParticipation, myPlayerId]);

  const metrics = useMemo((): MetricItem[] => {
    const actionsCount = myParticipation.validated_actions_count ?? 0;
    const averageSeverity =
      actionsCount > 0 ? (myParticipation.score / actionsCount).toFixed(1) : 0;
    const arenaWeight =
      totalPoints > 0
        ? Math.round((myParticipation.score / totalPoints) * 100)
        : 0;

    const data: ProgressBannerData = {
      score: myParticipation.score,
      pointsBehind,
      rank: myParticipation.rank,
      actionsCount,
      averageSeverity,
      arenaWeight,
    };

    return PROGRESS_BANNER_METRICS.map((config) => ({
      id: config.id,
      label: config.getLabel(),
      icon: config.icon,
      color: config.getColor(data),
      val: config.getValue(data),
      hint: config.hint,
    }));
  }, [myParticipation, pointsBehind, totalPoints]);

  return { metrics };
};
