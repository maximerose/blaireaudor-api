import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks';
import { getUniqueDates, getIdFromData } from '@/utils';
import { ActionStatus, type Action, type ActionSortField } from '@/types';

export const useActionTable = (initialActions: Action[]) => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<ActionSortField>('date_action');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const availableDates = useMemo(
    () => getUniqueDates(initialActions),
    [initialActions],
  );

  const processedActions = useMemo(() => {
    let result = [...initialActions];
    if (selectedDate) {
      result = result.filter((a) => a.date_action.startsWith(selectedDate));
    }

    return result.sort((a, b) => {
      const getValue = (action: Action) => {
        if (sortField === 'player') return action.player?.display_name || '';
        return action[sortField as keyof Action] || '';
      };

      const valA = getValue(a);
      const valB = getValue(b);

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      const comp = String(valA).localeCompare(String(valB), 'fr', {
        sensitivity: 'base',
      });
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [initialActions, sortField, sortOrder, selectedDate]);

  const categories = useMemo(() => {
    const pending = processedActions.filter(
      (a) => a.status === ActionStatus.PENDING,
    );
    const userId = user?.id;

    return {
      myPending: pending.filter((a) => getIdFromData(a.created_by) === userId),
      othersPending: pending.filter(
        (a) => getIdFromData(a.created_by) !== userId,
      ),
      validated: processedActions.filter(
        (a) => a.status === ActionStatus.VALIDATED,
      ),
      rejected: processedActions.filter(
        (a) => a.status === ActionStatus.REJECTED,
      ),
      totalPending: pending.length,
    };
  }, [processedActions, user]);

  // --- Helpers pour le TableHeader ---
  const handleSort = (field: ActionSortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getAriaSort = (field: ActionSortField) => {
    if (sortField !== field) return undefined;
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  const getSortIndicator = (field: ActionSortField) => {
    if (sortField !== field) {
      return { char: '↕', className: 'ml-1 opacity-10 transition-default' };
    }
    return {
      char: sortOrder === 'asc' ? '↑' : '↓',
      className: 'ml-1 text-gold animate-fade-in transition-default',
    };
  };

  return {
    categories,
    selectedDate,
    setSelectedDate,
    availableDates,
    handleSort,
    getAriaSort,
    getSortIndicator,
  };
};
