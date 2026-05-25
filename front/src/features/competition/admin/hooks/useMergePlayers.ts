import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useInvalidateCompetition } from '@/features/competition/view/hooks';
import { handleApiError } from '@/shared';

interface UseMergePlayersProps {
  competitionId: string;
  competitionCode: string;
  guestPlayerId: string;
  onClose: () => void;
}

export const useMergePlayers = ({
  competitionId,
  competitionCode,
  guestPlayerId,
  onClose,
}: UseMergePlayersProps) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { invalidateAll } = useInvalidateCompetition();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: users = [], isFetching } = useQuery({
    queryKey: ['users', 'search', debouncedSearch],
    queryFn: ({ signal }) =>
      competitionService.searchUsers(debouncedSearch, signal),
    enabled: debouncedSearch.trim().length >= 2,
  });

  const mutation = useMutation({
    mutationFn: () =>
      competitionService.mergePlayers(
        competitionId,
        guestPlayerId,
        selectedUser.id,
      ),
    onSuccess: async () => {
      await invalidateAll(competitionId, competitionCode);
      onClose();
    },
    onError: (err: any) => {
      handleApiError(err, undefined, COMPETITION_UI.ADMIN.MERGE.ERROR_TOAST);
    },
  });

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearch(`${user.player?.display_name || user.username} (${user.email})`);
  };

  return {
    search,
    setSearch,
    users,
    isFetching,
    selectedUser,
    setSelectedUser,
    dropdownRef,
    isPending: mutation.isPending,
    handleConfirm: () => mutation.mutate(),
    handleSelectUser,
  };
};
