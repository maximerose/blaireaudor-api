import {
  useState,
  useEffect,
  type ReactNode,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { LOG_MESSAGES } from '@/shared';
import type {
  AuthContextType,
  AuthResult,
  LoginCredentials,
  User,
} from '@/features/account/types';
import { authService } from '@/features/account/services';
import { AuthContext } from './AuthContext';

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

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      const result = await authService.login(credentials);
      if (result.ok && result.data.token) {
        const userData = await authService.me();
        setUser(userData);
      }
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.me();
      if (userData) setUser(userData);
    } catch (e) {
      console.error(LOG_MESSAGES.AUTH.REFRESH_FAILED, e);
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
