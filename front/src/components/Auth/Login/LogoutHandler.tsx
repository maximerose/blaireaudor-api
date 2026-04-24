import { useEffect } from 'react';
import { useLogout } from '@/hooks';
import { LoadingScreen } from '@/components/UI';

const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <LoadingScreen message="Déconnexion en cours..." />;
};

export default LogoutHandler;
