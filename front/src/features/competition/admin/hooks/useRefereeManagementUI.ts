import toast from 'react-hot-toast';
import { CONFIRMS, ERRORS, SUCCESS, useConfirmModal } from '@/shared';
import {
  usePlayerSearch,
  type Player,
  type PlayerCompact,
  type RefereeListItem,
} from '@/features/player';
import type { Competition } from '@/features/competition/types';
import { useCompetitionReferees } from './useCompetitionReferees';
import { useMemo } from 'react';
import { getCompetitionReferees } from '@/features/competition/utils';

export const useRefereeManagementUI = (competition: Competition) => {
  const { addReferee, removeReferee, loadingAction } = useCompetitionReferees(
    competition.id,
    competition.join_code,
  );

  const { openModal } = useConfirmModal();

  const referees = useMemo(
    () => getCompetitionReferees(competition),
    [competition],
  );
  const isLastRef = referees.length <= 1;

  const {
    searchTerm: searchQuery,
    setSearchTerm: setSearchQuery,
    results: rawSearchResults,
    searching: isSearching,
  } = usePlayerSearch();

  const searchResults = useMemo(() => {
    return rawSearchResults.filter(
      (p: Player) =>
        !referees.some((r: RefereeListItem) => String(r.id) === String(p.id)),
    );
  }, [rawSearchResults, referees]);

  const handleAdd = async (player: PlayerCompact) => {
    const success = await addReferee(player.id);
    if (success) {
      setSearchQuery('');
      toast.success(SUCCESS.REFEREE.ADDED(player.display_name));
    } else {
      toast.error(ERRORS.COMPETITION.REFEREE_ADD_FAILED);
    }
  };

  const handleRemoveRequest = async (ref: RefereeListItem, isMe: boolean) => {
    openModal({
      title: isMe
        ? CONFIRMS.REFEREE.RESIGN_TITLE
        : CONFIRMS.REFEREE.REVOKE_TITLE,
      message: isMe
        ? CONFIRMS.REFEREE.RESIGN_MESSAGE
        : CONFIRMS.REFEREE.REVOKE_MESSAGE(ref.name),
      onConfirm: async () => {
        if (!ref.id) return;

        const success = await removeReferee(ref.id);
        if (success) {
          toast.success(
            isMe ? SUCCESS.REFEREE.RESIGNED : SUCCESS.REFEREE.REVOKED(ref.name),
          );
        } else {
          toast.error(ERRORS.COMPETITION.REFEREE_REMOVE_FAILED);
        }
      },
    });
  };

  return {
    referees,
    isLastRef,
    loadingAction,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    handleAdd,
    handleRemoveRequest,
  };
};
