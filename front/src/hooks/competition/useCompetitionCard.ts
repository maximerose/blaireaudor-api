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
    const creatorData = competition.createdBy || competition.created_by;
    if (creatorData) {
      const creatorId = typeof creatorData === 'string' ? creatorData.split('/').pop() : creatorData.id;
      return String(user?.id) === String(creatorId);
    }

    if (user?.created_competitions) {
      return user.created_competitions.some((c: any) => c.id === competition.id);
    }

    return false;
  }, [competition, user]);

  const isReferee = useMemo(() => {
    const referees = competition.referees || [];
    const playerToMatch = user?.player?.id || user?.id;

    return referees.some((ref: any) => {
      const refId = typeof ref === 'string' ? ref.split('/').pop() : ref.id;
      return String(refId) === String(playerToMatch);
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
