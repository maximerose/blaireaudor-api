import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ROUTES,
  ERRORS,
  QUERY_KEYS,
  SUCCESS,
  type ApiError,
  handleApiError,
} from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/features/account/context/AuthContext';
import {
  usePlayerSearch,
  type FormParticipant,
  type PlayerCompact,
} from '@/features/player';

export const useEnrollment = (
  competitionId: string,
  initialParticipants: FormParticipant[],
  onSuccess?: () => void | Promise<void>,
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuthContext();

  const [participants, setParticipants] =
    useState<FormParticipant[]>(initialParticipants);

  useEffect(() => {
    setParticipants((prev) =>
      prev.filter(
        (p) => p.isNew || initialParticipants.some((ip) => ip.id === p.id),
      ),
    );
  }, [initialParticipants]);

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

  const enrollmentMutation = useMutation<unknown, ApiError, void>({
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
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.competition.all,
      });
      await refreshUser();

      if (onSuccess) {
        await onSuccess();
      } else {
        navigate(ROUTES.NAV.DASHBOARD);
      }

      toast.success(SUCCESS.COMPETITION.PARTICIPANTS_UPDATED);
    },
    onError: (e) =>
      handleApiError(e, undefined, ERRORS.COMPETITION.PARTICIPATION_ADD_FAILED),
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
