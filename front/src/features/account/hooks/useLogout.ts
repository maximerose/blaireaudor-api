import { useNavigate } from 'react-router-dom';
import { authService, useAuthContext } from '@/features/account';
import { ROUTES, LOG_MESSAGES } from '@/shared';
import { useCallback } from 'react';

export const useLogout = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(LOG_MESSAGES.AUTH.LOGOUT_FAILED, e);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate(ROUTES.NAV.LOGIN, { replace: true });
    }
  }, [setUser, navigate]);

  return { handleLogout };
};
