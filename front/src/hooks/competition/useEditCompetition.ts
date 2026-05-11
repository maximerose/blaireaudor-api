import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ROUTES, QUERY_KEYS, ERRORS } from '@/constants';
import { formatToApiISO, parseFromApiISO } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competitionService';
import type { Competition, CompetitionUpdatePayload } from '@/types';
import { useCompetitionForm } from './useCompetitionForm';

export const useEditCompetition = (
  competition: Competition,
  onRefresh?: () => void,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const start = parseFromApiISO(competition.start_date);
  const end = parseFromApiISO(competition.end_date);

  const { formData, updateField } = useCompetitionForm({
    name: competition.name,
    joinCode: competition.join_code,
    startDate: start.date,
    startTime: start.time,
    startFullDay: start.time === '00:00',
    endDate: end.date,
    endTime: end.time,
    endFullDay: end.time === '23:59' || end.time === '00:00',
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: CompetitionUpdatePayload = {
        name: formData.name,
        join_code: formData.joinCode,
        end_date: formatToApiISO(
          formData.endDate,
          formData.endTime,
          formData.endFullDay,
          true,
        ) as string,
      };

      if (!competition.has_started) {
        payload.start_date = formatToApiISO(
          formData.startDate,
          formData.startTime,
          formData.startFullDay,
          false,
        );
      }

      return competitionService.update(competition.id, payload);
    },
    onSuccess: () => {
      toast.success('Configuration mise à jour !');
      setIsEditing(false);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competition.all });
      onRefresh?.();

      if (formData.joinCode && formData.joinCode !== competition.join_code) {
        navigate(ROUTES.NAV.COMPETITION_DETAIL(formData.joinCode), {
          replace: true,
        });
      }
    },
    onError: () => {
      toast.error(ERRORS.COMPETITION.UPDATE_FAILED);
    },
  });

  return {
    isEditing,
    setIsEditing,
    formData,
    updateField,
    handleSave: mutation.mutate,
    loading: mutation.isPending,
  };
};
