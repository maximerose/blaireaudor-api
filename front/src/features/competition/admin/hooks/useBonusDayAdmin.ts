import { bonusDayService } from '@/features/competition/services';
import type { BonusDay } from '@/features/competition/types';
import {
  ERRORS,
  handleApiError,
  QUERY_KEYS,
  SUCCESS,
  type ApiError,
} from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

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

    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byId(competitionId).bonus,
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
    onError: (e) => handleApiError(e, undefined, ERRORS.BONUS.CREATE_FAILED),
  });

  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: (bonusDayId: string) => bonusDayService.delete(bonusDayId),
    onSuccess: () => {
      invalidateCompetition();
      toast.success(SUCCESS.BONUS.DELETED);
    },
    onError: (e) => handleApiError(e, undefined, ERRORS.BONUS.DELETE_FAILED),
  });

  return {
    addBonus: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteBonus: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
