import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ERRORS } from '@/constants';

/**
 * Hook pour accéder au contexte d'authentification.
 * Centralise la vérification de présence du Provider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER('useAuth', 'AuthProvider'),
    );
  }
  return context;
};
