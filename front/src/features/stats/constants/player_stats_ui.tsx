/* eslint-disable react-refresh/only-export-components */
import { ICONS, pluralize } from '@/shared';
import type { PlayerStats } from '@/features/account/types';

// ---------------------------------------------------------
// 1. TEXTES GLOBAUX
// ---------------------------------------------------------
export const PLAYER_STATS_GENERAL = {
  TITLE: 'Statistiques de carrière',
  SUBTITLE: 'Tes records, moyennes et infamies historiques cumulés.',
  SUBTITLE_PAGE: 'Tes analyses de performance',
  LINK_ALL: 'Voir mes analyses complètes →',
  FOCUS: {
    TITLE: "💥 Faits d'armes",
    RECORD: 'Plus grosse action de blaireau',
    WORST_STAB: 'Pire coup envoyé',
    RECORD_EMPTY: 'Aucun enregistrement historique',
    STAB_DENOUNCER: 'Dénoncé par : ',
    STAB_VICTIM: 'Victime : ',
    PREFIX_OVERRIDE: 'Coupable : ',
  },
} as const;

export const PLAYER_STATS_PALMARES = {
  TITLE: '🏆 Palmarès historique de tes compétitions',
  EMPTY: 'Aucune compétition archivée dans ton tableau de chasse.',
  TH_COMPETITION: 'Compétition',
  TH_RANK: 'Classement',
  TH_SCORE: 'Score Final',
  RANK: (rank: number) => `${rank}${rank === 1 ? 'er' : 'ème'}`,
} as const;

// ---------------------------------------------------------
// 2. HELPERS DE FORMATAGE (JSX)
// ---------------------------------------------------------
const fmtPoints = (pts: number) => (
  <span className="flex items-baseline justify-center gap-1">
    {pts}{' '}
    <span className="text-[10px] opacity-50 font-normal lowercase">pts</span>
  </span>
);

const fmtActions = (count: number, word = 'action') => (
  <span className="flex items-baseline justify-center gap-1">
    {count}{' '}
    <span className="text-[10px] opacity-50 font-normal lowercase">
      {pluralize(count, word)}
    </span>
  </span>
);

const fmtPercent = (val: number | null) =>
  val !== null ? (
    <span className="flex items-baseline justify-center gap-1">
      {val}{' '}
      <span className="text-[10px] opacity-50 font-normal lowercase">%</span>
    </span>
  ) : (
    '-'
  );

const fmtRank = (rank: number | null) =>
  rank ? `${rank}${rank === 1 ? 'er' : 'ème'}` : '-';

// ---------------------------------------------------------
// 3. LA CONFIGURATION PILOTE (Le cœur du réacteur)
// ---------------------------------------------------------
export type StatConfig = {
  id: string;
  getLabel: (stats: PlayerStats) => string;
  icon: string | React.ReactNode;
  getColor: (stats: PlayerStats) => string;
  getValue: (stats: PlayerStats) => React.ReactNode | string | number;
  getSubtext?: (stats: PlayerStats) => string | undefined;
  hint?: { title: string; description: string };
};

export type CategoryConfig = {
  title: string;
  metrics: StatConfig[];
};

