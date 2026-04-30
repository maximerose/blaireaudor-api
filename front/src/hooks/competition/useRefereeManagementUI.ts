import { useState, useEffect, useMemo } from 'react';
import { getCompetitionReferees } from '@/utils';
import { useCompetitionReferees } from './useCompetitionReferees';
import type { Competition, Player } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { apiFetch } from '@/api/config';
import toast from 'react-hot-toast';

export const useRefereeManagementUI = (
  competition: Competition,
  onRefresh: () => void
) => {
  const { addReferee, removeReferee, loadingAction } = useCompetitionReferees(
    competition.id,
    onRefresh
  );

  const referees = useMemo(() => getCompetitionReferees(competition), [competition]);
  const isLastRef = referees.length <= 1;

  const [searchQuery, setSearchQuery] = useState('');
  const [rawSearchResults, setRawSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setRawSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiFetch(ROUTES.API_SEARCH_PLAYERS(searchQuery));
        if (res.ok) {
          const data = await res.json();
          setRawSearchResults(data);
        }
      } catch (error) {
        console.error('Erreur de recherche', error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    return rawSearchResults.filter(
      (p: any) => !referees.some((r: any) => String(r.id) === String(p.id))
    );
  }, [rawSearchResults, referees]);

  const handleAdd = async (player: Player) => {
    const success = await addReferee(player.id);
    if (success) {
      setSearchQuery('');
      setRawSearchResults([]);
      toast.success(`${player.display_name} est désormais arbitre.`);
    } else {
      toast.error(`Impossible de nommer ce joueur.`);
    }
  };

  const handleRemoveRequest = async (ref: any, isMe: boolean) => {
    const confirmMsg = isMe
      ? "Êtes-vous sûr de vouloir démissionner de l'arbitrage ?"
      : `Voulez-vous vraiment révoquer les droits de ${ref.name} ?`;

    if (window.confirm(confirmMsg)) {
      const success = await removeReferee(ref.id);
      if (success) {
        toast.success(isMe ? "Vous avez quitté l'arbitrage." : `${ref.name} révoqué.`);
      } else {
        toast.error("Échec de la révocation.");
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