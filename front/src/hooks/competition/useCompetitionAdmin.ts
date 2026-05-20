import type {
  Action,
  ActionStatus,
  ActionUpdatePayload,
  ActionUpdateStatusPayload,
  ApiError,
  Competition,
  CompetitionUpdatePayload,
} from '@/types';
import { useMutation } from '@tanstack/react-query';
import { actionService, competitionService } from '@/services';
import { ERRORS, LOG_MESSAGES } from '@/constants';
import { useCompetitionContext } from '@/context';
import { useInvalidateCompetition } from '@/hooks';
import toast from 'react-hot-toast';

export const useCompetitionAdmin = () => {
  const { competition } = useCompetitionContext();
  const { invalidateAll } = useInvalidateCompetition();

  const compMutation = useMutation<
    Competition,
    ApiError,
    CompetitionUpdatePayload
  >({
    mutationFn: (data: CompetitionUpdatePayload) =>
      competitionService.update(competition.id!, data),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
    },
    onError: (apiError) =>
      toast.error(apiError.message || ERRORS.COMPETITION.UPDATE_FAILED),
  });

  const statusMutation = useMutation<
    { ok: boolean; data: Action },
    ApiError,
    ActionUpdateStatusPayload
  >({
    mutationFn: ({ actionId, status }) =>
      actionService.update(actionId, { status }),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
    },
    onError: (apiError) => {
      console.error(LOG_MESSAGES.ACTION.STATUS_UPDATE_FAILED, apiError);
      toast.error(apiError.message || ERRORS.ACTION.STATUS_UPDATE_FAILED);
    },
  });

  const updateMutation = useMutation<
    { ok: boolean; data: Action },
    ApiError,
    { actionId: string; data: ActionUpdatePayload }
  >({
    mutationFn: ({ actionId, data }) => actionService.update(actionId, data),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
    },
    onError: (apiError) =>
      toast.error(apiError.message || ERRORS.ACTION.UPDATE_FAILED),
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
