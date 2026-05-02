import { useState } from 'react';
import { useAuth, useEnrollment } from '@/hooks';
import type { Player } from '@/context/AuthContext';

const checkIsOwner = (user: any, competition: any) => {
  if (!user || !competition) return false;
  return (
    user.id === competition.created_by?.id || user.id === competition.created_by
  );
};

const getNewPlayers = (
  participants: Player[],
  existingPlayers: Player[] = [],
) => {
  return participants.filter(
    (p) => !existingPlayers.find((cp: Player) => cp.id === p.id),
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

export const useInlineEnrollmentUI = (
  competition: any,
  onRefresh: () => void,
) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isOwner = checkIsOwner(user, competition);

  const enrollment = useEnrollment(
    competition.id,
    competition.players || [],
    () => {
      setIsOpen(false);
      onRefresh();
    },
  );

  const newPlayers = getNewPlayers(
    enrollment.participants,
    competition.players,
  );
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
