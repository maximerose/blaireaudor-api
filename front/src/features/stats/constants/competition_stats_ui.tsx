/* eslint-disable react-refresh/only-export-components */
import { ICONS, pluralize, withIconPrefix, withIconSuffix } from '@/shared';
import type { CompCategoryConfig } from '@/features/stats/types';

// ---------------------------------------------------------
// 1. TEXTES GLOBAUX
// ---------------------------------------------------------
export const COMPETITION_STATS_GENERAL = {
  CHART: {
    TITLE: 'Évolution des rangs',
    EMPTY: "L'arène est trop calme, aucune donnée à analyser.",
    FOG_WARNING:
      "Les statistiques et l'évolution temporelle sont masquées jusqu'à la levée du brouillard de guerre par l'arbitre.",
    HELP_HINT: withIconPrefix(
      ICONS.HINT,
      'Astuce : Clique sur les noms dans la légende ci-dessous pour masquer/afficher leurs courbes.',
    ),
    FULLSCREEN_HELP: withIconPrefix(
      ICONS.ROTATE,
      'Plein écran activé. Tournez votre appareil en mode paysage pour une meilleure lecture.',
    ),
    BTN_MAXIMIZE: withIconPrefix(ICONS.MAXIMIZE, 'Agrandir'),
    BTN_OPEN: '🔍 Ouvrir le graphique',
    BTN_CLOSE: withIconSuffix('Fermer', ICONS.CANCEL),
    TOGGLE_RANKS: 'Évolution des rangs',
    TOGGLE_POINTS: 'Évolution des points',
  },
  FILTERS: {
    ME: 'Moi',
    TOP3: 'Le Top 3',
    TOP5: 'Le Top 5',
    TOP10: 'Le Top 10',
    ALL: (count: number) => `Tous (${count})`,
  },
  PROGRESS_BANNER: {
    TITLE: 'Mon Bilan Actuel',
    SCORE: 'Mon Score',
    RANK: 'Mon Classement',
    ACTIONS: (count: number) =>
      pluralize(count, 'Action réalisée', 'Actions réalisées'),
    GAP: 'Écart avec le 1er',
    BOSS_LABEL: "Tu es le blaireau d'or",
  },
  FOCUS: {
    SECTION_TITLE: "L'Action du Siècle",
    RECORD: 'Le Casse du Siècle (Bonus Inclus)',
    PREFIX_OVERRIDE: 'Victime : ',
  },
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

const fmtPointsPerAction = (pts: number) => (
  <span className="flex items-baseline justify-center gap-1">
    {pts}{' '}
    <span className="text-[10px] opacity-50 font-normal lowercase">
      pts / action
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

const fmtNames = (names?: string[]) => {
  if (!names || names.length === 0) return 'Aucun';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} et ${names[1]}`;
  return `${names.length} ex-aequo`;
};

// ---------------------------------------------------------
// 3. LA CONFIGURATION PILOTE
// ---------------------------------------------------------

export const COMPETITION_STATS_CATEGORIES: CompCategoryConfig[] = [
  {
    title: 'Volumes & Sévérité',
    metrics: [
      {
        id: 'total_players',
        getLabel: () => 'Joueurs engagés',
        icon: ICONS.PLAYERS,
        getColor: () => 'text-silver',
        getValue: (s) => s.total_players,
      },
      {
        id: 'total_points',
        getLabel: () => 'Points distribués',
        icon: ICONS.POINTS,
        getColor: () => 'text-gold',
        getValue: (s) => fmtPoints(s.total_points),
      },
      {
        id: 'total_actions',
        getLabel: () => 'Actions validées',
        icon: ICONS.ACTION,
        getColor: () => 'text-info-bright',
        getValue: (s) => s.total_actions,
      },
      {
        id: 'avg_severity',
        getLabel: () => 'Sévérité moyenne',
        icon: ICONS.AVERAGE,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtPointsPerAction(s.average_points_per_action),
        hint: {
          title: 'Sévérité moyenne',
          description:
            'Nombre moyen de points attribués par action validée au sein de cette arène.',
        },
      },
    ],
  },
  {
    title: 'Le Livre des Records',
    metrics: [
      {
        id: 'grand_recidivist',
        getLabel: () => 'Grand Récidiviste',
        icon: ICONS.CROWN,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtNames(s.max_actions_received?.player_names),
        getSubtext: (s) =>
          s.max_actions_received
            ? `${s.max_actions_received.count} ${pluralize(s.max_actions_received.count, 'action')}`
            : undefined,
        hint: {
          title: 'Grand Récidiviste',
          description:
            "La cible préférée de l'arène. Le joueur ayant réalisé le plus grand nombre total d'actions validées.",
        },
      },

      {
        id: 'angel_arena',
        getLabel: () => "Ange de l'Arène",
        icon: ICONS.GHOST,
        getColor: () => 'text-success-bright',
        getValue: (s) => fmtNames(s.min_actions_received?.player_names),
        getSubtext: (s) =>
          s.min_actions_received
            ? `${s.min_actions_received.count} ${pluralize(s.min_actions_received.count, 'action')}`
            : undefined,
        hint: {
          title: "Ange de l'Arène",
          description:
            "Le participant fantôme ou miraculé ayant subi le moins d'infractions validées tout au long du tournoi.",
        },
      },
      {
        id: 'golden_balance',
        getLabel: () => "Balance d'Or",
        icon: ICONS.REPORTS,
        getColor: () => 'text-warning-bright',
        getValue: (s) => fmtNames(s.max_actions_reported?.player_names),
        getSubtext: (s) =>
          s.max_actions_reported
            ? `${s.max_actions_reported.count} ${pluralize(s.max_actions_reported.count, 'dénonciation')}`
            : undefined,
        hint: {
          title: "Balance d'Or",
          description:
            'Le joueur le plus bavard. Celui ayant envoyé et fait valider le plus grand nombre de dénonciations.',
        },
      },
      {
        id: 'max_points_reported',
        getLabel: () => 'Dénonciateur de Choc',
        icon: ICONS.ZAP,
        getColor: () => 'text-gold',
        getValue: (s) => fmtNames(s.max_points_reported?.player_names),
        getSubtext: (s) =>
          s.max_points_reported
            ? `${s.max_points_reported.points} pts générés`
            : undefined,
        hint: {
          title: 'Dénonciateur de Choc',
          description:
            'Le joueur ayant cumulé le plus grand nombre de points validés infligés à ses cibles grâce à ses dossiers.',
        },
      },
      {
        id: 'min_avg_points_received',
        getLabel: () => 'Meilleure moyenne subie',
        icon: ICONS.TRENDING_UP,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtNames(s.min_avg_points_received?.player_names),
        getSubtext: (s) =>
          s.min_avg_points_received
            ? `${s.min_avg_points_received.average} pts / action (${s.min_avg_points_received.count} ${pluralize(s.min_avg_points_received.count, 'action')})`
            : undefined,
        hint: {
          title: 'Meilleure moyenne subie',
          description:
            'Le joueur ayant reçu les sanctions les plus légères en moyenne. Ses méfaits sont de faible gravité.',
        },
      },
      {
        id: 'max_avg_points_received',
        getLabel: () => 'Pire moyenne subie',
        icon: ICONS.TRENDING_DOWN,
        getColor: () => 'text-success-bright',
        getValue: (s) => fmtNames(s.max_avg_points_received?.player_names),
        getSubtext: (s) =>
          s.max_avg_points_received
            ? `${s.max_avg_points_received.average} pts / action (${s.max_avg_points_received.count} ${pluralize(s.max_avg_points_received.count, 'action')})`
            : undefined,
        hint: {
          title: 'Pire moyenne subie',
          description:
            'Le joueur frappé par les plus lourdes sanctions en moyenne. Chacune de ses erreurs coûte très cher.',
        },
      },
      {
        id: 'paria',
        getLabel: () => 'Le Paria',
        icon: ICONS.TARGET,
        getColor: () => 'text-info-bright',
        getValue: (s) =>
          fmtNames(s.max_distinct_informers_received?.player_names),
        getSubtext: (s) =>
          s.max_distinct_informers_received
            ? `ciblé par ${s.max_distinct_informers_received.count} ${pluralize(s.max_distinct_informers_received.count, 'balance')}`
            : undefined,
        hint: {
          title: 'Le Paria',
          description:
            'Le joueur pris en grippe par la bande. Ciblé par le plus grand nombre de dénonciateurs distincts.',
        },
      },
      {
        id: 'omerta',
        getLabel: () => "L'Omertà",
        icon: ICONS.SECRET,
        getColor: () => 'text-silver',
        getValue: (s) => fmtNames(s.min_actions_reported?.player_names),
        getSubtext: (s) =>
          s.min_actions_reported
            ? `${s.min_actions_reported.count} ${pluralize(s.min_actions_reported.count, 'dénonciation')}`
            : undefined,
        hint: {
          title: "L'Omertà",
          description:
            "Le joueur le plus silencieux. Celui qui a fait preuve d'une loyauté aveugle en envoyant le moins de signalements. (Réservé aux joueurs connectés)",
        },
      },
    ],
  },
  {
    title: 'Précision & Stratégie',
    metrics: [
      {
        id: 'opportunism',
        getLabel: () => "Effet d'aubaine",
        icon: ICONS.BONUS,
        getColor: () => 'text-warning-bright',
        getValue: (s) => fmtPercent(s.bonus_actions_ratio),
        hint: {
          title: "Effet d'aubaine",
          description:
            "Pourcentage du volume global d'actions réalisées spécifiquement lors des Jours Bonus programmés.",
        },
      },
      {
        id: 'sniper',
        getLabel: () => 'Le Sniper',
        icon: ICONS.PRECISION,
        getColor: () => 'text-success-bright',
        getValue: (s) => fmtNames(s.max_approval_ratio?.player_names),
        getSubtext: (s) =>
          s.max_approval_ratio
            ? `${s.max_approval_ratio.ratio}% de réussite sur ${s.max_approval_ratio.total} envois`
            : undefined,
        hint: {
          title: 'Le Sniper (Précision)',
          description:
            "Le joueur (minimum 2 rapports) ayant le meilleur taux de validation de ses signalements par l'arbitrage.",
        },
      },
      {
        id: 'calomniator',
        getLabel: () => 'Le Calomniateur',
        icon: ICONS.TRASH,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtNames(s.max_rejected_reports?.player_names),
        getSubtext: (s) =>
          s.max_rejected_reports
            ? `${s.max_rejected_reports.count} ${pluralize(s.max_rejected_reports.count, 'rejet')}`
            : undefined,
        hint: {
          title: 'Le Calomniateur',
          description:
            'Le joueur ayant essuyé le plus grand nombre de signalements refusés ou classés sans suite.',
        },
      },
    ],
  },

  {
    title: 'Écosystème Relationnel',
    metrics: [
      {
        id: 'max_reciprocal_target_pair',
        getLabel: () => 'Pire Rivalité',
        icon: ICONS.STAB,
        getColor: () => 'text-danger-bright',
        getValue: (s) => fmtNames(s.max_reciprocal_target_pair?.pair_names),
        getSubtext: (s) =>
          s.max_reciprocal_target_pair
            ? `${s.max_reciprocal_target_pair.reciprocal_score} ${pluralize(s.max_reciprocal_target_pair.reciprocal_score, 'coup rendu')} (${s.max_reciprocal_target_pair.total_exchanges} échanges)`
            : undefined,
        hint: {
          title: 'Pire Rivalité (Vendetta)',
          description:
            'Le duo qui a passé le plus clair de son temps à se venger mutuellement (donnant-donnant).',
        },
      },
      {
        id: 'max_unique_targets_reported',
        getLabel: () => "L'Œil de Moscou",
        icon: ICONS.EYE,
        getColor: () => 'text-warning-bright',
        getValue: (s) => fmtNames(s.max_unique_targets_reported?.player_names),
        getSubtext: (s) =>
          s.max_unique_targets_reported
            ? `A ciblé ${s.max_unique_targets_reported.count} ${pluralize(s.max_unique_targets_reported.count, 'joueur différent', 'joueurs différents')}`
            : undefined,
        hint: {
          title: "L'Œil de Moscou",
          description:
            "Le joueur qui a ciblé le plus grand nombre d'adversaires différents. Personne ne lui échappe.",
        },
      },
    ],
  },
];
