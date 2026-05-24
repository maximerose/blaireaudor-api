import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import { ERRORS, HTTP_STATUS, snakeToCamel } from '@/shared';
import type { ApiError } from '@/shared/types';

/**
 * Dispatcher centralisé pour la gestion des erreurs API côté Front.
 *
 * @param error L'erreur catchée (idéalement de type ApiError)
 * @param setError Fonction optionnelle de React-Hook-Form pour lier les erreurs aux champs
 * @param fallbackMessage Message d'erreur personnalisé si l'API n'en renvoie pas
 */
export const handleApiError = (
  error: unknown,
  setError?: UseFormSetError<any>,
  fallbackMessage?: string,
) => {
  const apiError = error as ApiError;

  // 1. ERREUR SERVEUR CRITIQUE (500+)
  // Loggée en console dans api.ts. Ici on prévient juste l'utilisateur poliment.
  if (apiError.status && apiError.status >= HTTP_STATUS.SERVER_ERROR) {
    toast.error(ERRORS.NETWORK.SERVER, { id: 'server-error' });
    return;
  }

  // 2. ERREUR D'AUTORISATION (401, 403)
  if (
    apiError.status === HTTP_STATUS.UNAUTHORIZED ||
    apiError.status === HTTP_STATUS.FORBIDDEN
  ) {
    toast.error(
      fallbackMessage || apiError.message || ERRORS.AUTH.UNAUTHORIZED,
      { id: 'auth-error' },
    );
    return;
  }

  // 3. ERREUR DE VALIDATION DE FORMULAIRE (422)
  if (
    apiError.status === HTTP_STATUS.UNPROCESSABLE_ENTITY &&
    apiError.violations?.length
  ) {
    if (setError) {
      // Si on a le hook de formulaire, on assigne chaque erreur à son champ
      apiError.violations.forEach((v) => {
        // Mappages spécifiques pour certains champs capricieux
        let formKey = snakeToCamel(v.propertyPath);
        if (v.propertyPath === 'player') formKey = 'targetPlayerId';
        if (v.propertyPath === 'date_action') formKey = 'dateAction';

        setError(formKey, {
          type: 'server',
          message: v.message,
        });
      });
    } else {
      // Si on n'a pas passé setError, on affiche le premier message de validation en toast
      toast.error(apiError.violations[0].message);
    }
    return;
  }

  // 4. ERREUR MÉTIER STANDARD (400, 404, etc.)
  toast.error(apiError.message || fallbackMessage || ERRORS.NETWORK.GENERIC);
};
