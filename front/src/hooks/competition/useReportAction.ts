import { useEffect, useMemo, useRef, useState } from 'react';
import { actionService } from '@/services/api/actionService';
import { useCompetitionDateLimits } from './useCompetitionDateLimits';
import { toast } from 'react-hot-toast';
import {
  ActionStatus,
  type ActionCreatePayload,
  type ActionFormData,
} from '@/types';
import { API, ERRORS, SUCCESS } from '@/constants';
import { formatToApiISO, getLocalDayString, normalizeString } from '@/utils';
import { useInvalidateCompetition } from './useInvalidateCompetition';
import { useMutation } from '@tanstack/react-query';
import { useCompetition } from './useCompetition';
import { usePermissions } from '../usePermissions';

export const useReportAction = (
  players: { id: string; display_name: string }[],
  onSuccess: () => void,
) => {
  const { competition, refresh } = useCompetition();
  const { roles } = usePermissions();
  const { invalidateAll } = useInvalidateCompetition();

  const isAdmin = roles.isReferee;

  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<ActionFormData>({
    targetPlayerId: '',
    description: '',
    points: 10,
    dateAction: getLocalDayString(new Date()),
  });

  const { minDate, maxDate } = useCompetitionDateLimits(competition, true);

  const filteredPlayers = useMemo(() => {
    const searchTerms = normalizeString(search);

    return players
      .filter((p) => normalizeString(p.display_name).includes(searchTerms))
      .sort((a, b) => a.display_name.localeCompare(b.display_name, 'fr'));
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
        isAdmin ? SUCCESS.ACTION.REPORTED_ADMIN : SUCCESS.ACTION.REPORTED_USER,
      );
      onSuccess();
      refresh();
    },
    onError: () => {
      toast.error(ERRORS.ACTION.REPORT_FAILED);
    },
  });

  const submitReport = async () => {
    if (!formData.targetPlayerId || !formData.description) return;

    try {
      await createMutation.mutateAsync({
        description: formData.description,
        date_action: formatToApiISO(formData.dateAction),
        points: Number(formData.points),
        player: API.IRI.PLAYER(formData.targetPlayerId),
        competition: API.IRI.COMPETITION(competition.id),
        status: isAdmin ? ActionStatus.VALIDATED : ActionStatus.PENDING,
      });
    } catch (error) {
      console.error(ERRORS.ACTION.REPORT_FAILED, error);
    }
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
