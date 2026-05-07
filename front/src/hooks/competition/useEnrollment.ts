import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth, usePlayerSearch } from '@/hooks';
import { ERRORS, QUERY_KEYS } from '@/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FormParticipant, PlayerCompact } from '@/types';
import { competitionService } from '@/services/api/competition';
import toast from 'react-hot-toast';

export const useEnrollment = (
  competitionId: string,
  initialParticipants: FormParticipant[],
  onSuccess?: () => void,
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const [participants, setParticipants] =
    useState<FormParticipant[]>(initialParticipants);

  const {
    searchTerm,
    setSearchTerm,
    results: rawSearchResults,
    searching: isSearching,
  } = usePlayerSearch();

  const searchResults = useMemo(() => {
    return rawSearchResults.filter(
      (result: PlayerCompact) =>
        !participants.some((p) => String(p.id) === String(result.id)),
    );
  }, [rawSearchResults, participants]);

  const addExistingPlayer = (player: PlayerCompact) => {
    if (!participants.find((p) => String(p.id) === String(player.id))) {
      setParticipants([
        ...participants,
        {
          ...player,
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

  const enrollmentMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        existing_players_ids: participants
          .filter((p) => !p.isNew)
          .map((p) => p.id),
        new_players: participants
          .filter((p) => p.isNew)
          .map((p) => p.display_name),
      };

      return competitionService.addParticipation(competitionId, payload);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competition.all });

      await refreshUser();

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(ROUTES.NAV.DASHBOARD);
      }

      toast.success('Liste des participants mise à jour !');
    },
    onError: (error: any) => {
      toast.error(error.message || ERRORS.COMPETITION.PARTICIPATION_ADD_FAILED);
    },
  });

  return {
    participants,
    searchResults,
    searchTerm,
    setSearchTerm,
    addExistingPlayer,
    addNewPlayer,
    removePlayer,
    saveEnrollment: enrollmentMutation.mutate,
    loading: enrollmentMutation.isPending,
    isSearching,
  };
};
