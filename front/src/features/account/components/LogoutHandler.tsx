import { useEffect } from 'react';
import { AUTH_UI, useLogout } from '@/features/account';
import { LoadingScreen } from '@/shared';

export const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <LoadingScreen message={AUTH_UI.LOGOUT.MESSAGE} />;
};

export default LogoutHandler;
