import type {
  Competition,
  EnrichedLeaderboardItem,
} from '@/features/competition/types';
import {
  getRankMedal,
  isCreator,
  isReferee,
} from '@/features/competition/utils';
import { getIdFromData } from '@/shared';
import { useState } from 'react';

export const useLeaderboardRow = (
  participation: EnrichedLeaderboardItem,
  isAdmin: boolean,
  competition: Competition,
) => {
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

  const medal = getRankMedal(participation.rank);
  const playerName = participation.player?.display_name || null;

  const playerId = getIdFromData(participation.player);

  const canDelete =
    !participation.has_actions &&
    !competition.is_finished &&
    (isAdmin || participation.isMe);

  return {
    canDelete,
    isMe: participation.isMe,
    medal,
    playerName,
    hasAccount: participation.player?.has_account ?? false,
    isReferee: isReferee(competition, playerId),
    isCreator: isCreator(competition, participation.player),
    isMergeModalOpen,
    setIsMergeModalOpen,
  };
};
