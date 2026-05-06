import type { BonusDay, FormParticipant, Player, User } from '@/types';

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
}

export interface CompetitionFormData {
  name: string;
  startDate: string;
  startTime: string;
  startFullDay: boolean;
  endDate: string;
  endTime: string;
  endFullDay: boolean;
  joinCode: string | null;
  participate: boolean;
  fogOfWar: boolean;
  isCreatorReferee: boolean;
  players: FormParticipant[];
  referees: FormParticipant[];
}
