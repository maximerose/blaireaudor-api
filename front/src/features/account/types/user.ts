import type { Competition } from '@/features/competition';
import type { Player } from '@/features/player';

export interface PlayerRecord {
  points: number;
  description: string;
  competition_name: string;
  involved_player_name: string | null;
  date?: string | null;
}

export interface PlayerStats {
  ongoing_competitions: number;
  upcoming_competitions: number;
  finished_competitions: number;
  created_competitions: number;
  refereed_competitions: number;
  total_actions_received: number;
  total_points_received: number;
  max_competition_score: PlayerRecord | null;
  max_competition_actions_received: PlayerRecord | null;
  min_competition_score: PlayerRecord | null;
  min_competition_actions_received: PlayerRecord | null;
  average_points_per_competition: number;
  average_actions_received_per_competition: number;
  total_actions_reported: number;
  report_approval_ratio: number | null;
  report_to_received_ratio: number;
  max_points_single_action_received: PlayerRecord | null;
  max_points_single_action_reported: PlayerRecord | null;
  min_avg_points_received: {
    competition_name: string;
    average: number;
    count: number;
  } | null;
  max_avg_points_received: {
    competition_name: string;
    average: number;
    count: number;
  } | null;
  min_rank: { rank: number; competition_name: string } | null;
  max_rank: { rank: number; competition_name: string } | null;
  bonus_actions_ratio: number;
  max_reports_from_single_actor: { player_name: string; count: number } | null;
  max_reports_to_single_receiver: { player_name: string; count: number } | null;
  max_reciprocal_reports_with_single_peer: {
    player_name: string;
    reciprocal_score: number;
    total_sent: number;
    total_received: number;
  } | null;
  total_distinct_targets: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  player?: Player;
  created_competitions: Competition[];
  stats?: PlayerStats;
  notification_preferences?: Record<string, boolean>;
}
