import type {
  CategoryConfig,
  FocusStatConfig,
  StatFocusData,
} from '@/features/stats/types';
import { ICONS, pluralize } from '@/shared';
import {
  fmtActions,
  fmtPercent,
  fmtPoints,
  fmtPointsPerAction,
  fmtRank,
} from '../utils';

// ---------------------------------------------------------
// 1. TEXTES GLOBAUX
// ---------------------------------------------------------
export const PLAYER_STATS_GENERAL = {
  TITLE: 'Statistiques de carrière',
  SUBTITLE: 'Tes records, moyennes et infamies historiques cumulés.',
  SUBTITLE_PAGE: 'Tes analyses de performance',
  COMPETITIONS_SECTION_TITLE: 'Mes compétitions',
  LINK_ALL: 'Voir mes analyses complètes →',
  FOCUS: {
    TITLE: "Faits d'armes",
    RECORD: 'Plus grosse action de blaireau',
    WORST_STAB: 'Pire coup envoyé',
    WORST_AVG: 'Pire moyenne subie',
    BEST_AVG: 'Meilleure moyenne subie',
    MAX_SCORE: 'Pire tournoi absolu (Score)',
    MAX_ACTIONS: 'Pire tournoi absolu (Actions)',
    BEST_SCORE: 'Meilleur tournoi absolu (Score)',
    BEST_ACTIONS: 'Meilleur tournoi absolu (Actions)',
    RECORD_EMPTY: 'Aucun enregistrement historique',
    STAB_DENOUNCER: 'Dénoncé par : ',
    STAB_VICTIM: 'Victime : ',
    PREFIX_OVERRIDE: 'Coupable : ',
    ACTION_COUNT: (count: number) =>
      `${count} ${pluralize(count, 'action validée', 'actions validées')}`,
  },
};

export const PLAYER_STATS_PALMARES = {
  TITLE: 'Palmarès',
  EMPTY: 'Aucune compétition archivée dans ton tableau de chasse.',
  TH_COMPETITION: 'Compétition',
  TH_RANK: 'Classement',
  TH_SCORE: 'Score Final',
  RANK: (rank: number) => `${rank}${rank === 1 ? 'er' : 'ème'}`,
};

// ---------------------------------------------------------
// 2. LA CONFIGURATION PILOTE (Le cœur du réacteur)
// ---------------------------------------------------------

export const PLAYER_FOCUS_STATS: FocusStatConfig[] = [
  {
    id: 'record_received',
    title: PLAYER_STATS_GENERAL.FOCUS.RECORD,
    icon: ICONS.MAX_RECEIVED,
    variant: 'danger',
    getData: (stats, user): StatFocusData | null => {
      const record = stats.max_points_single_action_received;
      if (!record) return null;
      const involvedName =
        record.involved_player_name || (record as any).involvedPlayerName;
      return {
        points: record.points,
        description: record.description,
        competitionName:
          record.competition_name || (record as any).competitionName,
        involvedName,
        date: record.date,
        isMe: Boolean(
          involvedName &&
          user?.player?.display_name &&
          involvedName === user.player.display_name,
        ),
      };
    },
  },
  {
    id: 'record_reported',
    title: PLAYER_STATS_GENERAL.FOCUS.WORST_STAB,
    icon: ICONS.MAX_REPORTED,
    variant: 'info',
    getData: (stats, user): StatFocusData | null => {
      const record = stats.max_points_single_action_reported;
      if (!record) return null;
      const involvedName =
        record.involved_player_name || (record as any).involvedPlayerName;
      return {
        points: record.points,
        description: record.description,
        competitionName:
          record.competition_name || (record as any).competitionName,
        involvedName,
        date: record.date,
        prefixOverride: PLAYER_STATS_GENERAL.FOCUS.PREFIX_OVERRIDE,
        isMe: Boolean(
          involvedName &&
          user?.player?.display_name &&
          involvedName === user.player.display_name,
        ),
      };
    },
  },
];

