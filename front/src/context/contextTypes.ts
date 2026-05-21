import type { PlayerCompact } from '@/features/player';
import type {
  Competition,
  BonusDay,
  EnrichedLeaderboardItem,
  Action,
  ActionSortField,
  ActionFormData,
  User,
  LoginCredentials,
  AuthResult,
} from '@/types';
import type { Dispatch, SetStateAction } from 'react';

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AdminContextType {
  isFogActive: boolean;
  isUpdating: boolean;
  pendingCount: number;
  handleToggleFog: () => void;
  handleCloseCompetition: () => void;
}

export interface CompetitionContextType {
  competition: Competition;
  leaderboard: EnrichedLeaderboardItem[];
  bonusDays: BonusDay[];
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
  getMultiplier: (date: string | null) => number | undefined;
  getTodayBonus: () => BonusDay | undefined;
}

export interface ActionTableContextType {
  categories: {
    myPending: Action[];
    othersPending: Action[];
    validated: Action[];
    rejected: Action[];
  };
  availableDates: string[];
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
  totalActions: number;
  isLoadingActions: boolean;
  loadMoreRef: (node?: Element | null) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  handleSort: (field: ActionSortField) => void;
  getAriaSort: (
    field: ActionSortField,
  ) => 'ascending' | 'descending' | undefined;
  getSortIndicator: (field: ActionSortField) => {
    char: string;
    className: string;
  };
}

export interface ReportingContextType {
  isReporting: boolean;
  toggleReporting: () => void;
  potentialTargets: PlayerCompact[];
}

export interface ReportActionContextType {
  formData: ActionFormData;
  loading: boolean;
  dateLimits: { minDate: string; maxDate: string };
  setFormData: React.Dispatch<React.SetStateAction<ActionFormData>>;
  submitReport: () => Promise<void>;
  search: string;
  setSearch: (val: string) => void;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  filteredPlayers: PlayerCompact[];
  selectPlayer: (id: string, name: string) => void;
}
