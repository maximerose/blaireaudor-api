import { useMemo } from 'react';
import type { CompetitionFormData, FormParticipant } from '@/types';

export const useRefereeStepLogic = (formData: CompetitionFormData) => {
  const players = formData.players ?? [];
  const referees = formData.referees ?? [];

  const externalReferees = useMemo(() => {
    return referees.filter(
      (ref: FormParticipant) =>
        !players.some((p: FormParticipant) => p.id === ref.id),
    );
  }, [referees, players]);

  const hasNoReferee = !formData.isCreatorReferee && referees.length === 0;

  return {
    players,
    referees,
    externalReferees,
    hasNoReferee,
  };
};
