import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks';
import { useCallback } from 'react';
import { LOG_MESSAGES } from '@/constants';

export const useLogout = () => {
  const { setUser } = useAuth();
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
