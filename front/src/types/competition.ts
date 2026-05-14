import type {
  BonusDay,
  EnrichedLeaderboardItem,
  FormParticipant,
  Participation,
  Player,
  User,
} from '@/types';

export interface Competition {
  id: string;
  name: string;
  join_code: string;
  start_date: string;
  end_date: string;
  is_finished: boolean;
  is_urgent: boolean;
  fog_of_war: boolean;
  participants_count: number;
  has_started: boolean;
  created_by: User;
  creator_name: string;
  referees: (Player | string)[];
  bonus_days: Array<BonusDay>;
  participations?: Participation[];
  leaderboard?: EnrichedLeaderboardItem[];
}

/**
 * PAYLOADS (Transfert vers l'API)
 */
export interface CompetitionCreatePayload {
  name: string;
  start_date: string; // Format ISO string
  end_date?: string | null;
  join_code?: string | null;
  fog_of_war?: boolean;
  referees?: string[]; // Tableau d'IRIs (ex: ["/api/players/1"])
  players?: string[]; // Tableau d'IRIs
  participate?: boolean; // Si le créateur veut s'auto-inscrire
  is_creator_referee?: boolean;
}

export type CompetitionUpdatePayload = Partial<
  Omit<CompetitionCreatePayload, 'participate'>
>;

export interface CompetitionFormData {
  name: string;
  startDate: string;
  startTime: string;
  startFullDay: boolean;
  endDate: string;
  endTime: string;
  endFullDay: boolean;
  joinCode?: string | null;
  participate?: boolean;
  fogOfWar?: boolean;
  isCreatorReferee?: boolean;
  players?: FormParticipant[];
  referees?: FormParticipant[];
}

export const CompetitionStatus = {
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING',
  FINISHED: 'FINISHED',
} as const;

export type CompetitionStatusType =
  (typeof CompetitionStatus)[keyof typeof CompetitionStatus];

export interface DashboardItem {
  competition: Competition;
  participation?: Participation;
}
