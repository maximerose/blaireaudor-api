import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ERRORS, QUERY_KEYS, SUCCESS, type ApiError } from '@/shared';
import type { BonusDay } from '@/features/competition/types';
import { bonusDayService } from '@/features/competition/services';

export const useBonusDayAdmin = (
  competitionId: string,
  onRefresh?: () => void,
) => {
  const queryClient = useQueryClient();

  const invalidateCompetition = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byId(competitionId).root,
    });

    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.all,
    });

    onRefresh?.();
  };

  const addMutation = useMutation<
    BonusDay,
    ApiError,
    { date: string; multiplier: number }
  >({
    mutationFn: ({ date, multiplier }) =>
      bonusDayService.create(competitionId, date, multiplier),
    onSuccess: () => {
      invalidateCompetition();
      toast.success(SUCCESS.BONUS.ADDED);
    },
    onError: (apiError: ApiError) =>
      toast.error(apiError.message || ERRORS.BONUS.CREATE_FAILED),
  });

  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: (bonusDayId: string) => bonusDayService.delete(bonusDayId),
    onSuccess: () => {
      invalidateCompetition();
      toast.success(SUCCESS.BONUS.DELETED);
    },
    onError: (apiError: ApiError) =>
      toast.error(apiError.message || ERRORS.BONUS.DELETE_FAILED),
  });

  return {
    addBonus: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteBonus: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
