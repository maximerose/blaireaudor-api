import { useMemo } from 'react';
import { getCompetitionReferees } from '@/utils';
import { useCompetitionReferees, usePlayerSearch } from '@/hooks';
import toast from 'react-hot-toast';
import type { Player, Competition, RefereeListItem } from '@/types';
import { CONFIRMS, ERRORS, SUCCESS } from '@/constants';

export const useRefereeManagementUI = (competition: Competition) => {
  const { addReferee, removeReferee, loadingAction } = useCompetitionReferees(
    competition.id,
    competition.join_code,
  );

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

  const handleAdd = async (player: Player) => {
    const success = await addReferee(player.id);
    if (success) {
      setSearchQuery('');
      toast.success(SUCCESS.REFEREE.ADDED(player.display_name));
    } else {
      toast.error(ERRORS.COMPETITION.REFEREE_ADD_FAILED);
    }
  };

  const handleRemoveRequest = async (ref: RefereeListItem, isMe: boolean) => {
    const confirmMsg = isMe
      ? CONFIRMS.REFEREE.RESIGN
      : CONFIRMS.REFEREE.REVOKE(ref.name);

    if (window.confirm(confirmMsg)) {
      if (!ref.id) return;

      const success = await removeReferee(ref.id);
      if (success) {
        toast.success(
          isMe ? SUCCESS.REFEREE.RESIGNED : SUCCESS.REFEREE.REVOKED(ref.name),
        );
      } else {
        toast.error(ERRORS.COMPETITION.REFEREE_REMOVE_FAILED);
      }
    }
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
