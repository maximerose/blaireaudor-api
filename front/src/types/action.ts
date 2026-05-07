import type { User } from '@/types';

export const ActionStatus = {
  PENDING: 'pending',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
} as const;

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus];

export interface Action {
  id: string;
  description: string;
  points: number;
  date_action: string;
  player?: { id: string; display_name: string };
  status: ActionStatus;
  created_by: User | string;
  creator_name?: string;
}

export type OnActionUpdate = (action: Action) => void;
export type OnActionStatusChange = (id: string, status: ActionStatus) => void;

export interface ActionTableProps {
  actions: Action[];
  onUpdate: OnActionUpdate;
  onStatusChange: OnActionStatusChange;
}

export interface ActionRowProps {
  action: Action;
  onUpdate: OnActionUpdate;
  onStatusChange: OnActionStatusChange;
}
