import { ICONS } from './icons';

export const BUTTONS = {
  // ACtions CRUD & Formulaires
  SAVE: `Enregistrer ${ICONS.SAVE}`,
  CANCEL: 'Annuler',
  ADD: 'Ajouter',
  MODIFY: 'Modifier',

  // Navigation
  CONTINUE: 'Continuer →',
  PREVIOUS: '← Précédent',
  CLOSE: 'Fermer',
  CLEAR_SEARCH: 'Effacer la recherche',

  // Interface / Layout
  COLLAPSE: 'Réduire',
  EXPAND: 'Développer',

  // Divers
  AUTO: 'Auto',
} as const;
