import { ICONS } from './icons';

export const FORM = {
  /**
   * ÉLÉMENTS PARTAGÉS (Reutilisables partout)
   */
  SHARED: {
    LABELS: {
      SAVE: 'Sauvegarder',
      DATE: 'Date',
      POINTS: 'Points',
      DESCRIPTION: 'Description',
    },
    PLACEHOLDERS: {
      DATE: 'JJ/MM/AAAA',
      POINTS: '0',
    },
  },

  /**
   * AUTHENTIFICATION & PROFIL
   */
  AUTH: {
    LABELS: {
      USERNAME: "Nom d'utilisateur",
      PASSWORD: 'Mot de passe',
      DISPLAY_NAME: "Nom d'affichage",
      EMAIL: 'Adresse email',
      NEW_PASSWORD: 'Nouveau mot de passe',
      CONFIRM_PASSWORD: 'Confirmer le mot de passe',
    },
    PLACEHOLDERS: {
      USERNAME: 'votre-pseudo',
      PASSWORD: '••••••••',
      DISPLAY_NAME: 'Ex: Jean Dupont',
      EMAIL: 'blaireau@or.com',
    },
    HINTS: {
      USERNAME_HINT: 'Minuscules, chiffres et tirets uniquement',
      USERNAME_CHECK: 'Vérification en cours...',
      USERNAME_AVAILABLE: 'Pseudo disponible !',
      USERNAME_TAKEN: 'Ce pseudo est déjà pris.',
      EMAIL_CHECK: 'Vérification en cours...',
      EMAIL_AVAILABLE: 'Adresse email disponible !',
      EMAIL_TAKEN: 'Cette adresse email est déjà utilisée.',
    },
  },

  BONUS_DAY: {
    BUTTONS: {
      DELETE: 'Supprimer ce bonus',
    },
    LABELS: {
      MULTIPLIER: 'Multiplicateur',
    },
  },

  /**
   * CONFIGURATION DE COMPÉTITION (Création & Settings)
   */
  COMPETITION: {
    BUTTONS: {
      CREATE: `Créer la compétition ${ICONS.STARS}`,
    },
    STEPS: {
      CONFIG: {
        TITLE: 'La compétition',
        SUBTITLE: 'Configuration initiale',
      },
      RECRUITMENT: {
        TITLE: 'Recrutement',
        SUBTITLE: 'Ajoute des joueurs à la compétition',
      },
      REFEREE: {
        TITLE: 'Arbitrage',
        SUBTITLE: 'Recherche un arbitre ou sélectionne un joueur',
      },
    },
    LABELS: {
      NAME: 'Nom de la compétition',
      JOIN_CODE: "Code d'accès",
      START: 'Début',
      END: 'Fin',
      TIME: 'Heure',
      FULL_DAY: 'Journée complète',
      FOG_OF_WAR: 'Brouillard de guerre',
      PARTICIPATE: 'Auto-inscription',
      MAIN_REFEREE: 'Arbitre principal',
      EXTERNAL_REFEREES: 'Arbitres externes',
      PLAYER_REFEREES: 'Joueurs (clic pour nommer arbitre)',
    },
    PLACEHOLDERS: {
      NAME: 'Nom de la compétition',
      JOIN_CODE: 'Ex: BLAIR-2026',
      EXTERNAL_REFEREE: 'Chercher un arbitre externe...',
    },
    HINTS: {
      JOIN_CODE: `Vide = génération automatique ${ICONS.STARS}`,
      JOIN_CODE_CHECK: 'Vérification du code...',
      JOIN_CODE_AVAILABLE: "Code d'accès disponible !",
      JOIN_CODE_TAKEN: "Code d'accès déjà utilisé.",
      FOG_OF_WAR: 'Scores cachés pendant le tournoi',
      PARTICIPATE: 'Participer au tournoi en tant que joueur',
      ALREADY_STARTED: 'Déjà lancée',
      REFEREE: `${ICONS.DANGER} Tu dois désigner au moins un arbitre.`,
    },
  },

  /**
   * TOUT CE QUI TOUCHE AUX JOUEURS
   */
  PLAYER: {
    LABELS: {
      SEARCH_PLAYER: 'Rechercher un joueur',
    },
    PLACEHOLDERS: {
      SEARCH_PLAYER: 'Nom du blaireau...',
      SEARCH_OR_CREATE: 'Chercher ou créer un joueur...',
    },
    HINT: {
      NOT_FOUND: 'Aucun joueur trouvé',
    },
  },

  /**
   * SIGNALEMENT D'ACTION (ReportActionForm)
   */
  REPORT_ACTION: {
    TITLE: 'Balance ton blaireau',
    SUBTITLE: 'Signalement de méfait',
    LABELS: {
      PLAYER: 'Le coupable',
      DESCRIPTION: 'Le méfait',
      POINTS: 'Points',
    },
    PLACEHOLDERS: {
      PLAYER: 'Chercher un blaireau...',
      DESCRIPTION: 'Ex: Tombé à ski...',
    },
    BUTTONS: {
      SUBMIT: "Dénoncer l'action",
      CANCEL: 'Finalement, je pardonne',
    },
  },

  /**
   * ADMINISTRATION (Bonus, Edit Actions)
   */
  ADMIN: {
    BONUS: {
      TITLE: `${ICONS.FIRE} Multiplicateurs`,
      SUBTITLE: 'Multipliez les points de la journée.',
      EMPTY: 'Aucun multiplicateur programmé.',
    },
    EDIT_MODE: {
      LABEL_DESC: 'Description du méfait',
      PLACEHOLDER_DESC: 'Ex: A mangé le dernier cookie...',
      SAVE_LABEL: 'Enregistrer les modifs 💾',
    },
    ENROLLMENT: {
      TITLE: 'Nouveau recrutement',
      BUTTON_OPEN: '+ Ajouter un joueur',
      NEW_PLAYER_HINT: 'Nouveau joueur',
      SELECTED_PLAYERS: 'Joueurs sélectionnés',
      NO_PLAYER_SELECTED_HINT: 'Aucun joueur sélectionné',
      LAST_COMPETITION: 'Dernière compétition : ',
      SELECT_ARIA: (name: string) => `Sélectionner ${name}`,
      CREATE_NEW: (name: string) => `+ créer "${name}"`,
      SAVE_COUNT: (count: number) => `Recruter(${count})`,
    },
  },

  /**
   * MODALES & DIVERS
   */
  MODALS: {
    JOIN: {
      INPUT_LABEL: "Code d'accès",
      PLACEHOLDER: 'Saisis le code de la compétition',
      SUBMIT: 'Entrer dans la compétition',
    },
  },
} as const;
