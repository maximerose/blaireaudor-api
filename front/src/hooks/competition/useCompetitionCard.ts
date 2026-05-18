import { useMemo } from 'react';
import {
  getDisplayDateText,
  getCompetitionStatus,
  canRevealScores,
  getIdFromData,
} from '@/utils';
import type {
  Competition,
  Participation,
  Player,
  PlayerCompact,
} from '@/types';
import { useAuthContext } from '@/context';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { competitionService } from '@/services';

export const useCompetitionCard = (
  competition: Competition,
  participation?: Participation,
) => {
  const { user } = useAuthContext();

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

  const { data: pendingCount = 0 } = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competition.id).pendingCount,
    queryFn: ({ signal }) =>
      competitionService.getPendingCount(competition.id, signal),
    enabled: isReferee && !competition.is_finished,
  });

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
    pendingCount,
  };
};
