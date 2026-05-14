import type {
  ActionStatus,
  ActionUpdatePayload,
  CompetitionUpdatePayload,
} from '@/types';
import { useMutation } from '@tanstack/react-query';
import { actionService, competitionService } from '@/services';
import { LOG_MESSAGES } from '@/constants';
import { useCompetitionContext } from '@/context';
import { useInvalidateCompetition } from '@/hooks';

export const useCompetitionAdmin = () => {
  const { competition } = useCompetitionContext();
  const { invalidateAll } = useInvalidateCompetition();

  const compMutation = useMutation({
    mutationFn: (data: CompetitionUpdatePayload) =>
      competitionService.update(competition.id!, data),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
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
      console.error(LOG_MESSAGES.ACTION.STATUS_UPDATE_FAILED, error);
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
      updateMutation.mutateAsync({ actionId, data }),
    isUpdating: compMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    isUpdatingAction: updateMutation.isPending,
  };
};
