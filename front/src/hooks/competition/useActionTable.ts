import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks';
import { getUniqueDates } from '@/utils';
import { ActionStatus, type Action, type User } from '@/types';

type ActionSortField =
  | 'date_action'
  | 'player'
  | 'points'
  | 'status'
  | 'description';

export const useActionTable = (initialActions: Action[]) => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<string>('date_action');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getEntityId = (
    entity: User | string | undefined | null,
  ): string | undefined =>
    typeof entity === 'string' ? entity.split('/').pop() : entity?.id;

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
      const getValue = (action: Action): string | number => {
        switch (sortField) {
          case 'player':
            return action.player?.display_name || '';
          case 'points':
            return action.points;
          case 'date_action':
          case 'status':
          case 'description':
            return action[sortField] || '';
          default:
            return '';
        }
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

    return {
      myPending: pending.filter((a) => getEntityId(a.created_by) === user?.id),
      othersPending: pending.filter(
        (a) => getEntityId(a.created_by) !== user?.id,
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
    sortInfo: { field: sortField, order: sortOrder },
  };
};
