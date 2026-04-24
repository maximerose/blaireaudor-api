import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
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
  }, []);

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
        navigate(ROUTES.NAV_DASHBOARD);
      } else {
        setError('Identifiants invalides.');
      }
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
