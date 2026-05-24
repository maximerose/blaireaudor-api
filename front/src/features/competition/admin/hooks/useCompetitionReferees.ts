import { useMutation } from '@tanstack/react-query';
import { ERRORS, type ApiError } from '@/shared';
import { useInvalidateCompetition } from '@/features/competition/view';
import { competitionService } from '@/features/competition/services';
import { handleApiError } from '@/shared/utils/errorHandler';

export const useCompetitionReferees = (
  competitionId: string,
  joinCode: string,
) => {
  const { invalidateAll } = useInvalidateCompetition();

  const addMutation = useMutation<any, ApiError, string>({
    mutationFn: (playerId: string) =>
      competitionService.addReferee(competitionId, playerId),
    onSuccess: () => {
      invalidateAll(competitionId, joinCode);
    },
    onError: (e) =>
      handleApiError(e, undefined, ERRORS.COMPETITION.REFEREE_ADD_FAILED),
  });

  const removeMutation = useMutation({
    mutationFn: (playerId: string) =>
      competitionService.removeReferee(competitionId, playerId),
    onSuccess: () => {
      return invalidateAll(competitionId, joinCode);
    },
    onError: (e) =>
      handleApiError(e, undefined, ERRORS.COMPETITION.REFEREE_REMOVE_FAILED),
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
