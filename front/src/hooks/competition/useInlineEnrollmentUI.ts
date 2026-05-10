import { useMemo, useState } from 'react';
import { useCompetition, useEnrollment, usePermissions } from '@/hooks';
import type {
  FormParticipant,
  Participation,
  Player,
  PlayerCompact,
} from '@/types';

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

export const useInlineEnrollmentUI = () => {
  const { competition, refresh } = useCompetition();
  const { roles } = usePermissions();

  const [isOpen, setIsOpen] = useState(false);

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
      refresh();
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
    isOwner: roles.isCreator,
    newPlayers,
    canCreatePlayer,
    ...enrollment,
  };
};