export const PLAYER_STATS_CATEGORIES: CategoryConfig[] = [
  {
    title: '👑 Rangs Historiques (Compétitions Closes)',
    metrics: [
      {
        id: 'min_rank',
        getLabel: () => 'Meilleur classement',
        icon: ICONS.MEDALS.GOLD,
        getColor: () => 'text-success-bright',
        getValue: (s) => fmtRank(s.min_rank),
        hint: {
          title: 'Meilleur classement',
          description:
            'Ton plus haut rang obtenu à la sueur de ton front dans une compétition officiellement close.',
        },
      },
      {
        id: 'max_rank',
        getLabel: () => 'Pire classement',
        icon: ICONS.FLAG,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtRank(s.max_rank),
        hint: {
          title: 'Pire classement',
          description:
            'Le fond du trou : ton classement le plus bas enregistré lors des compétitions passées.',
        },
      },
    ],
  },
  {
    title: '🎯 Section des Points',
    metrics: [
      {
        id: 'total_points_received',
        getLabel: () => 'Total cumulé',
        icon: ICONS.POINTS,
        getColor: () => 'text-gold',
        getValue: (s) => fmtPoints(s.total_points_received),
      },
      {
        id: 'average_points_per_competition',
        getLabel: () => 'Moyenne / compétition',
        icon: ICONS.CALENDAR,
        getColor: () => 'text-info-bright',
        getValue: (s) => fmtPoints(s.average_points_per_competition),
      },
      {
        id: 'max_competition_score',
        getLabel: () => 'Score max',
        icon: ICONS.FLAG,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtPoints(s.max_competition_score),
      },
    ],
  },
  {
    title: '🦡 Section des Actions',
    metrics: [
      {
        id: 'total_actions_received',
        getLabel: () => 'Total cumulé',
        icon: ICONS.BADGER,
        getColor: () => 'text-gold',
        getValue: (s) => fmtActions(s.total_actions_received),
      },
      {
        id: 'average_actions_received',
        getLabel: () => 'Moyenne / compétition',
        icon: ICONS.ALARM,
        getColor: () => 'text-info-bright',
        getValue: (s) => fmtActions(s.average_actions_received_per_competition),
      },
      {
        id: 'max_actions_received',
        getLabel: () => 'Nombre max',
        icon: ICONS.EMPTY,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtActions(s.max_competition_actions_received),
      },
    ],
  },
  {
    title: '👀 Section de la Délation',
    metrics: [
      {
        id: 'total_actions_reported',
        getLabel: () => 'Signalements envoyés',
        icon: ICONS.GUEST_EYE,
        getColor: () => 'text-gold',
        getValue: (s) => fmtActions(s.total_actions_reported, 'envoi'),
      },
      {
        id: 'report_approval_ratio',
        getLabel: () => 'Précision de tir',
        icon: ICONS.CHECK,
        getColor: () => 'text-info-bright',
        getValue: (s) => fmtPercent(s.report_approval_ratio),
        hint: {
          title: 'Précision de tir',
          description:
            "Pourcentage de tes dénonciations validées avec succès par l'équipe d'arbitrage.",
        },
      },
      {
        id: 'karma_index',
        getLabel: (s) =>
          s.report_to_received_ratio > 1
            ? 'Karma Index (Prédateur)'
            : s.report_to_received_ratio < 1
              ? 'Karma Index (Martyr)'
              : 'Karma Index',
        icon: ICONS.REFEREE,
        getColor: (s) =>
          s.report_to_received_ratio > 1
            ? 'text-success-bright'
            : s.report_to_received_ratio < 1
              ? 'text-danger-bright'
              : 'text-gold',
        getValue: (s) => s.report_to_received_ratio,
        hint: {
          title: 'Karma Index',
          description:
            'Ratio entre dénonciations envoyées et reçues. Supérieur à 1 : tu es un Prédateur. Inférieur à 1 : tu es un Martyr.',
        },
      },
      {
        id: 'bonus_actions_ratio',
        getLabel: () => "Effet d'aubaine",
        icon: ICONS.FIRE,
        getColor: () => 'text-warning-bright',
        getValue: (s) => fmtPercent(s.bonus_actions_ratio),
        hint: {
          title: "Effet d'aubaine",
          description:
            'Pourcentage de tes méfaits validés commis spécifiquement lors des Jours Bonus.',
        },
      },
    ],
  },
  {
    title: '👥 Écosystème Relationnel & Rivalités',
    metrics: [
      {
        id: 'main_enemy',
        getLabel: () => 'Pire bourreau de carrière',
        icon: ICONS.STAB,
        getColor: () => 'text-danger-bright',
        getValue: (s) =>
          s.max_reports_from_single_actor?.player_name || 'Aucun',
        getSubtext: (s) =>
          s.max_reports_from_single_actor
            ? `${s.max_reports_from_single_actor.count} ${pluralize(s.max_reports_from_single_actor.count, 'alignement subi', 'alignements subis')}`
            : '0 alignement subi',
        hint: {
          title: 'Pire bourreau de carrière',
          description:
            "Le joueur qui t'a le plus souvent aligné et envoyé au piquet tout au long de ta carrière.",
        },
      },
      {
        id: 'favorite_victim',
        getLabel: () => 'Mon souffre-douleur à vie',
        icon: ICONS.BADGER,
        getColor: () => 'text-warning-bright',
        getValue: (s) =>
          s.max_reports_to_single_receiver?.player_name || 'Aucun',
        getSubtext: (s) =>
          s.max_reports_to_single_receiver
            ? `${s.max_reports_to_single_receiver.count} ${pluralize(s.max_reports_to_single_receiver.count, 'dossier envoyé')}`
            : '0 dossier envoyé',
        hint: {
          title: 'Mon souffre-douleur à vie',
          description:
            'Ta cible favorite. Le joueur sur lequel tu as le plus fréquemment balancé de gros dossiers de méfaits.',
        },
      },
      {
        id: 'vendetta',
        getLabel: () => 'Ma vendetta éternelle',
        icon: ICONS.FLAG,
        getColor: () => 'text-info-bright',
        getValue: (s) =>
          s.max_reciprocal_reports_with_single_peer?.player_name || 'Aucune',
        getSubtext: (s) =>
          s.max_reciprocal_reports_with_single_peer
            ? `${s.max_reciprocal_reports_with_single_peer.reciprocal_score} ${pluralize(s.max_reciprocal_reports_with_single_peer.reciprocal_score, 'coup rendu')} (${s.max_reciprocal_reports_with_single_peer.total_sent} émis / ${s.max_reciprocal_reports_with_single_peer.total_received} subis)`
            : '0 coup échangé',
        hint: {
          title: 'Ma vendetta éternelle',
          description:
            "Récidive symétrique pure : la personne avec qui tu as le plus haut score d'échange réciproque.",
        },
      },
    ],
  },
];
