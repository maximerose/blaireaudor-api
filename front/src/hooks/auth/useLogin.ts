import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ERRORS } from '@/constants';
import { useAuth } from '@/hooks';
import { slugify } from '@/utils';

export const useLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'username' ? slugify(value) : value;
    setCredentials((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      if (response.ok) {
        navigate(ROUTES.NAV.DASHBOARD);
      } else {
        setError(ERRORS.AUTH.INVALID_CREDENTIALS);
      }
    } catch {
      setError(ERRORS.NETWORK.SERVER);
    } finally {
      setIsLoading(false);
    }
  };

  return { credentials, error, isLoading, handleChange, handleSubmit };
};
