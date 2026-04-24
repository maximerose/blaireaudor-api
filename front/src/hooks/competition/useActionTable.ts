import { useState, useMemo } from 'react';
import { type Action, getUniqueDates } from '@/utils';

export const useActionTable = (initialActions: Action[]) => {
  const [sortField, setSortField] = useState<string>('date_action');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const availableDates = useMemo(
    () => getUniqueDates(initialActions),
    [initialActions],
  );

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedActions = useMemo(() => {
    let result = [...initialActions];

    if (selectedDate) {
      result = result.filter((a) => a.date_action.startsWith(selectedDate));
    }

    return result.sort((a: any, b: any) => {
      const valA =
        sortField === 'player'
          ? a.player?.display_name || ''
          : String(a[sortField] || '');
      const valB =
        sortField === 'player'
          ? b.player?.display_name || ''
          : String(b[sortField] || '');
      const comparison = valA.localeCompare(valB, 'fr', {
        sensitivity: 'base',
      });

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [initialActions, sortField, sortOrder, selectedDate]);

  const getAriaSort = (field: string) => {
    if (sortField !== field) return undefined;
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  const getSortIndicator = (field: string) => {
    if (sortField !== field) {
      return { char: '↕', className: 'ml-1 opacity-10 transition-default' };
    }
    return {
      char: sortOrder === 'asc' ? '↑' : '↓',
      className: 'ml-1 text-gold animate-fade-in transition-default',
    };
  };

  return {
    sortedActions,
    sortField,
    sortOrder,
    handleSort,
    selectedDate,
    setSelectedDate,
    availableDates,
    getAriaSort,
    getSortIndicator,
  };
};
