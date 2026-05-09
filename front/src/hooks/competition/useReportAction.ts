import { useEffect, useMemo, useRef, useState } from 'react';
import { actionService } from '@/services/api/actionService';
import { useCompetitionDateLimits } from './useCompetitionDateLimits';
import { toast } from 'react-hot-toast';
import {
  ActionStatus,
  type ActionCreatePayload,
  type Competition,
} from '@/types';
import { API } from '@/constants';
import { formatToApiISO, normalizeString } from '@/utils';
import { useInvalidateCompetition } from './useInvalidateCompetition';
import { useMutation } from '@tanstack/react-query';

export const useReportAction = (
  competition: Competition,
  players: { id: string; display_name: string }[],
  onSuccess: () => void,
  isAdmin: boolean,
) => {
  const { invalidateAll } = useInvalidateCompetition();

  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    targetPlayerId: '',
    description: '',
    points: 10,
    dateAction: new Date().toISOString().split('T')[0],
  });

  const { minDate, maxDate } = useCompetitionDateLimits(competition, true);

  const filteredPlayers = useMemo(() => {
    const searchTerms = normalizeString(search);

    const filtered = players.filter((p) =>
      normalizeString(p.display_name).includes(searchTerms),
    );

    return filtered.sort((a, b) =>
      a.display_name.localeCompare(b.display_name, 'fr', {
        sensitivity: 'base',
      }),
    );
  }, [players, search]);

  const selectPlayer = (id: string, name: string) => {
    setFormData((prev) => ({ ...prev, targetPlayerId: id }));
    setSearch(name);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Priorité Mobile

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const createMutation = useMutation({
    mutationFn: (
      payload: ActionCreatePayload & {
        competition: string;
        status: ActionStatus;
      },
    ) => actionService.create(competition.id, payload),
    onSuccess: async () => {
      await invalidateAll(competition.id, competition.join_code);
      toast.success(
        isAdmin ? 'Méfait enregistré !' : "Dénonciation transmise à l'arbitre.",
      );
      onSuccess();
    },
    onError: () => {
      toast.error('Erreur lors du signalement.');
    },
  });

  const submitReport = () => {
    if (!formData.targetPlayerId || !formData.description) return;

    createMutation.mutate({
      description: formData.description,
      date_action: formatToApiISO(formData.dateAction),
      points: Number(formData.points),
      player: API.IRI.PLAYER(formData.targetPlayerId),
      competition: API.IRI.COMPETITION(competition.id),
      status: isAdmin ? ActionStatus.VALIDATED : ActionStatus.PENDING,
    });
  };

  return {
    formData,
    loading: createMutation.isPending,
    dateLimits: { minDate, maxDate },
    setFormData,
    submitReport,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
  };
};
