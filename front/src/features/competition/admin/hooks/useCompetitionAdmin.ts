import { useMutation } from '@tanstack/react-query';
import { ERRORS, LOG_MESSAGES, type ApiError } from '@/shared';
import toast from 'react-hot-toast';
import { useCompetitionContext } from '@/features/competition/context';
import { useInvalidateCompetition } from '@/features/competition/view';
import type {
  Action,
  ActionStatus,
  ActionUpdatePayload,
  ActionUpdateStatusPayload,
  Competition,
  CompetitionUpdatePayload,
} from '@/features/competition/types';
import {
  actionService,
  competitionService,
} from '@/features/competition/services';

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
