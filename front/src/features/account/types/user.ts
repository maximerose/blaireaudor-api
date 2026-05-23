import type { Competition } from '@/features/competition';
import type { Player } from '@/features/player';

export interface PlayerRecord {
  points: number;
  description: string;
  competition_name: string;
  involved_player_name: string | null;
}

export interface PlayerStats {
  total_actions_count: number;
  max_season_actions: number;
  total_accumulated_points: number;
  max_season_score: number;
  average_points: number;
  recidivism_ratio: number;
  total_reported_count: number;
  precision_rate: number | null;
  karma_index: number;
  record: PlayerRecord | null;
  worst_stab: PlayerRecord | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  player?: Player;
  created_competitions: Competition[];
  stats?: PlayerStats;
}
