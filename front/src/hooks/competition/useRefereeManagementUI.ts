import { useMemo } from 'react';
import { getCompetitionReferees } from '@/utils';
import { useCompetitionReferees, usePlayerSearch } from '@/hooks';
import toast from 'react-hot-toast';
import type { Player, Competition, RefereeListItem } from '@/types';

export const useRefereeManagementUI = (
  competition: Competition,
  onRefresh: () => void,
) => {
  const { addReferee, removeReferee, loadingAction } = useCompetitionReferees(
    competition.id,
    onRefresh,
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
      (p: Player) => !referees.some((r: any) => String(r.id) === String(p.id)),
    );
  }, [rawSearchResults, referees]);

  const handleAdd = async (player: Player) => {
    const success = await addReferee(player.id);
    if (success) {
      setSearchQuery('');
      toast.success(`${player.display_name} est désormais arbitre.`);
    } else {
      toast.error(`Impossible de nommer ce joueur.`);
    }
  };

  const handleRemoveRequest = async (ref: RefereeListItem, isMe: boolean) => {
    const confirmMsg = isMe
      ? "Êtes-vous sûr de vouloir démissionner de l'arbitrage ?"
      : `Voulez-vous vraiment révoquer les droits de ${ref.name} ?`;

    if (window.confirm(confirmMsg)) {
      if (!ref.id) return;

      const success = await removeReferee(ref.id);
      if (success) {
        toast.success(
          isMe ? "Vous avez quitté l'arbitrage." : `${ref.name} révoqué.`,
        );
      } else {
        toast.error('Échec de la révocation.');
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
