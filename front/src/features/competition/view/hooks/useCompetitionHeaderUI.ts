import { useState, useMemo } from 'react';
import { useAuthContext } from '@/features/account';
import { useCompetitionContext } from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import {
  getCompetitionReferees,
  getDisplayDateText,
  resolveCreatorName,
} from '@/features/competition/utils';

export const useCompetitionHeaderUI = () => {
  const { user } = useAuthContext();
  const { competition, leaderboard, bonusDays } = useCompetitionContext();
  const { roles } = usePermissions();

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const referees = useMemo(
    () => getCompetitionReferees(competition),
    [competition],
  );

  const creatorName = useMemo(
    () => resolveCreatorName(competition, leaderboard, user),
    [competition, leaderboard, user],
  );

  const dateText = getDisplayDateText(
    competition.start_date,
    competition.end_date,
  );

  return {
    competition,
    bonusDays,
    roles,
    user,
    referees,
    creatorName,
    dateText,
    isQRModalOpen,
    openQRModal: () => setIsQRModalOpen(true),
    closeQRModal: () => setIsQRModalOpen(false),
  };
};
