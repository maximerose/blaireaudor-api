import { competitionService } from '@/services/api/competitionService';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useInvalidateCompetition } from './useInvalidateCompetition';

export const useCompetitionReferees = (
  competitionId: string,
  joinCode: string,
) => {
  const { invalidateAll } = useInvalidateCompetition();

  const addMutation = useMutation({
    mutationFn: (playerId: string) =>
      competitionService.addReferee(competitionId, playerId),
    onSuccess: () => {
      invalidateAll(competitionId, joinCode);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (playerId: string) =>
      competitionService.removeReferee(competitionId, playerId),
    onSuccess: () => {
      invalidateAll(competitionId, joinCode);
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
