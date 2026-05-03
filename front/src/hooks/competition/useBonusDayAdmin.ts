import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bonusDayService } from '@/services/api/bonusDay';
import { toast } from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants';

export const useBonusDayAdmin = (competitionId: string) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: ({ date, multiplier }: { date: string; multiplier: number }) =>
      bonusDayService.create(competitionId, date, multiplier),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.competition.byId(competitionId).bonus,
      });
      toast.success('Jour multiplicateur ajouté !');
    },
    onError: () => toast.error("Erreur (Vérifiez les dates de l'arène)"),
  });

  const deleteMutation = useMutation({
    mutationFn: (bonusDayId: string) => bonusDayService.delete(bonusDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.competition.byId(competitionId).bonus,
      });
      toast.success('Bonus supprimé');
    },
  });

  return {
    addBonus: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteBonus: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
