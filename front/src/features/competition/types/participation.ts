import type { Player, PlayerCompact } from '@/features/player';
import type { Competition } from './competition';

export interface Participation {
  id: string;
  has_actions: boolean;
  validated_actions_count: number;
  player: Player;
  score: number;
  rank: number;
  competition: Competition;
}

export type EnrichedLeaderboardItem = Participation & {
  isMe: boolean;
  isExAequo: boolean;
};

export interface ReportingContextType {
  isReporting: boolean;
  toggleReporting: () => void;
  potentialTargets: PlayerCompact[];
}
