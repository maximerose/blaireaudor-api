import type { Competition } from '@/types';
import {
  getIdFromData,
  getRankMedal,
  isPlayerCreator,
  isPlayerReferee,
} from '@/utils';
import type { EnrichedLeaderboardItem } from '../competition/useLeaderboardLogic';

export const useLeaderboardRow = (
  participation: EnrichedLeaderboardItem,
  isAdmin: boolean,
  competition: Competition,
) => {
  const medal = getRankMedal(participation.rank);
  const playerName = participation.player?.display_name || 'Anonyme';

  const playerId = getIdFromData(participation.player);

  const isReferee = isPlayerReferee(competition, playerId);
  const isCreator = isPlayerCreator(competition, participation.player);

  const canDelete =
    isAdmin && (!participation.actions || participation.actions.length === 0);

  return {
    canDelete,
    medal,
    playerName,
    isPlayerReferee: isReferee,
    isPlayerCreator: isCreator,
  };
};
