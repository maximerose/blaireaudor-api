import { useState, useEffect, type ReactNode } from 'react';
import { authService } from '../api/authService';
import { AuthContext, type User } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.getToken()) {
        const userData = await authService.me();
        if (userData) {
          setUser(userData);
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

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
