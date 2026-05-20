import { pluralize } from '@/shared/utils';

export const UI = {
  APP_NAME: "Le Blaireau d'Or",
  ME: 'Moi',
  ALL: 'Tous',
  ENTRIES: (count: number) => `${count} ${pluralize(count, 'entrée')}`,
  NOT_FOUND_TITLE: 'Erreur 404',
  NOT_FOUND_SUBTITLE:
    "La ressource que tu cherches n'existe pas ou a été supprimée.",
};
