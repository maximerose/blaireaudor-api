import type { Competition, Player } from '@/types';

export interface Participation {
  id: string;
  has_actions: boolean;
  player: Player;
  score: number;
  rank: number;
  competition: Competition;
}

export type EnrichedLeaderboardItem = Participation & {
  isMe: boolean;
  isExAequo: boolean;
};
