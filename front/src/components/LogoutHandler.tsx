import { useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';
import { LoadingScreen } from './UI/LoadingScreen';

const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <LoadingScreen message="Déconnexion en cours..." />;
};

export default LogoutHandler;
