// front/src/hooks/competition/useActionTable.ts
import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks';
import { type Action, getUniqueDates } from '@/utils';

export const useActionTable = (initialActions: Action[]) => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<string>('date_action');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getEntityId = (entity: any) =>
    typeof entity === 'string' ? entity.split('/').pop() : entity?.id;

  // 1. Dates disponibles pour le filtre
  const availableDates = useMemo(
    () => getUniqueDates(initialActions),
    [initialActions],
  );

  // 2. Tri et filtrage par date
  const processedActions = useMemo(() => {
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
      const comp = valA.localeCompare(valB, 'fr', { sensitivity: 'base' });
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [initialActions, sortField, sortOrder, selectedDate]);

  // 3. Répartition par catégories (Le cœur du YAGNI Logic)
  const categories = useMemo(() => {
    const pending = processedActions.filter((a) => a.status === 'pending');

    return {
      myPending: pending.filter((a) => getEntityId(a.created_by) === user?.id),
      othersPending: pending.filter(
        (a) => getEntityId(a.created_by) !== user?.id,
      ),
      validated: processedActions.filter((a) => a.status === 'validated'),
      rejected: processedActions.filter((a) => a.status === 'rejected'),
      totalPending: pending.length,
    };
  }, [processedActions, user]);

  const handleSort = (field: string) => {
    if (field === sortField) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

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
