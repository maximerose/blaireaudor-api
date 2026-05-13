import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bonusDayService } from '@/services/api/bonusDayService';
import { toast } from 'react-hot-toast';
import { ERRORS, QUERY_KEYS, SUCCESS } from '@/constants';

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

  const addMutation = useMutation({
    mutationFn: ({ date, multiplier }: { date: string; multiplier: number }) =>
      bonusDayService.create(competitionId, date, multiplier),
    onSuccess: () => {
      invalidateCompetition();
      toast.success(SUCCESS.BONUS.ADDED);
    },
    onError: () => toast.error(ERRORS.BONUS.CREATE_FAILED),
  });

  const deleteMutation = useMutation({
    mutationFn: (bonusDayId: string) => bonusDayService.delete(bonusDayId),
    onSuccess: () => {
      invalidateCompetition();
      toast.success(SUCCESS.BONUS.DELETED);
    },
  });

  return {
    addBonus: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteBonus: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
