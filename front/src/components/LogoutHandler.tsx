import { useEffect } from 'react';
import { useLogout } from '../hooks/userLogout';

const LogoutHandler = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null;
};

export default LogoutHandler;
