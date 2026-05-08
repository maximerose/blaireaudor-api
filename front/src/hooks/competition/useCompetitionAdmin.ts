import { actionService } from '@/services/api/actionService';
import type {
  ActionStatus,
  ActionUpdatePayload,
  Competition,
  CompetitionUpdatePayload,
} from '@/types';
import { useInvalidateCompetition } from './useInvalidateCompetition';
import { useMutation } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competitionService';

export const useCompetitionAdmin = (competition: Competition) => {
  const { invalidateAll } = useInvalidateCompetition();

  const compMutation = useMutation({
    mutationFn: (data: CompetitionUpdatePayload) =>
      competitionService.update(competition.id!, data),
    onSuccess: () => {
      invalidateAll(competition.id, competition.join_code);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      actionId,
      status,
    }: {
      actionId: string;
      status: ActionStatus;
    }) => actionService.update(actionId, { status }),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
    },
    onError: (error) => {
      console.error('Erreur lors du changement de statut', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      actionId,
      data,
    }: {
      actionId: string;
      data: ActionUpdatePayload;
    }) => actionService.update(actionId, data),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
    },
  });

  return {
    updateCompetition: (data: CompetitionUpdatePayload) =>
      compMutation.mutate(data),
    handleActionStatus: (actionId: string, status: ActionStatus) =>
      statusMutation.mutate({ actionId, status }),

    handleUpdate: (actionId: string, data: ActionUpdatePayload) =>
      updateMutation.mutate({ actionId, data }),
    isUpdating: compMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    isUpdatingAction: updateMutation.isPending,
  };
};
