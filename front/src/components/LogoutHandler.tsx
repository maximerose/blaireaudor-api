import { useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';

const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null;
};

export default LogoutHandler;
