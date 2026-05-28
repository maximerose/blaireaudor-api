import toast from 'react-hot-toast';
import { CONFIRMS, SUCCESS, useConfirmModal } from '@/shared';
import {
  type Player,
  type PlayerCompact,
  type RefereeListItem,
} from '@/features/player';
import type { Competition } from '@/features/competition/types';
import { useCompetitionReferees } from './useCompetitionReferees';
import { useMemo } from 'react';
import { getCompetitionReferees } from '@/features/competition/utils';
import { usePlayerSearch } from '@/features/player/hooks/usePlayerSearch';

export const useRefereeManagementUI = (competition: Competition) => {
  const { addReferee, removeReferee, loadingAction } = useCompetitionReferees(
    competition.id,
    competition.join_code,
  );

  const { openModal, closeModal } = useConfirmModal();

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
    try {
      await addReferee(player.id);
      setSearchQuery('');
      toast.success(SUCCESS.REFEREE.ADDED(player.display_name));
    } catch {
      // L'erreur API a déjà été traitée et affichée par handleApiError.
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

        try {
          await removeReferee(ref.id);
          toast.success(
            isMe ? SUCCESS.REFEREE.RESIGNED : SUCCESS.REFEREE.REVOKED(ref.name),
          );
          closeModal();
        } catch {
          // L'erreur API est gérée en amont par handleApiError.
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
