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
  message?: string;
  errors?: {
    username?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}
