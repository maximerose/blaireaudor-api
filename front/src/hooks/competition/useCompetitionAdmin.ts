import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { actionService } from '@/services/api/action';
import { competitionService } from '@/services/api/competition';
import type {
  Action,
  ActionStatus,
  ActionUpdatePayload,
  UpdateCompetitionPayload,
} from '@/types';

export const useCompetitionAdmin = (
  competitionId: string | undefined,
  refresh: () => void,
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateAction = async (actionId: string, data: ActionUpdatePayload) => {
    const { ok } = await actionService.update(actionId, data);

    if (ok) {
      toast.success('Action mise à jour.');
      refresh();
      return true;
    } else {
      toast.error('Erreur lors de la modification.');
      return false;
    }
  };

  const handleActionStatus = (actionId: string, status: ActionStatus) =>
    updateAction(actionId, { status });

  const handleUpdate = async (action: Action) => {
    const payload: ActionUpdatePayload = {
      description: action.description,
      points: action.points,
      date_action: action.date_action,
      status: action.status,
    };
    return await updateAction(action.id, payload);
  };

  const updateCompetition = async (data: UpdateCompetitionPayload) => {
    if (!competitionId) return;

    setIsUpdating(true);
    const { ok } = await competitionService.update(competitionId, data);

    if (ok) {
      toast.success('Compétition mise à jour.');
      refresh();
    } else {
      toast.error('Échec de la mise à jour.');
    }
    setIsUpdating(false);
  };

  return {
    handleActionStatus,
    updateAction,
    handleUpdate,
    updateCompetition,
    isUpdating,
  };
};
