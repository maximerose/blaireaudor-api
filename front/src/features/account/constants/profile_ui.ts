import { ICONS } from '@/shared';

export const PROFILE_UI = {
  TITLE: 'Mon profil',
  INFO_TITLE: 'Mes informations',
  INFO_SUBTITLE: 'Modifiez vos informations personnelles',
  PASSWORD_TITLE: 'Sécurité',
  PASSWORD_SUBTITLE: 'Changez votre mot de passe',
  NOTIFICATIONS_TITLE: "Préférences d'alertes",
  NOTIFICATIONS_SUBTITLE: 'Choisis les notifications que tu souhaites recevoir',
  NOTIFICATIONS_SAVE: 'Sauvegarder les préférences',
  LOGOUT_CARD: {
    TITLE: 'Fin de session',
    SUBTITLE:
      "Tu quittes l'arène ? Tes scores et signalements seront conservés intacts en base.",
    BUTTON: 'Déconnexion',
  },
} as const;

export const NOTIFICATION_SETTINGS_CONFIG = [
  {
    category: 'Mécanique de jeu',
    options: [
      {
        id: 'ACTION_VALIDATED',
        label: 'Validation des actions',
        hint: 'Sois informé quand un arbitre valide un signalement (les tiens ou ceux des autres).',
        icon: ICONS.CHECK,
      },
      {
        id: 'ACTION_REJECTED',
        label: 'Rejet de mes signalements',
        hint: "Sois notifié si un arbitre classe sans suite l'une de tes dénonciations.",
        icon: ICONS.CANCEL,
      },
      {
        id: 'BONUS_TRIGGERED',
        label: 'Jours Bonus activés',
        hint: 'Ne rate aucun multiplicateur de points programmé dans tes compétitions.',
        icon: ICONS.BONUS,
      },
      {
        id: 'FOG_DISABLED',
        label: 'Levée du brouillard de guerre',
        hint: 'Sache quand les scores redeviennent visibles pour tous les joueurs.',
        icon: ICONS.FOG_INACTIVE,
      },
      {
        id: 'FOG_ENABLED',
        label: 'Activation du brouillard de guerre',
        hint: 'Sois prévenu quand un arbitre masque le classement pour le suspense.',
        icon: ICONS.FOG_ACTIVE,
      },
    ],
  },
  {
    category: 'La Compétition',
    options: [
      {
        id: 'COMPETITION_STARTED',
        label: 'Ouverture officielle des compétitions',
        hint: "Reçois un rappel le jour J au démarrage d'une nouvelle compétition.",
        icon: ICONS.START,
      },
      {
        id: 'COMPETITION_FINISHED',
        label: 'Clôture des compétitions',
        hint: 'Sois alerté dès la fin du tournoi pour consulter le classement final.',
        icon: ICONS.FINISHED,
      },
      {
        id: 'PLAYER_JOINED',
        label: 'Nouveaux concurrents dans la compétition',
        hint: 'Sache immédiatement quand un nouveau blaireau rejoint ta compétition.',
        icon: ICONS.PLAYERS,
      },
      {
        id: 'ADDED_BY_REFEREE',
        label: 'Ajout forcé par un arbitre',
        hint: "Reçois une alerte si un arbitre t'inscrit d'office à une compétition.",
        icon: ICONS.CREATOR,
      },
    ],
  },
  {
    category: 'Administration & Arbitrage',
    options: [
      {
        id: 'NEW_SUBMISSION',
        label: 'Nouvelles actions envoyées',
        hint: 'Reçois une alerte quand un joueur dénonce une action dans une compétition que tu arbitres.',
        icon: ICONS.POINTS,
      },
      {
        id: 'REFEREE_PROMOTED',
        label: "Nominations d'arbitres",
        hint: 'Sois informé des nouveaux arbitres nommés dans tes compétitions.',
        icon: ICONS.CROWN,
      },
      {
        id: 'REFEREE_REVOKED',
        label: "Révocations d'arbitres",
        hint: 'Sache quand un arbitre est démis de ses fonctions.',
        icon: ICONS.SKULL,
      },
      {
        id: 'GUEST_CLAIMED',
        label: "Prise de contrôle d'un profil invité",
        hint: '(Arbitres) Sois alerté quand un profil fantôme de ta compétition est réclamé par un vrai joueur.',
        icon: ICONS.GUEST_NEW,
      },
    ],
  },
] as const;
