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
    let currentRankPosition = 0;
    let previousScore: number | null = null;

    const scoreFrequencies = participations.reduce(
      (frequencies, currentParticipation) => {
        const currentScore = currentParticipation.score;
        frequencies[currentScore] = (frequencies[currentScore] || 0) + 1;

        return frequencies;
      },
      {} as Record<number, number>,
    );

    return participations.map((participation) => {
      if (participation.score !== previousScore) {
        currentRankPosition++;
        previousScore = participation.score;
      }

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
