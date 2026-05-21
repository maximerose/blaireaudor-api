import type { Competition, Participation } from '@/features/competition';

export interface DashboardItem {
  competition: Competition;
  participation?: Participation;
}
