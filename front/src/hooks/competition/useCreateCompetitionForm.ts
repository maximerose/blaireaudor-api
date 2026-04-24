import { useState } from 'react';
import { useAuth, useCreateCompetition, usePlayerSearch } from '@/hooks';
import { formatJoinCode, cleanJoinCode } from '@/utils';
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
    endDate: '',
    joinCode: '',
    participate: true,
    fogOfWar: true,
    players: [] as any[],
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

  const submit = async () => {
    const validatedCode = cleanJoinCode(formData.joinCode);
    const competition = await create({
      ...formData,
      joinCode: validatedCode,
    });

    if (!competition) return;

    const existingIds = formData.players
      .filter((p) => !p.isNew)
      .map((p) => p.id);
    const newNames = formData.players
      .filter((p) => p.isNew)
      .map((p) => p.display_name);

    if (existingIds.length > 0 || newNames.length > 0) {
      setIsAddingPlayers(true);
      try {
        await apiFetch(ROUTES.API_ADD_PLAYERS_TO_COMP(competition.id), {
          method: 'POST',
          body: JSON.stringify({
            existing_players_ids: existingIds,
            new_players: newNames,
          }),
        });
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
    players: {
      searchTerm,
      setSearchTerm,
      results: filteredResults,
      searching,
      search,
      add: handleAddPlayer,
      addNew: handleAddNewPlayer,
      remove: handleRemovePlayer,
    },
    submit,
    loading: creating || isAddingPlayers,
  };
};
