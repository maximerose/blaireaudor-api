import type { Player } from '@/features/player';
import type { Competition } from '@/types';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  player?: Player;
  created_competitions: Competition[];
}
