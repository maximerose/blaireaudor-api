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
  status?: number;
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

    if (data.violations && Array.isArray(data.violations)) {
      return {
        status: response.status,
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

    return {
      status: response.status,
      message: data.message || data.detail || data.error || fallbackMessage,
      violations: [],
    };
  } catch {
    return { status: response.status, message: fallbackMessage };
  }
};
