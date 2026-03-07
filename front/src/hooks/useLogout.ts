import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { ROUTES } from '../constants/routes';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

export const useLogout = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Erreur lors du logout serveur', e);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [setUser, navigate]);

  return { handleLogout };
};
