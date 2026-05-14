import { pluralize } from '@/utils';

export const UI = {
  APP_NAME: "Le Blaireau d'Or",
  ME: 'Moi',
  ALL: 'Tous',
  ENTRIES: (count: number) => `${count} ${pluralize(count, 'entrée')}`,
};
