import { ERRORS } from '@/constants';
import { createContext, useContext } from 'react';
import type { AuthContextType } from '@/context';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER('useAuthContext', 'AuthProvider'),
    );
  }

  return context;
};
