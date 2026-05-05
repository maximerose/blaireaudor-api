import type { Participation } from '@/types';
import { useMemo } from 'react';
import { useAuth } from '../auth/useAuth';
import { getIdFromData } from '@/utils';

export interface EnrichedLeaderboardItem {
  rank: number;
  isMe: boolean;
  isExAequo: boolean;
}

export const useLeaderboardLogic = (participations: Participation[]) => {
  const { user } = useAuth();

  const currentPlayerId = user?.player?.id?.toString();

  return useMemo(() => {
    const sortedData = [...participations].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      const nameA = (a.player.display_name || '').toLowerCase();
      const nameB = (b.player.display_name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    const scoreCounts = sortedData.reduce(
      (acc, item) => {
        acc[item.score] = (acc[item.score] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    let currentRank = 0;
    let lastScore = -1;

    return sortedData.map((item, index) => {
      if (item.score !== lastScore) {
        currentRank = index + 1;
      }
      lastScore = item.score;

      return {
        ...item,
        rank: currentRank,
        isMe: getIdFromData(item.player) === currentPlayerId,
        isExAequo: scoreCounts[item.score] > 1,
      } as EnrichedLeaderboardItem;
    });
  }, [participations, currentPlayerId]);
};
