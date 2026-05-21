import type { Action } from '@/features/competition';

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

export const getUniqueDates = (actions: Action[]) => {
  const dates = new Set(actions.map((a) => a.date_action.split('T')[0]));
  return Array.from(dates).sort((a, b) => a.localeCompare(b));
};
