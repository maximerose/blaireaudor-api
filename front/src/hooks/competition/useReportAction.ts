import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { actionService } from '@/services';
import { toast } from 'react-hot-toast';
import { ActionStatus, type ActionCreatePayload } from '@/types';
import { API, ERRORS, SUCCESS } from '@/constants';
import { formatToApiISO, getLocalDayString, normalizeString } from '@/utils';
import { useCompetitionContext } from '@/context';
import {
  useCompetitionDateLimits,
  useInvalidateCompetition,
  usePermissions,
} from '@/hooks';
import { reportActionSchema, type ReportActionFormData } from '@/validations';

export const useReportAction = (
  players: { id: string; display_name: string }[],
  onSuccess: () => void,
) => {
  const { competition, refresh } = useCompetitionContext();
  const { roles } = usePermissions();
  const { invalidateAll } = useInvalidateCompetition();

  const isAdmin = roles.isReferee;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportActionFormData>({
    resolver: zodResolver(reportActionSchema),
    mode: 'onBlur',
    defaultValues: {
      targetPlayerId: '',
      description: '',
      points: 10,
      dateAction: getLocalDayString(new Date()),
    },
  });

  // 2. États pour le Custom Dropdown de recherche de joueur
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const { minDate, maxDate } = useCompetitionDateLimits(competition, true);

  const filteredPlayers = useMemo(() => {
    const searchTerms = normalizeString(search);
    return players
      .filter((p) => normalizeString(p.display_name).includes(searchTerms))
      .sort((a, b) => a.display_name.localeCompare(b.display_name, 'fr'));
  }, [players, search]);

  // Quand on sélectionne un joueur dans la liste
  const selectPlayer = (id: string, name: string) => {
    setValue('targetPlayerId', id, { shouldValidate: true }); // Zod valide que ce n'est plus vide
    setSearch(name); // On affiche le nom dans l'input
    setShowDropdown(false);
  };

  // Gestion du clic en dehors du dropdown
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

  // 3. Soumission API
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

      // On réinitialise le formulaire (sauf la date qui reste à aujourd'hui)
      reset({
        targetPlayerId: '',
        description: '',
        points: 10,
        dateAction: getLocalDayString(new Date()),
      });
      setSearch('');

      onSuccess();
      refresh();
    },
    onError: () => {
      toast.error(ERRORS.ACTION.REPORT_FAILED);
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
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
  };
};
