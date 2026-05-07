import { competitionService } from '@/services/api/competitionService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import toast from 'react-hot-toast';

export const useCompetitionReferees = (
  competitionId: string,
  joinCode: string,
) => {
  const queryClient = useQueryClient();

  const invalidateQueries = (competitionId: string, joinCode: string) => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byCode(joinCode),
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byId(competitionId).root,
    });
  };

  const addMutation = useMutation({
    mutationFn: (playerId: string) =>
      competitionService.addReferee(competitionId, playerId),
    onSuccess: () => {
      invalidateQueries(competitionId, joinCode);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (playerId: string) =>
      competitionService.removeReferee(competitionId, playerId),
    onSuccess: () => {
      invalidateQueries(competitionId, joinCode);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    addReferee: addMutation.mutateAsync,
    removeReferee: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    loadingAction: addMutation.isPending
      ? `add-${addMutation.variables}`
      : removeMutation.isPending
        ? `remove-${removeMutation.variables}`
        : null,
  };
};
