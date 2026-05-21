import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared';
import type { Competition } from '@/features/competition/types';

export const useCreateCompetitionPageUI = () => {
  const navigate = useNavigate();

  const handleSuccess = (competition: Competition) => {
    navigate(ROUTES.NAV.COMPETITION_DETAIL(competition.join_code));
  };

  return { handleSuccess };
};
