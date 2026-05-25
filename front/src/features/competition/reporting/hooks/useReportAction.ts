import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  API,
  ERRORS,
  SUCCESS,
  type ApiError,
  getLocalDayString,
  normalizeString,
  handleApiError,
} from '@/shared';
import {
  getReportActionSchema,
  type ReportActionFormData,
} from '@/features/competition/validations';
import { useCompetitionContext } from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import {
  useCompetitionDateLimits,
  useInvalidateCompetition,
} from '@/features/competition/view';
import {
  ActionStatus,
  type Action,
  type ActionCreatePayload,
} from '@/features/competition/types';
import { actionService } from '@/features/competition/services';
import { formatToApiISO } from '@/features/competition/utils';

export const useReportAction = (
  players: { id: string; display_name: string }[],
  onSuccess: () => void,
) => {
  const { competition, refresh } = useCompetitionContext();
  const { roles } = usePermissions();
  const { invalidateAll } = useInvalidateCompetition();

  const isAdmin = roles.isReferee;

  const { minDate, maxDate } = useCompetitionDateLimits(competition, true);

  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredPlayers = useMemo(() => {
    const searchTerms = normalizeString(search);
    return players
      .filter((p) => normalizeString(p.display_name).includes(searchTerms))
      .sort((a, b) => a.display_name.localeCompare(b.display_name, 'fr'));
  }, [players, search]);

  const selectPlayer = (id: string, name: string) => {
    setValue('targetPlayerId', id, { shouldValidate: true });
    setSearch(name);
    setShowDropdown(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ReportActionFormData>({
    resolver: zodResolver(getReportActionSchema(minDate, maxDate)),
    mode: 'onBlur',
    defaultValues: {
      targetPlayerId: '',
      description: '',
      points: 10,
      dateAction: getLocalDayString(new Date()),
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setValue('targetPlayerId', '', { shouldValidate: true });
    setShowDropdown(true);
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
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const createMutation = useMutation<
    Action,
    ApiError,
    ActionCreatePayload & { competition: string; status: ActionStatus }
  >({
    mutationFn: (
      payload: ActionCreatePayload & {
        competition: string;
        status: ActionStatus;
      },
    ) => actionService.create(competition.id, payload),
    onSuccess: () => {
      toast.success(
        isAdmin ? SUCCESS.ACTION.REPORTED_ADMIN : SUCCESS.ACTION.REPORTED_USER,
      );

      reset({
        targetPlayerId: '',
        description: '',
        points: 10,
        dateAction: getLocalDayString(new Date()),
      });
      setSearch('');
      onSuccess();

      invalidateAll(competition.id, competition.join_code);
      refresh();
    },
    onError: (e) => {
      const mappedError: ApiError = {
        ...e,
        violations: e.violations?.map((v) => ({
          ...v,
          propertyPath:
            v.propertyPath === 'player' ? 'target_player_id' : v.propertyPath,
        })),
      };

      handleApiError(mappedError, setError, ERRORS.ACTION.REPORT_FAILED);
    },
  });

  const onSubmit = async (data: ReportActionFormData) => {
    await createMutation.mutateAsync({
      description: data.description,
      date_action: formatToApiISO(data.dateAction),
      points: data.points,
      player: API.IRI.PLAYER(data.targetPlayerId),
      competition: API.IRI.COMPETITION(competition.id),
      status: isAdmin ? ActionStatus.VALIDATED : ActionStatus.PENDING,
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    loading: createMutation.isPending || isSubmitting,
    dateLimits: { minDate, maxDate },

    search,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
    handleSearchChange,
  };
};
