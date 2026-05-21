import type { PlayerCompact } from '@/features/player';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ReportActionFormData } from '@/features/competition';

export const ActionStatus = {
  PENDING: 'pending',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
} as const;

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus];
export type ActionSortField =
  | 'date_action'
  | 'player'
  | 'points'
  | 'status'
  | 'description';

export interface Action {
  id: string;
  description: string;
  points: number;
  date_action: string;
  player_id: string;
  player_name: string;
  status: ActionStatus;
  created_by_id: string;
  creator_name?: string;
}

/**
 * PAYLOADS (Transfert de données vers l'API)
 */
export interface ActionCreatePayload {
  description: string;
  points: number;
  date_action: string;
  player: string;
  competition?: string;
  status?: ActionStatus;
}

export type ActionUpdatePayload = Partial<
  Omit<ActionCreatePayload, 'player'> & {
    status: ActionStatus;
    player: string;
  }
>;

export interface ActionUpdateStatusPayload {
  actionId: string;
  status: ActionStatus;
}

export interface ActionFormData {
  targetPlayerId: string;
  description: string;
  points: number;
  dateAction: string;
}

export type OnActionUpdate = (
  id: string,
  data: ActionUpdatePayload,
) => Promise<{ ok: boolean; data: Action }>;
export type OnActionStatusChange = (id: string, status: ActionStatus) => void;

export interface ActionRowProps {
  action: Action;
  onUpdate: OnActionUpdate;
  onStatusChange: OnActionStatusChange;
}

export interface ActionEditData {
  description: string;
  points: number | string;
}

export interface DateNavigationProps {
  dates: string[];
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
}

export interface GetActionsParams {
  id: string;
  page?: number;
  selectedDate?: string | null;
  selectedPlayerId?: string | null;
  sortField?: string | null;
  sortOrder?: 'asc' | 'desc';
  signal?: AbortSignal;
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

export interface ReportActionContextType {
  register: UseFormRegister<ReportActionFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<ReportActionFormData>;
  loading: boolean;
  dateLimits: { minDate: string; maxDate: string };
  search: string;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  filteredPlayers: PlayerCompact[];
  selectPlayer: (id: string, name: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
