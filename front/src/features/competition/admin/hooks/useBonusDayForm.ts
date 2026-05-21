import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { getLocalDayString, sortByDate, ERRORS, RULES } from '@/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompetitionContext } from '@/features/competition/context';
import { useBonusDays } from './useBonusDays';
import { useBonusDayAdmin } from './useBonusDayAdmin';
import { useCompetitionDateLimits } from '@/features/competition/view';
import {
  getBonusDaySchema,
  type BonusDayFormData,
} from '@/features/competition/validations';
import type { BonusDay } from '@/features/competition/types';

export const useBonusDayForm = () => {
  const { competition, refresh } = useCompetitionContext();
  const { data: freshBonusDays } = useBonusDays(competition.id);
  const { addBonus, deleteBonus, isAdding } = useBonusDayAdmin(
    competition.id,
    refresh,
  );
  const { minDate, maxDate } = useCompetitionDateLimits(competition, false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<BonusDayFormData>({
    resolver: zodResolver(getBonusDaySchema(minDate, maxDate)),
    mode: 'onBlur',
    defaultValues: {
      newDate: '',
      multiplier: RULES.BONUS.MIN_MULTIPLIER,
    },
  });

  const sortedBonusDays = useMemo(
    () => sortByDate(freshBonusDays || [], 'date'),
    [freshBonusDays],
  );

  const onSubmit = (data: BonusDayFormData) => {
    const isDuplicate = (freshBonusDays || []).some(
      (bd: BonusDay) =>
        getLocalDayString(bd.date) === getLocalDayString(data.newDate),
    );

    if (isDuplicate) {
      toast.error(ERRORS.BONUS.DUPLICATE_DATE);
      return;
    }

    addBonus({ date: data.newDate, multiplier: data.multiplier });
    reset();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    deleteBonus,
    isAdding,
    bonusDays: sortedBonusDays,
    minDate,
    maxDate,
  };
};
