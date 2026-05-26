import type { Competition } from '@/features/competition';
import type { Player } from '@/features/player';

export interface PlayerRecord {
  points: number;
  description: string;
  competition_name: string;
  involved_player_name: string | null;
}

export interface PlayerStats {
  total_actions_received: number;
  max_competition_actions_received: number;
  total_points_received: number;
  max_competition_score: number;
  average_points_per_competition: number;
  average_actions_received_per_competition: number;
  total_actions_reported: number;
  report_approval_ratio: number | null;
  report_to_received_ratio: number;
  max_points_single_action_received: PlayerRecord | null;
  max_points_single_action_reported: PlayerRecord | null;
  min_rank: number | null;
  max_rank: number | null;
  bonus_actions_ratio: number;
  max_reports_from_single_actor: { value: string; subtext: string } | null;
  max_reports_to_single_receiver: { value: string; subtext: string } | null;
  max_reciprocal_reports_with_single_peer: {
    value: string;
    subtext: string;
  } | null;
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
