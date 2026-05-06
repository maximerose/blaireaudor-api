import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  useBonusDayAdmin,
  useBonusDays,
  useCompetition,
  useCompetitionDateLimits,
} from '@/hooks';
import type { BonusDay } from '@/types';
import { sortByDate } from '@/utils';

export const useBonusDayForm = () => {
  const { competition, refresh } = useCompetition();
  const { data: freshBonusDays } = useBonusDays(competition.id);
  const { addBonus, deleteBonus, isAdding } = useBonusDayAdmin(
    competition.id,
    refresh,
  );
  const { minDate, maxDate } = useCompetitionDateLimits(competition, false);

  const [newDate, setNewDate] = useState('');
  const [multiplier, setMultiplier] = useState(2);

  const sortedBonusDays = useMemo(
    () => sortByDate(freshBonusDays || [], 'date'),
    [freshBonusDays],
  );

  const handleAdd = () => {
    if (!newDate) return;

    const isDuplicate = (freshBonusDays || []).some(
      (bd: BonusDay) => bd.date.split('T')[0] === newDate,
    );

    if (isDuplicate) {
      return toast.error('Un bonus existe déjà pour cette date');
    }

    addBonus({ date: newDate, multiplier });
    setNewDate('');
  };

  return {
    newDate,
    setNewDate,
    multiplier,
    setMultiplier,
    handleAdd,
    deleteBonus,
    isAdding,
    bonusDays: sortedBonusDays,
    minDate,
    maxDate,
  };
};
