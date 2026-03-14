import { useState, useEffect, type ReactNode, useRef } from 'react';
import { authService } from '../api/authService';
import { AuthContext, type User } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isInitilialized = useRef(false);

  useEffect(() => {
    if (isInitilialized.current) return;
    isInitilialized.current = true;

    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.me();
          if (userData) setUser(userData);
        } catch (e) {
          console.log(e);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const result = await authService.login(credentials);
    if (result.ok && result.data.token) {
      const userData = await authService.me();
      setUser(userData);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.me();
      if (userData) setUser(userData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement utilisateur', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
