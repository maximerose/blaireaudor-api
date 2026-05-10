import type { Competition, EnrichedLeaderboardItem } from '@/types';
import { getIdFromData, getRankMedal, isCreator, isReferee } from '@/utils';

export const useLeaderboardRow = (
  participation: EnrichedLeaderboardItem,
  isAdmin: boolean,
  competition: Competition,
) => {
  const medal = getRankMedal(participation.rank);
  const playerName = participation.player?.display_name || 'Anonyme';

  const playerId = getIdFromData(participation.player);

  const canDelete = isAdmin && !participation.has_actions;

  return {
    canDelete,
    medal,
    playerName,
    isReferee: isReferee(competition, playerId),
    isCreator: isCreator(competition, participation.player),
  };
};
