import { useMemo } from 'react';
import {
  getDisplayDateText,
  getCompetitionStatus,
  canRevealScores,
} from '@/utils';

export const useCompetitionCard = (
  competition: any,
  participation: any,
  user: any,
) => {
  const isCreator = useMemo(() => {
    const creatorId =
      typeof competition.created_by === 'string'
        ? competition.created_by.split('/').pop()
        : competition.created_by?.id;
    return user?.id === creatorId;
  }, [competition, user]);

  const isReferee = useMemo(() => {
    return competition.referees?.some((ref: any) => {
      const refId = typeof ref === 'string' ? ref.split('/').pop() : ref.id;
      return refId === user?.player?.id;
    });
  }, [competition, user]);

  const status = getCompetitionStatus(
    competition.start_date,
    competition.end_date,
  );
  const dateText = getDisplayDateText(
    competition.start_date,
    competition.end_date,
  );
  const shouldReveal = canRevealScores(competition);

  return {
    isCreator,
    isReferee,
    isManager: isCreator || isReferee,
    isParticipant: !!participation,
    status,
    dateText,
    shouldReveal,
    score: participation?.score,
    rank: participation?.rank,
    hasNoParticipants: competition.participants_count === 0,
  };
};
