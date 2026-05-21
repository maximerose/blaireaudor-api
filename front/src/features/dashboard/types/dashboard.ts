import type { Competition, Participation } from '@/types';

export interface DashboardItem {
  competition: Competition;
  participation?: Participation;
}
