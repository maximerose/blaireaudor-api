import type { User } from '@/types';

export interface Action {
  id: string;
  description: string;
  points: number;
  date_action: string;
  player?: { id: string; display_name: string };
  status: string;
  created_by: User | string;
}
