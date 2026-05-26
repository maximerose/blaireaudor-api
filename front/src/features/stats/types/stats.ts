import type React from 'react';
import type { PlayerStats } from '@/features/account/types';
import type { EnrichedLeaderboardItem } from '@/features/competition/types';

// --- TYPES DE BASE (MODALES & KPIs) ---
export interface HintModalData {
  title: string;
  description: string;
}

export interface MetricItem {
  id: string;
  label: string;
  val: React.ReactNode | string | number;
  icon: string | React.ReactNode;
  color: string;
  subtext?: string;
  hint?: HintModalData;
}

export interface CategoryItem {
  title: string;
  metrics: MetricItem[];
}

// --- CONFIGURATIONS DES DICTIONNAIRES (Data-Driven UI) ---
export type StatConfig = {
  id: string;
  getLabel: (stats: PlayerStats) => string;
  icon: string | React.ReactNode;
  getColor: (stats: PlayerStats) => string;
  getValue: (stats: PlayerStats) => React.ReactNode | string | number;
  getSubtext?: (stats: PlayerStats) => string | undefined;
  hint?: HintModalData;
};

export type CategoryConfig = {
  title: string;
  metrics: StatConfig[];
};

export type CompStatConfig = {
  id: string;
  getLabel: () => string;
  icon: string | React.ReactNode;
  getColor: () => string;
  getValue: (stats: any) => React.ReactNode | string | number;
  getSubtext?: (stats: any) => string | undefined;
  hint?: HintModalData;
};

export type CompCategoryConfig = {
  title: string;
  metrics: CompStatConfig[];
};

// --- TYPES DES GRAPHIQUES ET CARTES ---
export type ChartFilter = 'me' | 'top3' | 'top5' | 'top10' | 'all';

export interface ChartDataPoint {
  date: string;
  rawScores?: Record<string, number>;
  [playerId: string]: string | number | Record<string, number> | undefined;
}

export interface StatFocusData {
  points: number;
  description: string;
  involvedName: string | null;
  competitionName?: string | null;
  date?: string | null;
  prefixOverride?: string;
  isMe: boolean;
}

export interface CompetitionChartTooltipProps {
  active?: boolean;
  payload?: readonly any[];
  label?: string | number;
  isPointsMode: boolean;
}

// --- PROPS DES COMPOSANTS ---
export interface StatFocusCardProps {
  title: string;
  data: StatFocusData | null;
  icon: string | React.ReactNode;
  variant: 'danger' | 'info';
}

export interface ProgressBannerProps {
  myParticipation: EnrichedLeaderboardItem;
  leaderboard: EnrichedLeaderboardItem[];
  myPlayerId: string | undefined;
}

export interface AnalyticChartProps {
  bumpData: ChartDataPoint[];
  dailyEvolution: ChartDataPoint[];
  leaderboard: EnrichedLeaderboardItem[];
  myPlayerId: string | undefined;
  hiddenLines: Record<string, boolean>;
  onLegendClick: (dataKey: string) => void;
  activeFilter: string;
  onFilterChange: (filter: ChartFilter) => void;
  isFullscreen: boolean;
  onOpenFullscreen: () => void;
  onCloseFullscreen: () => void;
}

export interface CompetitionChartLegendProps {
  leaderboard: EnrichedLeaderboardItem[];
  hiddenLines: Record<string, boolean>;
  myPlayerId: string | undefined;
  onLegendClick: (dataKey: string) => void;
}

export interface KpiGridProps {
  categories: CategoryItem[];
  onCardClick: (hint: HintModalData) => void;
}

export interface StatCardProps {
  metric: MetricItem;
  onClick?: () => void;
}
