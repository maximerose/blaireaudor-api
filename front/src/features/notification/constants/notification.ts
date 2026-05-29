// front/src/features/notification/constants/notification.ts

import { ICONS } from '@/shared';
import type React from 'react';

export const NOTIFICATION = {
  TITLE: 'Notifications',
  EMPTY: 'Aucune notification pour le moment.',
  MARK_ALL_READ: 'Tout lire',
  ARIA: {
    MARK_ALL_READ: 'Marquer toutes les notifications comme lues',
    LIST: 'Historique de vos notifications de carrière',
    ITEM_UNREAD: 'Notification non lue : ',
    ITEM_READ: 'Notification lue : ',
  },
} as const;

export interface NotificationStyleConfig {
  icon: React.ReactNode;
  wrapperClass: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<string, NotificationStyleConfig> =
  {
    // Arbitrage & Décisions
    NEW_SUBMISSION: {
      icon: ICONS.REFEREE,
      wrapperClass: 'bg-info-soft text-info-bright',
    },
    REFEREE_PROMOTED: {
      icon: ICONS.CROWN,
      wrapperClass: 'bg-gold-soft text-gold',
    },
    REFEREE_REVOKED: {
      icon: ICONS.SKULL,
      wrapperClass: 'bg-danger-soft text-danger-bright',
    },

    // Validation des sentences
    ACTION_VALIDATED: {
      icon: ICONS.CHECK,
      wrapperClass: 'bg-success-soft text-success-bright',
    },
    ACTION_REJECTED: {
      icon: ICONS.CANCEL,
      wrapperClass: 'bg-danger-soft text-danger-bright',
    },

    // Évolution de la compétition
    BONUS_TRIGGERED: {
      icon: ICONS.BONUS,
      wrapperClass: 'bg-warning-soft text-warning-bright',
    },
    PLAYER_JOINED: {
      icon: ICONS.PLAYERS,
      wrapperClass: 'bg-surface-raised text-silver',
    },
    ADDED_BY_REFEREE: {
      icon: ICONS.CREATOR,
      wrapperClass: 'bg-success-soft text-role-creator-bright',
    },
    GUEST_CLAIMED: {
      icon: ICONS.GUEST_NEW,
      wrapperClass: 'bg-info-soft text-info-bright',
    },

    // Brouillard & Temps
    COMPETITION_STARTED: {
      icon: ICONS.START,
      wrapperClass: 'bg-gold-soft text-gold',
    },
    COMPETITION_FINISHED: {
      icon: ICONS.FINISHED,
      wrapperClass: 'bg-danger-soft text-danger-bright',
    },
    FOG_ENABLED: {
      icon: ICONS.FOG_ACTIVE,
      wrapperClass: 'bg-surface-raised text-text-muted',
    },
    FOG_DISABLED: {
      icon: ICONS.FOG_INACTIVE,
      wrapperClass: 'bg-info-soft text-info-bright',
    },
  };

// Icône de secours si le Back-end envoie un type inconnu
export const DEFAULT_NOTIFICATION_STYLE: NotificationStyleConfig = {
  icon: ICONS.NOTIFICATION,
  wrapperClass: 'bg-surface-raised text-silver',
};
