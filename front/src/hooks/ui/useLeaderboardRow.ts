import type { Competition, EnrichedLeaderboardItem } from '@/types';
import {
  getIdFromData,
  getRankMedal,
  isPlayerCreator,
  isPlayerReferee,
} from '@/utils';

export const useLeaderboardRow = (
  participation: EnrichedLeaderboardItem,
  isAdmin: boolean,
  competition: Competition,
) => {
  console.log('Je passe dans useLeaderboardRow');
  console.log('participation', participation);
  const medal = getRankMedal(participation.rank);
  const playerName = participation.player?.display_name || 'Anonyme';

  const playerId = getIdFromData(participation.player);

  const isReferee = isPlayerReferee(competition, playerId);
  const isCreator = isPlayerCreator(competition, participation.player);

  const canDelete = isAdmin && !participation.has_actions;

  return {
    canDelete,
    medal,
    playerName,
    isPlayerReferee: isReferee,
    isPlayerCreator: isCreator,
  };
};
