import { pluralize } from '@/shared/utils';

export const UI = {
  APP_NAME: "Le Blaireau d'Or",
  ME: 'Moi',
  ALL: 'Tous',
  ENTRIES: (count: number) => `${count} ${pluralize(count, 'entrée')}`,
  NOT_FOUND_TITLE: 'Erreur 404',
  NOT_FOUND_SUBTITLE:
    "La ressource que vous cherchez n'existe pas ou a été supprimée.",
  ANONYMOUS: 'Anonyme',
  LOADING_DEFAULT: 'Chargement...',
  LOADING_SR:
    'Veuillez patienter, le contenu de la page est en cours de chargement.',
  INFO_ARIA: (title: string) => `Information : ${title}`,
};
