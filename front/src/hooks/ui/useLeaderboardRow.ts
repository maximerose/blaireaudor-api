import { getRankMedal } from '@/utils';

export const useLeaderboardRow = (item: any, isAdmin: boolean) => {
  const canDelete = isAdmin && (!item.actions || item.actions.length === 0);

  const medal = getRankMedal(item.rank);
  const playerName =
    item.player?.display_name || item.player?.displayName || 'Anonyme';

  return {
    canDelete,
    medal,
    playerName,
  };
};
