import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/account';
import { competitionService } from '@/features/competition/services';
import { ROUTES, ERRORS } from '@/shared';
import toast from 'react-hot-toast';

export const useQRJoin = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) {
      navigate(ROUTES.NAV.DASHBOARD, { replace: true });
      return;
    }

    if (!user) {
      navigate(`${ROUTES.NAV.LOGIN}?code=${code}`, { replace: true });
      return;
    }

    const autoJoin = async () => {
      try {
        await competitionService.join(code);
        navigate(ROUTES.NAV.COMPETITION_DETAIL(code), { replace: true });
      } catch (e: any) {
        toast.error(e?.message || ERRORS.COMPETITION.NOT_FOUND(code));
        navigate(ROUTES.NAV.DASHBOARD, { replace: true });
      }
    };

    autoJoin();
  }, [code, user, navigate]);
};
