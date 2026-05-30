/* eslint-disable react-refresh/only-export-components */
import { RankBadge } from '@/features/competition/leaderboard';
import type {
  CompCategoryConfig,
  ProgressBannerConfig,
} from '@/features/stats/types';
import { ICONS, pluralize } from '@/shared';

// ---------------------------------------------------------
// 1. TEXTES GLOBAUX
// ---------------------------------------------------------
export const COMPETITION_STATS_GENERAL = {
  CHART: {
    TITLE: 'Évolution des rangs',
    EMPTY: "L'arène est trop calme, aucune donnée à analyser.",
    FOG_WARNING:
      "Les statistiques et l'évolution temporelle sont masquées jusqu'à la levée du brouillard de guerre par l'arbitre.",
    HELP_HINT:
      'Astuce : Clique sur les noms dans la légende ci-dessous pour masquer/afficher leurs courbes.',
    FULLSCREEN_HELP:
      'Plein écran activé. Tournez votre appareil en mode paysage pour une meilleure lecture.',
    BTN_MAXIMIZE: 'Agrandir',
    BTN_CLOSE: 'Fermer',
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
    ACTIONS: 'Actions subies',
    GAP: 'Écart avec le 1er',
    BOSS_LABEL: 'Le boss',
    SEVERITY: 'Sévérité moyenne',
    WEIGHT: "Poids dans l'arène",
    HINTS: {
      SCORE:
        'La somme totale de tes points de pénalité validés par les arbitres dans cette arène.',
      GAP: 'Le nombre de points exact qui te séparent du joueur en tête de la compétition.',
      RANK: 'Ta position actuelle dans le classement (les ex-aequo obtiennent le même rang).',
      ACTIONS:
        'Le nombre total de tes actions/fautes qui ont été officiellement validées.',
      SEVERITY:
        "Le nombre moyen de points que te coûte chaque action validée (Total des points / Nombre d'actions).",
      WEIGHT:
        "La part que représente ton score par rapport à la totalité des points distribués dans l'arène.",
    },
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
const fmtPoints = (pts: number | string) => (
  <span className="flex items-baseline justify-center gap-1">
    {pts} <span className="text-xs opacity-50 font-normal lowercase">pts</span>
  </span>
);

const fmtPointsPerAction = (pts: number | string) => (
  <span className="flex items-baseline justify-center gap-1">
    {pts}{' '}
    <span className="text-xs opacity-50 font-normal lowercase">
      pts / action
    </span>
  </span>
);

const fmtPercent = (val: number | string | null) =>
  val !== null ? (
    <span className="flex items-baseline justify-center gap-1">
      {val} <span className="text-xs opacity-50 font-normal lowercase">%</span>
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

const fmtPairs = (pairs?: { player1: string; player2: string }[]) => {
  if (!pairs || pairs.length === 0) return 'Aucune';
  if (pairs.length === 1) {
    return (
      <span className="flex flex-col items-center justify-center gap-1.5 text-[0.85em]">
        <span className="truncate">{pairs[0].player1}</span>
        <span
          className="text-danger-bright opacity-80 shrink-0 animate-pulse-subtle"
          aria-hidden="true"
        >
          {ICONS.STAB}
        </span>
        <span className="truncate">{pairs[0].player2}</span>
      </span>
    );
  }
  return `${pairs.length} paires ex-aequo`;
};

// ---------------------------------------------------------
// 3. LA CONFIGURATION PILOTE
// ---------------------------------------------------------

export const PROGRESS_BANNER_METRICS: ProgressBannerConfig[] = [
  {
    id: 'score',
    getLabel: () => COMPETITION_STATS_GENERAL.PROGRESS_BANNER.SCORE,
    icon: ICONS.POINTS,
    getColor: () => 'text-gold',
    getValue: (data) => fmtPoints(data.score),
    hint: {
      title: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.SCORE,
      description: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.HINTS.SCORE,
    },
  },
  {
    id: 'gap',
    getLabel: () => COMPETITION_STATS_GENERAL.PROGRESS_BANNER.GAP,
    icon: ICONS.GAP,
    getColor: (data) =>
      data.pointsBehind > 0 ? 'text-danger-bright' : 'text-success-bright',
    getValue: (data) =>
      data.pointsBehind > 0 ? (
        <span className="flex items-baseline justify-center gap-1">
          -{data.pointsBehind}{' '}
          <span className="text-xs font-normal opacity-50 lowercase">pts</span>
        </span>
      ) : (
        <span className="text-[0.6em] whitespace-nowrap">
          {COMPETITION_STATS_GENERAL.PROGRESS_BANNER.BOSS_LABEL}
        </span>
      ),
    hint: {
      title: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.GAP,
      description: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.HINTS.GAP,
    },
  },
  {
    id: 'rank',
    getLabel: () => COMPETITION_STATS_GENERAL.PROGRESS_BANNER.RANK,
    icon: ICONS.RANKING,
    getColor: () => '',
    getValue: (data) => (
      <RankBadge rank={data.rank} className="scale-[1.3] m-auto" />
    ),
    hint: {
      title: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.RANK,
      description: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.HINTS.RANK,
    },
  },
  {
    id: 'actions',
    getLabel: () => COMPETITION_STATS_GENERAL.PROGRESS_BANNER.ACTIONS,
    icon: ICONS.ACTION,
    getColor: () => 'text-info-bright',
    getValue: (data) => data.actionsCount,
    hint: {
      title: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.ACTIONS,
      description: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.HINTS.ACTIONS,
    },
  },
  {
    id: 'severity',
    getLabel: () => COMPETITION_STATS_GENERAL.PROGRESS_BANNER.SEVERITY,
    icon: ICONS.CALCULATOR,
    getColor: () => 'text-danger-bright',
    getValue: (data) => fmtPointsPerAction(data.averageSeverity),
    hint: {
      title: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.SEVERITY,
      description: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.HINTS.SEVERITY,
    },
  },
  {
    id: 'weight',
    getLabel: () => COMPETITION_STATS_GENERAL.PROGRESS_BANNER.WEIGHT,
    icon: ICONS.KARMA,
    getColor: () => 'text-warning-bright',
    getValue: (data) => fmtPercent(data.arenaWeight),
    hint: {
      title: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.WEIGHT,
      description: COMPETITION_STATS_GENERAL.PROGRESS_BANNER.HINTS.WEIGHT,
    },
  },
];

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
        getValue: (s) => fmtPairs(s.max_reciprocal_target_pair?.pairs),
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
