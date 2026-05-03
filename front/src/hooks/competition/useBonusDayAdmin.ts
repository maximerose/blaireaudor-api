import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bonusDayService } from '@/services/api/bonusDay';
import { toast } from 'react-hot-toast';

export const useBonusDayAdmin = (competitionId: string) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: ({ date, multiplier }: { date: string; multiplier: number }) =>
      bonusDayService.create(competitionId, date, multiplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusDays', competitionId] });
      toast.success('Jour multiplicateur ajouté !');
    },
    onError: () => toast.error("Erreur (Vérifiez les dates de l'arène)"),
  });

  const deleteMutation = useMutation({
    mutationFn: (bonusDayId: string) => bonusDayService.delete(bonusDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusDays', competitionId] });
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
