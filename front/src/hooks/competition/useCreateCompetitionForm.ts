import { useMemo, useState } from 'react';
import { useAuth, useCompetitionForm, usePlayerSearch } from '@/hooks';
import {
  formatJoinCode,
  cleanJoinCode,
  generateClientSideCode,
  formatToApiISO,
} from '@/utils';
import { competitionService } from '@/services/api/competitionService';
import type {
  FormParticipant,
  Player,
  Competition,
  PlayerCompact,
  CompetitionCreatePayload,
} from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

export const useCreateCompetitionForm = (
  onSuccess: (comp: Competition) => void,
) => {
  const [step, setStep] = useState(1);
  const { user, refreshUser } = useAuth();
  const { results, searching, searchTerm, setSearchTerm, clearSearch } =
    usePlayerSearch();
  const queryClient = useQueryClient();

  const { formData, setFormData, updateField } = useCompetitionForm({
    name: '',
    startDate: '',
    startTime: '00:00',
    startFullDay: true,
    endDate: '',
    endTime: '23:59',
    endFullDay: true,
    joinCode: null,
    participate: true,
    fogOfWar: true,
    isCreatorReferee: true,
    players: [] as FormParticipant[],
    referees: [] as FormParticipant[],
  });

  const filteredResults = results.filter((p) => p.username !== user?.username);

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('joinCode', formatJoinCode(e.target.value));
  };

  const handleAddPlayer = (player: Player | PlayerCompact) => {
    if (!(formData.players || []).find((p) => p.id === player.id)) {
      setFormData((prev) => ({
        ...prev,
        players: [
          ...(prev.players || []),
          { ...player, isNew: false } as FormParticipant,
        ],
      }));
    }
    clearSearch();
  };

  const handleAddNewPlayer = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      const tempId = `new-${Date.now()}`;
      setFormData((prev) => ({
        ...prev,
        players: [
          ...(prev.players || []),
          {
            id: tempId,
            display_name: trimmedName,
            isNew: true,
          } as FormParticipant,
        ],
      }));
    }
    clearSearch();
  };

  const handleRemovePlayer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      players: (prev.players || []).filter((p) => p.id !== id),
    }));
  };

  const handleToggleReferee = (
    person: Player | PlayerCompact | FormParticipant,
    isNewInput: boolean = false,
  ) => {
    setFormData((prev) => {
      const currentReferees = prev.referees || [];
      const isAlreadyRef = currentReferees.some((r) => r.id === person.id);

      if (isAlreadyRef) {
        return {
          ...prev,
          referees: currentReferees.filter((r) => r.id !== person.id),
        };
      }

      let refereeToAdd: FormParticipant;

      if ('isNew' in person) {
        refereeToAdd = person;
      } else {
        refereeToAdd = { ...person, isNew: isNewInput } as FormParticipant;
      }

      return {
        ...prev,
        referees: [...currentReferees, refereeToAdd],
      };
    });
    clearSearch();
  };

  const generateCode = () => {
    const newCode = generateClientSideCode();
    updateField('joinCode', newCode);
  };

  const canGoNext = useMemo(() => {
    return !!(formData.name && formData.startDate);
  }, [formData.name, formData.startDate]);

  const creationMutation = useMutation({
    mutationFn: async () => {
      const payload: CompetitionCreatePayload = {
        name: formData.name,
        start_date: formatToApiISO(
          formData.startDate,
          formData.startTime,
          formData.startFullDay,
          false,
        ),
        end_date: formData.endDate
          ? formatToApiISO(
              formData.endDate,
              formData.endTime,
              formData.endFullDay,
              true,
            )
          : null,
        join_code: cleanJoinCode(formData.joinCode || ''),
        participate: formData.participate ?? true,
        fog_of_war: formData.fogOfWar,
      };

      const competition = await competitionService.create(payload);

      const existingIds = (formData.players || [])
        .filter((p) => !p.isNew)
        .map((p) => p.id);
      const newNames = (formData.players || [])
        .filter((p) => p.isNew)
        .map((p) => p.display_name);
      const existingReferees = (formData.referees || [])
        .filter((r) => !r.isNew)
        .map((r) => r.id);
      const newReferees = (formData.referees || [])
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
    onError: (error) => {
      console.error('Échec du workflow de création :', error);
    },
  });

  return {
    step,
    setStep,
    formData,
    updateField,
    handleJoinCodeChange,
    generateCode,
    canGoNext: canGoNext,
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
    refereesActions: {
      toggle: handleToggleReferee,
    },

    submit: () => creationMutation.mutate(),
    loading: creationMutation.isPending,
  };
};
