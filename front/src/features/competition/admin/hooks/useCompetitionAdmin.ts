import { useMutation } from '@tanstack/react-query';
import { ERRORS, SUCCESS, type ApiError, handleApiError } from '@/shared';
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
      toast.success(SUCCESS.COMPETITION.UPDATED);
    },
    onError: (e) =>
      handleApiError(e, undefined, ERRORS.COMPETITION.UPDATE_FAILED),
  });

  const statusMutation = useMutation<
    Action,
    ApiError,
    ActionUpdateStatusPayload
  >({
    mutationFn: ({ actionId, status }) =>
      actionService.update(actionId, { status }),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
      toast.success(SUCCESS.ACTION.STATUS_UPDATED);
    },
    onError: (e) =>
      handleApiError(e, undefined, ERRORS.ACTION.STATUS_UPDATE_FAILED),
  });

  const updateMutation = useMutation<
    Action,
    ApiError,
    { actionId: string; data: ActionUpdatePayload }
  >({
    mutationFn: ({ actionId, data }) => actionService.update(actionId, data),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
      toast.success(SUCCESS.ACTION.UPDATED);
    },
    onError: (e) => handleApiError(e, undefined, ERRORS.ACTION.UPDATE_FAILED),
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
