import type { Competition, Player } from '@/types';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  player?: Player;
  created_competitions: Competition[];
}
