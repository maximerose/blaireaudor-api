import type { Participation } from '@/types';
import { useMemo } from 'react';
import { useAuth } from '../auth/useAuth';
import { getIdFromData } from '@/utils';

export type EnrichedLeaderboardItem = Participation & {
  id: string;
  rank: number;
  isMe: boolean;
  isExAequo: boolean;
};

export const useLeaderboardLogic = (participations: Participation[]) => {
  const { user } = useAuth();
  const currentPlayerId = user?.player?.id?.toString();

  return useMemo(() => {
    const rankedParticipations = [...participations].sort(
      (participationA, participationB) => {
        if (participationB.score !== participationA.score)
          return participationB.score - participationA.score;

        const playerNameA = (
          participationA.player.display_name || ''
        ).toLowerCase();
        const playerNameB = (
          participationB.player.display_name || ''
        ).toLowerCase();

        return playerNameA.localeCompare(playerNameB);
      },
    );

    const scoreFrequencies = rankedParticipations.reduce(
      (frequencies, currentParticipation) => {
        const currentScore = currentParticipation.score;
        frequencies[currentScore] = (frequencies[currentScore] || 0) + 1;

        return frequencies;
      },
      {} as Record<number, number>,
    );

    let currentRankPosition = 0;
    let previousScore = -1;

    return rankedParticipations.map((participation, index) => {
      if (participation.score !== previousScore) {
        currentRankPosition = index + 1;
      }
      previousScore = participation.score;

      return {
        ...participation,
        id: participation.id || getIdFromData(participation),
        rank: currentRankPosition,
        isMe: getIdFromData(participation.player) === currentPlayerId,
        isExAequo: scoreFrequencies[participation.score] > 1,
      } as EnrichedLeaderboardItem;
    });
  }, [participations, currentPlayerId]);
};
