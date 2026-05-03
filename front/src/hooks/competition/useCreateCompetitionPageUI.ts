import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const useCreateCompetitionPageUI = () => {
  const navigate = useNavigate();

  const handleSuccess = (competition: any) => {
    navigate(ROUTES.NAV.COMPETITION_DETAIL(competition.join_code));
  };

  return { handleSuccess };
};
