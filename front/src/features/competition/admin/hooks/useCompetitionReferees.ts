import {
  competitionService,
  useInvalidateCompetition,
} from '@/features/competition';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ERRORS } from '@/shared';

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
    onError: () => {
      toast.error(ERRORS.COMPETITION.REFEREE_ADD_FAILED);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (playerId: string) =>
      competitionService.removeReferee(competitionId, playerId),
    onSuccess: () => {
      invalidateAll(competitionId, joinCode);
    },
    onError: () => {
      toast.error(ERRORS.COMPETITION.REFEREE_REMOVE_FAILED);
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