export const PLAYER_STATS_CATEGORIES: CategoryConfig[] = [
  {
    title: 'Compétitions',
    metrics: [
      {
        id: 'ongoing_competitions',
        getLabel: () => 'En cours',
        icon: ICONS.ONGOING,
        getColor: () => 'text-success-bright',
        getValue: (s) => s.ongoing_competitions,
      },
      {
        id: 'upcoming_competitions',
        getLabel: () => 'À venir',
        icon: ICONS.UPCOMING,
        getColor: () => 'text-info-bright',
        getValue: (s) => s.upcoming_competitions,
      },
      {
        id: 'finished_competitions',
        getLabel: (s) => pluralize(s.finished_competitions, 'Terminée'),
        icon: ICONS.FINISHED,
        getColor: () => 'text-danger-bright',
        getValue: (s) => s.finished_competitions,
      },
    ],
  },
  {
    title: 'Responsabilités & Rôles',
    metrics: [
      {
        id: 'created_competitions',
        getLabel: (s) => pluralize(s.created_competitions, 'Créée'),
        icon: ICONS.CREATOR,
        getColor: () => 'text-role-creator-bright',
        getValue: (s) => s.created_competitions,
      },
      {
        id: 'refereed_competitions',
        getLabel: (s) => pluralize(s.refereed_competitions, 'Arbitrée'),
        icon: ICONS.REFEREE,
        getColor: () => 'text-role-referee-bright',
        getValue: (s) => s.refereed_competitions,
      },
    ],
  },
  {
    title: 'Rangs Historiques (Compétitions Closes)',
    metrics: [
      {
        id: 'min_rank',
        getLabel: () => 'Pire classement',
        icon: ICONS.WORST,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtRank(s.min_rank?.rank ?? null),
        getCompetitionName: (s) => s.max_rank?.competition_name,
        hint: {
          title: 'Pire classement',
          description:
            "Le fond du trou : ton classement le plus proche du titre de Blaireau d'Or lors des tournois passés.",
        },
      },
      {
        id: 'max_rank',
        getLabel: () => 'Meilleur classement',
        icon: ICONS.BEST,
        getColor: () => 'text-success-bright',
        getValue: (s) => fmtRank(s.max_rank?.rank ?? null),
        getCompetitionName: (s) => s.min_rank?.competition_name,
        hint: {
          title: 'Meilleur classement',
          description:
            'Ton classement le plus flatteur (le plus éloigné de la 1ère place) obtenu dans une arène close.',
        },
      },
    ],
  },
  {
    title: 'Section des Points',
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
        icon: ICONS.AVERAGE,
        getColor: () => 'text-info-bright',
        getValue: (s) => fmtPoints(s.average_points_per_competition),
      },
      {
        id: 'max_competition_score',
        getLabel: () => 'Pire score',
        icon: ICONS.WORST,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtPoints(s.max_competition_score?.points ?? 0),
        getCompetitionName: (s) => s.max_competition_score?.competition_name,
      },
      {
        id: 'min_comp_score',
        getLabel: () => 'Meilleur score',
        icon: ICONS.BEST,
        getColor: () => 'text-success-bright',
        getValue: (s) => fmtPoints(s.min_competition_score?.points ?? 0),
        getCompetitionName: (s) => s.min_competition_score?.competition_name,
      },
      {
        id: 'worst_avg',
        getLabel: () => 'Pire moyenne',
        icon: ICONS.WORST,
        getColor: () => 'text-danger-bright',
        getValue: (s) =>
          fmtPointsPerAction(s.max_avg_points_received?.average ?? 0),
        getSubtext: (s) =>
          s.max_avg_points_received
            ? `${s.max_avg_points_received.count} ${pluralize(s.max_avg_points_received.count, 'action')}`
            : undefined,
        getCompetitionName: (s) => s.max_avg_points_received?.competition_name,
      },
      {
        id: 'best_avg',
        getLabel: () => 'Meilleure moyenne',
        icon: ICONS.BEST,
        getColor: () => 'text-success-bright',
        getValue: (s) =>
          fmtPointsPerAction(s.min_avg_points_received?.average ?? 0),
        getSubtext: (s) =>
          s.min_avg_points_received
            ? `${s.min_avg_points_received.count} ${pluralize(s.min_avg_points_received.count, 'action')}`
            : undefined,
        getCompetitionName: (s) => s.min_avg_points_received?.competition_name,
      },
    ],
  },
  {
    title: 'Section des Actions',
    metrics: [
      {
        id: 'total_actions_received',
        getLabel: () => 'Total cumulé',
        icon: ICONS.ACTION,
        getColor: () => 'text-gold',
        getValue: (s) => fmtActions(s.total_actions_received),
      },
      {
        id: 'average_actions_received',
        getLabel: () => 'Moyenne / compétition',
        icon: ICONS.AVERAGE,
        getColor: () => 'text-info-bright',
        getValue: (s) => fmtActions(s.average_actions_received_per_competition),
      },
      {
        id: 'max_competition_actions',
        getLabel: () => "Nb max d'actions",
        icon: ICONS.WORST,
        getColor: () => 'text-danger-bright',
        getValue: (s) =>
          fmtActions(s.max_competition_actions_received?.points ?? 0),
        getCompetitionName: (s) =>
          s.max_competition_actions_received?.competition_name,
      },
      {
        id: 'min_competition_actions',
        getLabel: () => "Nb min d'actions",
        icon: ICONS.BEST,
        getColor: () => 'text-success-bright',
        getValue: (s) =>
          fmtActions(s.min_competition_actions_received?.points ?? 0),
        getCompetitionName: (s) =>
          s.min_competition_actions_received?.competition_name,
      },
    ],
  },
  {
    title: 'Section de la Délation',
    metrics: [
      {
        id: 'total_actions_reported',
        getLabel: () => 'Signalements envoyés',
        icon: ICONS.SEND,
        getColor: () => 'text-gold',
        getValue: (s) => fmtActions(s.total_actions_reported, 'envoi'),
      },
      {
        id: 'report_approval_ratio',
        getLabel: () => 'Précision de tir',
        icon: ICONS.PRECISION,
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
        icon: ICONS.KARMA,
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
    title: 'Écosystème Relationnel & Rivalités',
    metrics: [
      {
        id: 'total_distinct_targets',
        getLabel: () => 'Tableau de chasse',
        icon: ICONS.PLAYERS,
        getColor: () => 'text-silver',
        getValue: (s) => s.total_distinct_targets,
        getSubtext: (s) =>
          `${s.total_distinct_targets} ${pluralize(s.total_distinct_targets, 'victime différente', 'victimes différentes')}`,
        hint: {
          title: 'Tableau de chasse',
          description:
            "Le nombre d'adversaires différents que tu as réussi à épingler (et faire valider) au cours de ta carrière.",
        },
      },
      {
        id: 'main_enemy',
        getLabel: () => 'Mon pire bourreau',
        icon: ICONS.SKULL,
        getColor: () => 'text-danger-bright',
        getValue: (s) =>
          s.max_reports_from_single_actor?.player_name || 'Aucun',
        getSubtext: (s) =>
          s.max_reports_from_single_actor
            ? `${s.max_reports_from_single_actor.count} ${pluralize(s.max_reports_from_single_actor.count, 'dénonciation')}`
            : '0 dénnociation',
        hint: {
          title: 'Mon pire bourreau',
          description:
            "Le joueur qui t'a le plus souvent aligné et envoyé au piquet tout au long de ta carrière.",
        },
      },
      {
        id: 'favorite_victim',
        getLabel: () => 'Mon souffre-douleur',
        icon: ICONS.TARGET,
        getColor: () => 'text-warning-bright',
        getValue: (s) =>
          s.max_reports_to_single_receiver?.player_name || 'Aucun',
        getSubtext: (s) =>
          s.max_reports_to_single_receiver
            ? `${s.max_reports_to_single_receiver.count} ${pluralize(s.max_reports_to_single_receiver.count, 'dénonciation')}`
            : '0 dénonciation',
        hint: {
          title: 'Mon souffre-douleur',
          description:
            'Ta cible favorite. Le joueur que tu as le plus souvent balancé tout au long de ta carrière.',
        },
      },
      {
        id: 'vendetta',
        getLabel: () => 'Mon rival',
        icon: ICONS.STAB,
        getColor: () => 'text-info-bright',
        getValue: (s) =>
          s.max_reciprocal_reports_with_single_peer?.player_name || 'Aucune',
        getSubtext: (s) =>
          s.max_reciprocal_reports_with_single_peer
            ? `${s.max_reciprocal_reports_with_single_peer.reciprocal_score} ${pluralize(s.max_reciprocal_reports_with_single_peer.reciprocal_score, 'coup rendu')} (${s.max_reciprocal_reports_with_single_peer.total_sent} émis / ${s.max_reciprocal_reports_with_single_peer.total_received} subis)`
            : '0 échange',
        hint: {
          title: 'Mon rival',
          description:
            "Récidive symétrique pure : la personne avec qui tu as le plus haut score d'échange réciproque.",
        },
      },
    ],
  },
];
