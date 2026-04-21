import { useMemo } from 'react';
import type { User } from '../context/AuthContext';

export interface EnrichedLeaderboardItem {
  id: string;
  player: any;
  score: number;
  actions: any[];
  rank: number;
  medal?: { icon: string; label: string };
  isMe: boolean;
  isExAequo: boolean;
}

export const useLeaderboardLogic = (data: any[], currentUser: User | null) => {
  return useMemo(() => {
    const sortedData = [...data].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const nameA = (
        a.player.display_name ||
        a.player.displayName ||
        ''
      ).toLowerCase();
      const nameB = (
        b.player.display_name ||
        b.player.displayName ||
        ''
      ).toLowerCase();
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
        isMe: currentUser?.player?.username === item.player.username,
        isExAequo: scoreCounts[item.score] > 1,
      } as EnrichedLeaderboardItem;
    });
  }, [data, currentUser]);
};
