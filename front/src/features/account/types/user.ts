import type { Competition } from '@/features/competition';
import type { Player } from '@/features/player';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  player?: Player;
  created_competitions: Competition[];
}
