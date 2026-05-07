import { useState, useEffect, type ReactNode, useRef, useMemo } from 'react';
import { authService } from '@/services/api/auth';
import { AuthContext } from '@/context/AuthContext';
import type {
  User,
  AuthContextType,
  LoginCredentials,
  AuthResult,
} from '@/types';
import { LOG_MESSAGES } from '@/constants';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.me();
          if (userData) setUser(userData);
        } catch (e) {
          console.error(LOG_MESSAGES.AUTH.INIT_FAILED, e);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
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
      console.error(LOG_MESSAGES.AUTH.REFRESH_FAILED, error);
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
