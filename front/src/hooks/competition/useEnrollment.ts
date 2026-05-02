import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/services/api/config';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks';
import { usePlayerSearch } from './usePlayerSearch';

export const useEnrollment = (
  competitionId: string,
  initialParticipants: any[],
  onSuccess?: () => void,
) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [participants, setParticipants] = useState(initialParticipants);
  const [loading, setLoading] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    results: rawSearchResults,
    searching: isSearching,
  } = usePlayerSearch();

  const searchResults = useMemo(() => {
    return rawSearchResults.filter(
      (result: any) =>
        !participants.some((p) => String(p.id) === String(result.id)),
    );
  }, [rawSearchResults, participants]);

  const addExistingPlayer = (player: any) => {
    if (!participants.find((p) => String(p.id) === String(player.id))) {
      setParticipants([
        ...participants,
        {
          id: player.id,
          display_name: player.display_name || player.displayName,
          isNew: false,
        },
      ]);
    }
    setSearchTerm('');
  };

  const addNewPlayer = (name: string) => {
    const tempId = `temp-${Date.now()}`;
    setParticipants([
      ...participants,
      { id: tempId, display_name: name, isNew: true },
    ]);
    setSearchTerm('');
  };

  const removePlayer = (playerId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== playerId));
  };

  const saveEnrollment = async () => {
    setLoading(true);

    const existingIds = participants.filter((p) => !p.isNew).map((p) => p.id);
    const newNames = participants
      .filter((p) => p.isNew)
      .map((p) => p.display_name);

    try {
      const response = await apiFetch(
        ROUTES.API_ADD_PLAYERS_TO_COMP(competitionId),
        {
          method: 'POST',
          body: JSON.stringify({
            existing_players_ids: existingIds,
            new_players: newNames,
          }),
        },
      );

      if (response.ok) {
        await refreshUser();
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(ROUTES.NAV_DASHBOARD);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur technique', error);
      alert('Impossible de joindre le serveur');
    } finally {
      setLoading(false);
    }
  };

  return {
    participants,
    searchResults,
    searchTerm,
    setSearchTerm,
    addExistingPlayer,
    addNewPlayer,
    removePlayer,
    saveEnrollment,
    loading,
    isSearching,
  };
};
