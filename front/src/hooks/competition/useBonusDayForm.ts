import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useBonusDayAdmin } from './useAdminBonusDay';
import { useCompetition } from '@/context/CompetitionContext';
import { useCompetitionDateLimits } from './useCompetitionDateLimits';

export const useBonusDayForm = () => {
  const { competition, bonusDays } = useCompetition();
  const { addBonus, deleteBonus, isAdding } = useBonusDayAdmin(competition.id);
  const { minDate, maxDate } = useCompetitionDateLimits(competition, false);

  const [newDate, setNewDate] = useState('');
  const [multiplier, setMultiplier] = useState(2);

  const handleAdd = () => {
    if (!newDate) return;

    const isDuplicate = bonusDays?.some(
      (bd) => bd.date.split('T')[0] === newDate
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
    bonusDays,
    minDate,
    maxDate
  };
};