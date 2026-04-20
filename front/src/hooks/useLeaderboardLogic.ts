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
    let currentRank = 0;
    let lastScore = -1;

    return data.map((item, index) => {
      if (item.score !== lastScore) {
        currentRank = index + 1;
      }

      const isExAequo = item.score === lastScore;
      lastScore = item.score;

      let medal;
      if (currentRank === 1) medal = { icon: '🥇', label: 'Or' };
      else if (currentRank === 2) medal = { icon: '🥈', label: 'Argent' };
      else if (currentRank === 3) medal = { icon: '🥉', label: 'Bronze' };

      return {
        ...item,
        rank: currentRank,
        medal,
        isMe: currentUser?.player?.username === item.player.username,
        isExAequo: isExAequo,
      } as EnrichedLeaderboardItem;
    });
  }, [data, currentUser]);
};
