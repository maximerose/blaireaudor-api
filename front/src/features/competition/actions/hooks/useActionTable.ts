import { useState, useMemo } from 'react';
import { getIdFromData, QUERY_KEYS, UI } from '@/shared';

import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/features/account';
import { useCompetitionContext } from '@/features/competition/context';
import {
  ActionStatus,
  type Action,
  type ActionSortField,
  type Participation,
} from '@/features/competition/types';
import { competitionService } from '@/features/competition/services';
import { useInfiniteActions } from './useInfiniteActions';

export const useActionTable = (competitionId: string | undefined) => {
  const { competition } = useCompetitionContext();
  const { user } = useAuthContext();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
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
  } = useInfiniteActions(
    competitionId,
    selectedDate,
    selectedPlayerId,
    sortField,
    sortOrder,
  );

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
      myPending: pending.filter(
        (a) => getIdFromData(a.created_by_id) === userId,
      ),
      othersPending: pending.filter(
        (a) => getIdFromData(a.created_by_id) !== userId,
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

  const filterOptions = useMemo(() => {
    const participations = competition?.participations || [];
    const currentUserId = user?.player?.id;

    return {
      me: currentUserId ? { id: currentUserId, name: UI.ME } : null,
      others: participations
        .filter((p: Participation) => p.player.id !== currentUserId)
        .map((p: Participation) => ({
          value: p.player.id,
          label: p.player.display_name,
        })),
    };
  }, [competition?.participations, user?.player?.id]);

  return {
    categories,
    availableDates,
    selectedDate,
    setSelectedDate,
    selectedPlayerId,
    setSelectedPlayerId,
    totalActions,
    isLoadingActions,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
    handleSort,
    getAriaSort,
    getSortIndicator,
    filterOptions,
  };
};
