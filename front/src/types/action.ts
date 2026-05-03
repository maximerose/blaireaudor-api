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
}
