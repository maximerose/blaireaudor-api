import { useMemo } from 'react';
import {
  getDisplayDateText,
  getCompetitionStatus,
  canRevealScores,
  getIdFromData,
} from '@/utils';
import { useAuth } from '@/hooks';
import type {
  Competition,
  Participation,
  Player,
  PlayerCompact,
} from '@/types';

export const useCompetitionCard = (
  competition: Competition,
  participation?: Participation,
) => {
  const { user } = useAuth();

  const currentUserId = user?.id?.toString();
  const currentPlayerId = user?.player?.id?.toString();

  const isCreator = useMemo(() => {
    const creatorId = getIdFromData(competition.created_by);

    if (creatorId) return currentUserId === creatorId;

    return (
      user?.created_competitions?.some(
        (c: Competition) => c.id === competition.id,
      ) ?? false
    );
  }, [competition, currentUserId, user?.created_competitions]);

  const isReferee = useMemo(() => {
    const referees = competition.referees || [];
    const idToMatch = currentPlayerId || currentUserId;

    return referees.some(
      (ref: string | Player | PlayerCompact) =>
        getIdFromData(ref) === idToMatch,
    );
  }, [competition.referees, currentPlayerId, currentUserId]);

  const shouldReveal = canRevealScores(competition);
  const score = participation?.score;
  const rank = participation?.rank;
  const hasVisibleResults =
    shouldReveal && score !== undefined && rank !== undefined;

  return {
    isCreator,
    isReferee,
    isManager: isCreator || isReferee,
    isParticipant: !!participation,
    status: getCompetitionStatus(competition.start_date, competition.end_date),
    dateText: getDisplayDateText(competition.start_date, competition.end_date),
    shouldReveal,
    score,
    rank,
    hasNoParticipants: (competition.participants_count ?? 0) === 0,
    hasVisibleResults,
  };
};
