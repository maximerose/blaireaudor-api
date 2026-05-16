import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ROUTES, ERRORS, SUCCESS } from '@/constants';
import { combineDateTime, getDatePart, getTimePart } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { competitionService } from '@/services';
import type { Competition, CompetitionUpdatePayload } from '@/types';
import { useInvalidateCompetition } from '@/hooks';
import { useForm } from 'react-hook-form';
import {
  editCompetitionSchema,
  type EditCompetitionFormData,
} from '@/validations';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditCompetition = (
  competition: Competition,
  refresh: () => void,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { invalidateAll } = useInvalidateCompetition();

  const hasSpecificStartTime = competition.start_date
    ? !competition.start_date.includes('T00:00:00')
    : false;
  const hasSpecificEndTime = competition.end_date
    ? !competition.end_date.includes('T00:00:00')
    : false;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<EditCompetitionFormData>({
    resolver: zodResolver(editCompetitionSchema),
    mode: 'onChange',
    defaultValues: {
      name: competition.name || '',
      joinCode: competition.join_code || '',
      startDate: getDatePart(competition.start_date),
      startTime: getTimePart(competition.start_date) || null,
      startFullDay: !hasSpecificStartTime,
      endDate: getDatePart(competition.end_date) || '',
      endTime: getTimePart(competition.end_date) || null,
      endFullDay: !hasSpecificEndTime,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CompetitionUpdatePayload) =>
      competitionService.update(competition.id, payload),
    onSuccess: async (_, variables) => {
      toast.success(SUCCESS.COMPETITION.UPDATED);
      setIsEditing(false);

      await invalidateAll(competition.id, competition.join_code);

      refresh();

      if (
        variables.join_code &&
        variables.join_code !== competition.join_code
      ) {
        navigate(ROUTES.NAV.COMPETITION_DETAIL(variables.join_code), {
          replace: true,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || ERRORS.COMPETITION.UPDATE_FAILED);
    },
  });

  const onSubmit = async (data: EditCompetitionFormData) => {
    const finalStartDate = competition.has_started
      ? competition.start_date
      : combineDateTime(data.startDate, data.startTime, data.startFullDay);

    const payload: CompetitionUpdatePayload = {
      name: data.name,
      join_code: data.joinCode,
      start_date: finalStartDate,
      end_date: data.endDate
        ? combineDateTime(data.endDate, data.endTime, data.endFullDay)
        : null,
    };
    await updateMutation.mutateAsync(payload);
  };

  return {
    isEditing,
    setIsEditing,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    loading: updateMutation.isPending || isSubmitting,
    watch,
    setValue,
  };
};
