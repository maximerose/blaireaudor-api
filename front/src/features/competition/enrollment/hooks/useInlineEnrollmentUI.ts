import { useMemo, useState } from 'react';

import type { FormParticipant, Player, PlayerCompact } from '@/features/player';
import { useCompetitionContext } from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import type { Participation } from '@/features/competition/types';
import { useEnrollment } from './useEnrollment';

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
  const { competition, refresh } = useCompetitionContext();
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
