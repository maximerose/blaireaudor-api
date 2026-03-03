import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { ROUTES } from '../constants/routes';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate(ROUTES.HOME);
  };

  return { handleLogout };
};
