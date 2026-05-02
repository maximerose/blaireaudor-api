import type { User } from '@/context/AuthContext';

export interface Action {
  id: string;
  description: string;
  points: number;
  date_action: string;
  player?: { id: string; display_name: string };
  status: string;
  created_by: User | string;
}

/**
 * Groupe les action par date
 */
export const groupActionsByDate = (actions: Action[]) => {
  return actions.reduce((groups: Record<string, Action[]>, action) => {
    const date = action.date_action.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(action);
    return groups;
  }, {});
};

/**
 * Formate une date en "Lundi 19 avril"
 */
export const formatLongDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(dateStr));
};

export const getUniqueDates = (actions: Action[]) => {
  const dates = new Set(actions.map((a) => a.date_action.split('T')[0]));
  return Array.from(dates).sort((a, b) => a.localeCompare(b));
};
