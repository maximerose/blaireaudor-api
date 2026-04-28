import { useMemo, useState } from 'react';
import { useAuth, useCreateCompetition, usePlayerSearch } from '@/hooks';
import { formatJoinCode, cleanJoinCode, generateClientSideCode } from '@/utils';
import { apiFetch } from '@/api/config';
import { ROUTES } from '@/constants/routes';

export const useCreateCompetitionForm = (onSuccess: (comp: any) => void) => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { create, loading: creating } = useCreateCompetition();
  const { results, searching, search, setResults } = usePlayerSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPlayers, setIsAddingPlayers] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    startTime: '00:00',
    startFullDay: true,
    endDate: '',
    endTime: '23:59',
    endFullDay: true,
    joinCode: '',
    participate: true,
    fogOfWar: true,
    isCreatorReferee: true,
    players: [] as any[],
    referees: [] as any[],
  });

  const filteredResults = results.filter((p) => p.username !== user?.username);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('joinCode', formatJoinCode(e.target.value));
  };

  const handleAddPlayer = (player: any) => {
    if (!formData.players.find((p) => p.id === player.id)) {
      setFormData((prev) => ({
        ...prev,
        players: [...prev.players, { ...player, isNew: false }],
      }));
    }
    setSearchTerm('');
    setResults([]);
  };

  const handleAddNewPlayer = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      const tempId = `new-${Date.now()}`;
      setFormData((prev) => ({
        ...prev,
        players: [
          ...prev.players,
          { id: tempId, display_name: trimmedName, isNew: true },
        ],
      }));
    }
    setSearchTerm('');
    setResults([]);
  };

  const handleRemovePlayer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  };

  const handleToggleReferee = (person: any, isNew: boolean = false) => {
    setFormData((prev) => {
      const isAlreadyRef = prev.referees.some((r) => r.id === person.id);
      if (isAlreadyRef) {
        return {
          ...prev,
          referees: prev.referees.filter((r) => r.id !== person.id),
        };
      }
      return {
        ...prev,
        referees: [...prev.referees, { ...person, isNew: person.isNew ?? isNew }],
      };
    });
    setSearchTerm('');
    setResults([]);
  };

  const generateCode = () => {
    const newCode = generateClientSideCode();
    updateField('joinCode', newCode);
  };

  const canGoNext = useMemo(() => {
    return !!(formData.name && formData.startDate);
  }, [formData.name, formData.startDate]);

  const formatDateTime = (date: string, time: string, isFullDay: boolean, isEnd: boolean) => {
    if (!date) return null;
    if (isFullDay) {
      return isEnd ? `${date}T23:59:59` : `${date}T00:00:00`;
    }
    return `${date}T${time}:00`;
  };

  const submit = async () => {
    const validatedCode = cleanJoinCode(formData.joinCode);
    const finalStartDate = formatDateTime(formData.startDate, formData.startTime, formData.startFullDay, false);
    const finalEndDate = formatDateTime(formData.endDate, formData.endTime, formData.endFullDay, true);
    const competition = await create({
      ...formData,
      joinCode: validatedCode,
      startDate: finalStartDate,
      endDate: finalEndDate,
    });

    if (!competition) return;

    const existingIds = formData.players.filter((p) => !p.isNew).map((p) => p.id);
    const newNames = formData.players.filter((p) => p.isNew).map((p) => p.display_name);
    
    const existingReferees = formData.referees.filter((r) => !r.isNew).map((r) => r.id);
    const newReferees = formData.referees.filter((r) => r.isNew).map((r) => r.display_name);

    if (existingIds.length > 0 || newNames.length > 0) {
      setIsAddingPlayers(true);
      try {
        const response = await apiFetch(ROUTES.API_ADD_PLAYERS_TO_COMP(competition.id), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            existing_players_ids: existingIds,
            new_players: newNames,
            existing_referees_ids: existingReferees,
            new_referees: newReferees,
          }),
        });

        if (!response.ok) {
          console.error("Erreur serveur lors de l'ajout :", await response.text());
        }
      } catch (e) {
        console.error("Erreur lors de l'ajout des joueurs", e);
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
      search,
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
