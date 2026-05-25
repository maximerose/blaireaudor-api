import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePlayerSearch,
  type FormParticipant,
  type Player,
  type PlayerCompact,
} from '@/features/player';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cleanJoinCode,
  ERRORS,
  getLocalDayString,
  QUERY_KEYS,
  type ApiError,
  handleApiError,
} from '@/shared';
import { useAuthContext } from '@/features/account';
import type {
  Competition,
  CompetitionCreatePayload,
} from '@/features/competition/types';
import {
  createCompetitionSchema,
  type CreateCompetitionFormData,
} from '@/features/competition/validations';
import { formatToApiISO } from '@/features/competition/utils';
import { competitionService } from '@/features/competition/services';

export const useCreateCompetitionForm = (
  onSuccess: (comp: Competition) => void,
) => {
  const [step, setStep] = useState(1);
  const { user, refreshUser } = useAuthContext();
  const queryClient = useQueryClient();
  const { results, searching, searchTerm, setSearchTerm, clearSearch } =
    usePlayerSearch();

  const formMethods = useForm<CreateCompetitionFormData>({
    resolver: zodResolver(createCompetitionSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      joinCode: '',
      startDate: getLocalDayString(new Date()),
      startTime: '00:00',
      startFullDay: true,
      endDate: '',
      endTime: '23:59',
      endFullDay: true,
      fogOfWar: true,
      participate: true,
      isCreatorReferee: true,
      players: [],
      referees: [],
    },
  });

  const { watch, setValue, trigger, handleSubmit } = formMethods;

  const currentPlayers = watch('players');
  const currentReferees = watch('referees');
  const filteredResults = results.filter((p) => p.username !== user?.username);

  const handleAddPlayer = (player: Player | PlayerCompact) => {
    if (!currentPlayers.find((p) => p.id === player.id)) {
      setValue('players', [
        ...currentPlayers,
        { ...player, isNew: false } as FormParticipant,
      ]);
    }
    clearSearch();
  };

  const handleAddNewPlayer = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      setValue('players', [
        ...currentPlayers,
        {
          id: `new-${Date.now()}`,
          display_name: trimmedName,
          isNew: true,
        } as FormParticipant,
      ]);
    }
    clearSearch();
  };

  const handleRemovePlayer = (id: string) => {
    setValue(
      'players',
      currentPlayers.filter((p) => p.id !== id),
    );
  };

  const handleToggleReferee = (
    person: Player | PlayerCompact | FormParticipant,
    isNewInput: boolean = false,
  ) => {
    const isAlreadyRef = currentReferees.some((r) => r.id === person.id);

    if (isAlreadyRef) {
      setValue(
        'referees',
        currentReferees.filter((r) => r.id !== person.id),
        { shouldValidate: true },
      );
    } else {
      const refereeToAdd =
        'isNew' in person
          ? person
          : ({ ...person, isNew: isNewInput } as FormParticipant);
      setValue('referees', [...currentReferees, refereeToAdd], {
        shouldValidate: true,
      });
    }
    clearSearch();
  };

  const handleNextStep1 = async () => {
    const isValid = await trigger([
      'name',
      'joinCode',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
    ]);
    if (isValid) setStep(2);
  };

  const creationMutation = useMutation<
    Competition,
    ApiError,
    CreateCompetitionFormData
  >({
    mutationFn: async (data: CreateCompetitionFormData) => {
      const payload: CompetitionCreatePayload = {
        name: data.name,
        start_date: formatToApiISO(
          data.startDate,
          data.startTime ?? undefined,
          data.startFullDay,
          false,
        ),
        end_date: data.endDate
          ? formatToApiISO(
              data.endDate,
              data.endTime ?? undefined,
              data.endFullDay,
              true,
            )
          : null,
        join_code: cleanJoinCode(data.joinCode || ''),
        participate: data.participate,
        fog_of_war: data.fogOfWar,
        is_creator_referee: data.isCreatorReferee,
      };

      const competition = await competitionService.create(payload);

      const existingIds = data.players.filter((p) => !p.isNew).map((p) => p.id);
      const newNames = data.players
        .filter((p) => p.isNew)
        .map((p) => p.display_name);
      const existingReferees = data.referees
        .filter((r) => !r.isNew)
        .map((r) => r.id);
      const newReferees = data.referees
        .filter((r) => r.isNew)
        .map((r) => r.display_name);

      if (
        existingIds.length > 0 ||
        newNames.length > 0 ||
        existingReferees.length > 0 ||
        newReferees.length > 0
      ) {
        await competitionService.addParticipation(competition.id, {
          existing_players_ids: existingIds,
          new_players: newNames,
          existing_referees_ids: existingReferees,
          new_referees: newReferees,
        });
      }

      return competition;
    },
    onSuccess: async (competition) => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competition.all });
      onSuccess(competition);
    },
    onError: (e) => {
      handleApiError(e, formMethods.setError, ERRORS.COMPETITION.CREATE_FAILED);

      if (e.violations?.length) {
        setStep(1);
      }
    },
  });

  return {
    step,
    setStep,
    handleNextStep1,
    formMethods,
    searchState: {
      searchTerm,
      setSearchTerm,
      results: filteredResults,
      searching,
    },
    playersActions: {
      add: handleAddPlayer,
      addNew: handleAddNewPlayer,
      remove: handleRemovePlayer,
    },
    refereesActions: { toggle: handleToggleReferee },
    submit: handleSubmit((data) => creationMutation.mutate(data)),
    loading: creationMutation.isPending,
  };
};
