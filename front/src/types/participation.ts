import type { Action, Competition, Player } from '@/types';

export interface Participation {
  id: string;
  actions: Action[];
  player: Player;
  score: number;
  rank: number;
  competition: Competition;
}
