import { useEffect } from 'react';
import { useLogout } from '@/hooks';
import { LoadingScreen } from '@/components/UI';
import { AUTH_UI } from '@/constants';

const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <LoadingScreen message={AUTH_UI.LOGOUT.MESSAGE} />;
};

export default LogoutHandler;
