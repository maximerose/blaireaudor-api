import { pluralize } from '@/utils';
import { RULES } from './rules';

export const ERRORS = {
  // 1. Erreurs techniques / Réseau
  NETWORK: {
    GENERIC: 'Une erreur est survenue.',
    SERVER: '📡 Erreur de connexion au serveur.',
    TIMEOUT: 'Le serveur met trop de temps à répondre.',
    UNEXPECTED: "Une erreur inattendue s'est produite.",
  },

  SYMFONY_DETAILS: "Détails de l'erreur Symfony : ",

  // 2. Erreurs d'Authentification / Inscription
  AUTH: {
    INVALID_DISPLAY_NAME: `Le nom doit contenir au moins ${RULES.AUTH.MIN_DISPLAY_NAME} caractères.`,
    INVALID_USERNAME: `Le pseudo doit contenir au moins ${RULES.AUTH.MIN_USERNAME} caractères.`,
    INVALID_EMAIL: "Format d'email incorrect.",
    INVALID_PLAIN_PASSWORD: `Le mot de passe doit faire au moins ${RULES.AUTH.MIN_PASSWORD} caractères.`,
    INVALID_CONFIRM_PASSWORD: 'Les mots de passe ne correspondent pas.',
    USERNAME_TAKEN: "Ce nom d'utilisateur est déjà utilisé.",
    EMAIL_TAKEN: 'Cette adresse email est déjà utilisée.',
    INVALID_CREDENTIALS: 'Identifiants invalides.',
    SESSION_EXPIRED: 'Votre session a expiré, merci de vous reconnecter.',
    UNAUTHORIZED: "Vous n'avez pas les droits pour accéder à cette arène.",
    REGISTRATION_FAILED: "L'inscription a échoué. Vérifiez vos informations.",
    FORBIDDEN: "Action interdite : vous n'êtes pas administrateur.",
  },

  // 3. Compétitions / Arènes
  COMPETITION: {
    NOT_FOUND: (code: string) =>
      `La compétition "${code}" n'a pas été trouvée.`,
    FETCH_LEADERBOARD: 'Impossible de charger le classement pour le moment.',
    FETCH_ACTIONS:
      "Erreur lors de la récupération de l'historique des actions.",
    FETCH_ACTIONS_DATES: 'Impossible de récupérer les dates des actions.',
    FETCH_PENDING_COUNT:
      "Impossible de récupérer le compteur d'actions en attente.",
    CREATE_FAILED:
      'Impossible de créer la compétition. Vérifiez les dates et le code.',
    UPDATE_FAILED: 'Échec de la mise à jour des paramètres de la compétition.',
    DELETE_FAILED: 'La suppression de la compétition a échoué.',
    DELETE_HAS_ACTIONS: (name: string) =>
      `Impossible de supprimer "${name}" car elle contient des actions.`,
    CLOSE_PENDING_ACTIONS: (count: number) =>
      `Impossible de clôturer ! Il reste ${count} ${pluralize(count, 'signalement')} à trancher.`,

    // Participants et Arbitres
    PARTICIPATION_ADD_FAILED:
      "Une erreur est survenue lors de l'ajout des participants.",
    PARTICIPATION_REMOVE_FAILED:
      'Impossible de retirer le joueur de la compétition.',
    PARTICIPATION_HAS_ACTIONS: (name: string) =>
      `Impossible de retirer ${name} : Il a déjà des actions enregistrées dans cette compétition.`,
    REFEREE_ADD_FAILED: 'Impossible de nommer ce joueur arbitre.',
    REFEREE_REMOVE_FAILED: "Erreur lors de la destitution de l'arbitre.",
  },

  // 4. Joueurs
  PLAYER: {
    SEARCH_FAILED: 'La recherche de joueurs a échoué.',
    SEARCH_TOO_SHORT:
      'Veuillez saisir au moins 2 caractères pour la recherche.',
  },

  // 5. Actions (Méfaits)
  ACTION: {
    REPORT_FAILED: "Erreur lors du signalement de l'action.",
    STATUS_UPDATE_FAILED: "Erreur lors du changement de statut de l'action.",
    UPDATE_FAILED: "Erreur lors de la mise à jour de l'action.",
  },

  // 6. Jours Bonus
  BONUS: {
    CREATE_FAILED: 'Erreur lors de la création du bonus.',
    DELETE_FAILED: 'Erreur lors de la suppression du bonus.',
    FETCH_FAILED: 'Erreur lors de la récupération des jours bonus.',
    DUPLICATE_DATE: 'Un bonus existe déjà pour cette date.',
    INVALID_DATES: "Erreur (Vérifiez les dates de l'arène).",
  },

  // 7. Formulaires & Validation
  VALIDATION: {
    REQUIRED: 'Ce champ est obligatoire.',
    INVALID_DATE_RANGE:
      'La date de fin doit être postérieure à la date de début.',
    INVALID_FORMAT: 'Format de données invalide.',
  },

  // 8. Développeur
  DEVELOPER: {
    HOOK_OUTSIDE_PROVIDER: (hookName: string, providerName: string) =>
      `${hookName} must be used within an ${providerName}`,
  },
} as const;
