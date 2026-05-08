import { useState, useMemo } from 'react';
import { useAuth, useInfiniteActions } from '@/hooks';
import { getIdFromData } from '@/utils';
import { ActionStatus, type Action, type ActionSortField } from '@/types';
import { competitionService } from '@/services/api/competitionService';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

export const useActionTable = (competitionId: string | undefined) => {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortField, setSortField] = useState<ActionSortField>('date_action');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: availableDates = [] } = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId).actionDates,
    queryFn: () => competitionService.getActionsDates(competitionId!),
    enabled: !!competitionId,
  });

  const {
    actions,
    totalActions,
    isLoadingActions,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteActions(competitionId, selectedDate);

  const processedActions = useMemo(() => {
    const result = [...actions];

    return result.sort((a, b) => {
      const getValue = (action: Action) => {
        if (sortField === 'player') return action.player_name || '';
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
  }, [actions, sortField, sortOrder]);

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
    availableDates,
    selectedDate,
    setSelectedDate,
    totalActions,
    isLoadingActions,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
    handleSort,
    getAriaSort,
    getSortIndicator,
  };
};
