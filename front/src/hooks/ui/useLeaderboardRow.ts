import type { Competition } from '@/types';
import { getRankMedal, isPlayerCreator, isPlayerReferee } from '@/utils';

export const useLeaderboardRow = (
  item: any,
  isAdmin: boolean,
  competition: Competition,
) => {
  const canDelete = isAdmin && (!item.actions || item.actions.length === 0);

  const medal = getRankMedal(item.rank);
  const playerName =
    item.player?.display_name || item.player?.displayName || 'Anonyme';

  const isReferee = isPlayerReferee(competition, item.player?.id);
  const isCreator = isPlayerCreator(competition, item.player);

  return {
    canDelete,
    medal,
    playerName,
    isPlayerReferee: isReferee,
    isPlayerCreator: isCreator,
  };
};
