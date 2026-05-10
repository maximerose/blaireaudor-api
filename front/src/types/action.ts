export const ActionStatus = {
  PENDING: 'pending',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
} as const;

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus];
export type ActionSortField =
  | 'date_action'
  | 'player'
  | 'points'
  | 'status'
  | 'description';

export interface Action {
  id: string;
  description: string;
  points: number;
  date_action: string;
  player_id: string;
  player_name: string;
  status: ActionStatus;
  created_by_id: string;
  creator_name?: string;
}

/**
 * PAYLOADS (Transfert de données vers l'API)
 */
export interface ActionCreatePayload {
  description: string;
  points: number;
  date_action: string;
  player: string;
  competition?: string;
  status?: ActionStatus;
}

export type ActionUpdatePayload = Partial<
  Omit<ActionCreatePayload, 'player'> & {
    status: ActionStatus;
    player: string;
  }
>;

export interface ActionFormData {
  targetPlayerId: string;
  description: string;
  points: number;
  dateAction: string;
}

export type OnActionUpdate = (id: string, data: ActionUpdatePayload) => void;
export type OnActionStatusChange = (id: string, status: ActionStatus) => void;

export interface ActionRowProps {
  action: Action;
  onUpdate: OnActionUpdate;
  onStatusChange: OnActionStatusChange;
}

export interface ActionEditData {
  description: string;
  points: number | string;
}

export interface DateNavigationProps {
  dates: string[];
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
}
