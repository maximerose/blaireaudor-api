export interface HydraCollection<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    'hydra:first': string;
    'hydra:last': string;
    'hydra:next'?: string;
  };
}

export type ApiId = string;

export interface ApiError {
  message: string;
  violations?: ApiViolation[];
}

export interface ApiViolation {
  propertyPath: string;
  message: string;
}

/**
 * Harmonise tous les retours du backend vers l'interface unique ApiError
 */
export const getApiError = async (response: Response): Promise<ApiError> => {
  const fallbackMessage = `Erreur ${response.status}: ${response.statusText}`;

  try {
    const data = await response.json();

    // 1. Format API Platform 4 / Hydra (Validation de formulaires, DTOs, etc.)
    if (data.violations && Array.isArray(data.violations)) {
      return {
        message:
          data['hydra:description'] || data.detail || 'Erreur de validation.',
        violations: data.violations.map(
          (v: { propertyPath: string; message: string }) => ({
            propertyPath: v.propertyPath,
            message: v.message,
          }),
        ),
      };
    }

    // 2. Format Custom, Exception standard Symfony ou JWT (ex: { message: "..." } ou { error: "..." })
    return {
      message: data.message || data.error || fallbackMessage,
      violations: [],
    };
  } catch {
    return { message: fallbackMessage };
  }
};
