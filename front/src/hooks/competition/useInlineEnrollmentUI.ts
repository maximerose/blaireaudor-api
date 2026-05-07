import { useMemo, useState } from 'react';
import { useAuth, useCompetition, useEnrollment } from '@/hooks';
import type {
  FormParticipant,
  Participation,
  Player,
  PlayerCompact,
} from '@/types';
import { isCompetitionCreator } from '@/utils';

const getNewPlayers = (
  participants: FormParticipant[],
  existingPlayers: FormParticipant[] = [],
) => {
  return participants.filter(
    (p) => !existingPlayers.some((cp: PlayerCompact) => cp.id === p.id),
  );
};

const checkCanCreatePlayer = (searchTerm: string, searchResults: Player[]) => {
  if (searchTerm.trim().length < 2) return false;
  const term = searchTerm.toLowerCase();

  const hasExactMatch = searchResults.some(
    (p) => p.display_name.toLowerCase() === term,
  );

  return !hasExactMatch;
};

export const useInlineEnrollmentUI = (onRefresh: () => void) => {
  const { user } = useAuth();
  const { competition } = useCompetition();
  const [isOpen, setIsOpen] = useState(false);

  const isOwner = isCompetitionCreator(competition, user);

  const existingPlayers: FormParticipant[] = useMemo(() => {
    return (
      competition?.participations?.map((p: Participation) => ({
        ...p.player,
        isNew: false as const,
      })) || []
    );
  }, [competition?.participations]);

  const enrollment = useEnrollment(
    competition?.id || '',
    existingPlayers,
    () => {
      setIsOpen(false);
      onRefresh();
    },
  );

  const newPlayers = getNewPlayers(enrollment.participants, existingPlayers);

  const canCreatePlayer = checkCanCreatePlayer(
    enrollment.searchTerm,
    enrollment.searchResults,
  );

  return {
    isOpen,
    setIsOpen,
    isOwner,
    newPlayers,
    canCreatePlayer,
    ...enrollment,
  };
};
