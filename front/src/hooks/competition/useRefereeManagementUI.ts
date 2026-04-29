import { useState, useEffect, useMemo } from 'react';
import { getCompetitionReferees } from '@/utils';
import { useCompetitionReferees } from './useCompetitionReferees';
import type { Competition, Player } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { apiFetch } from '@/api/config';

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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 2000);
  };

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
  }, [searchQuery, referees]);

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
      showFeedback('success', `${player.display_name} a été nommé arbitre.`);
    } else {
      showFeedback('error', `Impossible de nommer ce joueur.`);
    }
  };

  const handleRemoveRequest = async (ref: any, isMe: boolean) => {
    const confirmMsg = isMe
      ? "Êtes-vous sûr de vouloir démissionner de l'arbitrage ?"
      : `Voulez-vous vraiment révoquer les droits de ${ref.name} ?`;

    if (window.confirm(confirmMsg)) {
      const success = await removeReferee(ref.id);
      if (success) {
        showFeedback('success', isMe ? "Vous avez quitté l'arbitrage." : `${ref.name} a été révoqué.`);
      } else {
        showFeedback('error', "Une erreur est survenue lors de la révocation.");
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
    feedback,
  };
};