import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api/config';
import { ROUTES } from '@/constants/routes';
import { toast } from 'react-hot-toast';

export const useBonusDayAdmin = (competitionId: string) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (payload: { date: string; multiplier: number }) => {
      const response = await apiFetch(ROUTES.API_BONUS_DAYS, {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          competition: ROUTES.IRI_COMPETITION(competitionId),
        }),
      });
      if (!response.ok) throw new Error();
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusDays', competitionId] });
      toast.success('Jour multiplicateur ajouté !');
    },
    onError: () => toast.error("Erreur (Vérifiez les dates de l'arène)"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (bonusDayId: string) => {
      await apiFetch(ROUTES.API_BONUS_DAYS_DETAIL(bonusDayId), {
        method: 'DELETE',
      });
    },
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
