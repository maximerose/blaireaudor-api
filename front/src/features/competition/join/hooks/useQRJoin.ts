// front/src/features/competition/join/hooks/useQRJoin.ts

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/account';
import { competitionService } from '@/features/competition/services';
import { ROUTES, ERRORS } from '@/shared';
import toast from 'react-hot-toast';
import { handleApiError } from '@/shared/utils/errorHandler';

export const useQRJoin = () => {
  const { code } = useParams<{ code: string }>();
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!code) {
      navigate(ROUTES.NAV.DASHBOARD, { replace: true });
      return;
    }

    const processQR = async () => {
      try {
        // 1. On vérifie l'état de la compétition en base
        const data = await competitionService.getByCode(code);

        if (data.competition.is_finished) {
          toast.error(ERRORS.COMPETITION.COMPETITION_FINISHED);
          navigate(ROUTES.NAV.DASHBOARD, { replace: true });
          return;
        }

        // 2. Si l'utilisateur n'est pas connecté, on l'envoie vers le login avec le code valide
        if (!user) {
          navigate(ROUTES.NAV.LOGIN_WITH_JOIN_CODE(code), { replace: true });
          return;
        }

        // 3. Si connecté, on tente de le faire rejoindre l'arène
        await competitionService.join(code);
        navigate(ROUTES.NAV.COMPETITION_DETAIL(code), { replace: true });
      } catch (e) {
        handleApiError(e, undefined, ERRORS.COMPETITION.NOT_FOUND(code));
        navigate(ROUTES.NAV.DASHBOARD, { replace: true });
      }
    };

    processQR();
  }, [code, user, loading, navigate]);
};
