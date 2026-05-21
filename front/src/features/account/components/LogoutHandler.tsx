import { useEffect } from 'react';
import { LoadingScreen } from '@/shared';
import { useLogout } from '@/features/account/hooks';
import { AUTH_UI } from '@/features/account/constants';

export const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <LoadingScreen message={AUTH_UI.LOGOUT.MESSAGE} />;
};

export default LogoutHandler;
