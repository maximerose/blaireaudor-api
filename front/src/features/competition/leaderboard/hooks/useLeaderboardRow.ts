import { getIdFromData } from '@/shared';
import type {
  Competition,
  EnrichedLeaderboardItem,
} from '@/features/competition/types';
import {
  getRankMedal,
  isCreator,
  isReferee,
} from '@/features/competition/utils';

export const useLeaderboardRow = (
  participation: EnrichedLeaderboardItem,
  isAdmin: boolean,
  competition: Competition,
) => {
  const medal = getRankMedal(participation.rank);
  const playerName = participation.player?.display_name || 'Anonyme';

  const playerId = getIdFromData(participation.player);

  const canDelete =
    isAdmin && !participation.has_actions && !competition.is_finished;

  return {
    canDelete,
    medal,
    playerName,
    hasAccount: participation.player?.has_account ?? false,
    isReferee: isReferee(competition, playerId),
    isCreator: isCreator(competition, participation.player),
  };
};
