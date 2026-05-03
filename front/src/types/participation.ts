import type { Competition, Player } from '@/types';

export interface Participation {
  player: Player;
  score: number;
  rank: number;
  competition: Competition;
}
