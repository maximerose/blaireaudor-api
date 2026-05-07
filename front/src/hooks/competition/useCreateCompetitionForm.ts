import { useMemo, useState } from 'react';
import { useAuth, useCreateCompetition, usePlayerSearch } from '@/hooks';
import { formatJoinCode, cleanJoinCode, generateClientSideCode } from '@/utils';
import { competitionService } from '@/services/api/competition';
import type {
  FormParticipant,
  Player,
  Competition,
  CompetitionFormData,
  PlayerCompact,
} from '@/types';

export const useCreateCompetitionForm = (
  onSuccess: (comp: Competition) => void,
) => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { create, loading: creating } = useCreateCompetition();
  const { results, searching, searchTerm, setSearchTerm, clearSearch } =
    usePlayerSearch();
  const [isAddingPlayers, setIsAddingPlayers] = useState(false);

  const [formData, setFormData] = useState<CompetitionFormData>({
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

  const updateField = <K extends keyof CompetitionFormData>(
    field: K,
    value: CompetitionFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

      const refereeToAdd: FormParticipant =
        'username' in person
          ? { ...person, isNew: false }
          : ({ ...person, isNew: isNewInput } as FormParticipant);

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

  const submit = async () => {
    const competition = await create({
      ...formData,
      joinCode: cleanJoinCode(formData.joinCode || ''),
    });

    if (!competition) return;

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
      setIsAddingPlayers(true);
      try {
        await competitionService.addParticipation(competition.id, {
          existing_players_ids: existingIds,
          new_players: newNames,
          existing_referees_ids: existingReferees,
          new_referees: newReferees,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsAddingPlayers(false);
      }
    }

    onSuccess(competition);
  };

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
    submit,
    loading: creating || isAddingPlayers,
  };
};
