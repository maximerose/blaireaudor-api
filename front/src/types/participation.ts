import type { Player } from '@/features/player';
import type { Competition } from '@/types';

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
