import { useState } from 'react';
import { apiFetch } from '@/services/api/config';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';

export const useCompetitionAdmin = (
  competitionId: string | undefined,
  refresh: () => void,
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateAction = async (actionId: string, data: any) => {
    try {
      const response = await apiFetch(ROUTES.API_ACTIONS_DETAIL(actionId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/merge-patch+json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      toast.success('Action mise à jour.');
      refresh();
      return true;
    } catch {
      toast.error('Erreur lors de la modification : ');
      return false;
    }
  };

  const handleActionStatus = (
    actionId: string,
    status: 'validated' | 'rejected',
  ) => updateAction(actionId, { status });

  const updateCompetition = async (data: any) => {
    if (!competitionId) return;

    setIsUpdating(true);
    try {
      const response = await apiFetch(
        ROUTES.API_COMPETITION_DETAIL(competitionId),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) throw new Error();

      toast.success('Compétition mise à jour.');
      refresh();
    } catch {
      toast.error('Échec de la mise à jour.');
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleActionStatus, updateAction, updateCompetition, isUpdating };
};
