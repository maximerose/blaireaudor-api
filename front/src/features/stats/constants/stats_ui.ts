import { ICONS } from '@/shared/constants/icons';

export const STATS_UI = {
  GENERAL: {
    TITLE: 'Statistiques de carrière',
    SUBTITLE: 'Tes records, moyennes et infamies historiques cumulés.',
    SUBTITLE_PAGE: 'Tes analyses de performance',
    LINK_ALL: 'Voir mes analyses complètes →',
  },
  RANKS: {
    TITLE: '👑 Rangs Historiques (Compétitions Closes)',
    BEST: {
      label: 'Meilleur classement',
      hint: {
        title: 'Meilleur classement',
        description:
          'Ton plus haut rang obtenu à la sueur de ton front dans une compétition officiellement close.',
      },
      icon: ICONS.MEDALS.GOLD,
      color: 'text-success-bright',
    },
    WORST: {
      label: 'Pire classement',
      hint: {
        title: 'Pire classement',
        description:
          'Le fond du trou : ton classement le plus bas enregistré lors des compétitions passées.',
      },
      icon: ICONS.FLAG,
      color: 'text-danger-bright',
    },
  },
  POINTS: {
    TITLE: '🎯 Section des Points',
    TOTAL: {
      label: 'Total cumulé',
      icon: ICONS.POINTS,
      color: 'text-gold',
    },
    AVG: {
      label: 'Moyenne / compétition',
      icon: ICONS.CALENDAR,
      color: 'text-info-bright',
    },
    MAX: {
      label: 'Pire compétition (Max)',
      icon: ICONS.FLAG,
      color: 'text-danger-bright',
    },
  },
  ACTIONS: {
    TITLE: '🦡 Section des Actions',
    TOTAL: {
      label: 'Total cumulé',
      icon: ICONS.BADGER,
      color: 'text-gold',
    },
    AVG: {
      label: 'Moyenne / compétition',
      icon: ICONS.ALARM,
      color: 'text-info-bright',
    },
    MAX: {
      label: 'Pire compétition (Max)',
      icon: ICONS.EMPTY,
      color: 'text-danger-bright',
    },
  },
  DELATION: {
    TITLE: '👀 Section de la Délation',
    TOTAL: {
      label: 'Signalements envoyés',
      icon: ICONS.GUEST_EYE,
      color: 'text-gold',
    },
    PRECISION: {
      label: 'Précision de tir',
      icon: ICONS.CHECK,
      color: 'text-info-bright',
      hint: {
        title: 'Précision de tir',
        description:
          "Pourcentage de tes dénonciations validées avec succès par l'équipe d'arbitrage. Un taux élevé prouve la légitimité de tes dossiers.",
      },
    },
    KARMA: {
      label: 'Karma Index',
      icon: ICONS.REFEREE,
      color: 'text-danger-bright',
      hint: {
        title: 'Karma Index',
        description:
          'Ratio entre dénonciations envoyées et reçues. Supérieur à 1 : tu es un Prédateur. Inférieur à 1 : tu es un Martyr ciblé par la bande.',
      },
    },
  },
  FOCUS: {
    SECTION_TITLE: "💥 Faits d'armes",
    RECORD: 'Plus grosse action de blaireau',
    WORST_STAB: 'Pire coup envoyé',
    RECORD_EMPTY: 'Aucun enregistrement historique',
    STAB_DENOUNCER: 'Dénoncé par : ',
    STAB_VICTIM: 'Victime : ',
  },
  PALMARES: {
    TITLE: '🏆 Palmarès historique de tes compétitions',
    EMPTY: 'Aucune compétition archivée dans ton tableau de chasse.',
    TABLE: {
      TH_COMPETITION: 'Compétition',
      TH_RANK: 'Classement',
      TH_SCORE: 'Score Final',
    },
  },
  FORMAT: {
    RANK: (rank: number) => `${rank}${rank === 1 ? 'er' : 'ème'}`,
    POINTS: (count: number) => `${count} pts`,
    ACTIONS: (count: number) => `${count} action${count > 1 ? 's' : ''}`,
    PERCENT: (count: number | null) =>
      `${typeof count === 'number' ? count : '-'}%`,
  },
} as const;
