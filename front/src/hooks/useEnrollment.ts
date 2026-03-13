import { useEffect, useState } from "react"
import { apiFetch } from "../api/config";
import { ROUTES } from "../constants/routes";
import { useNavigate } from "react-router-dom";

export const useEnrollment = (competitionId: string, initialParticipants: any[]) => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState(initialParticipants);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();

    const delayDebounceFn = setTimeout(() => {
      executeSearch(searchTerm, controller.signal);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    }
  }, [searchTerm]);

  const executeSearch = async (query: string, signal: AbortSignal) => {
    setIsSearching(true);

    try {
      const response = await apiFetch(ROUTES.SEARCH_PLAYERS(query), { signal });
      const data = await response.json();

      setSearchResults(data.member || data['hydra:member'] || []);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error("Erreur recherche", error);
    } finally {
      if (!signal.aborted) {
        setIsSearching(false);
      }
    }
  };

  const addExistingPlayer = (player: any) => {
    if (!participants.find(p => p.id === player.id)) {
      setParticipants([...participants, {
        id: player.id,
        display_name: player.display_name || player.displayName,
        isNew: false
      }]);
    }
    setSearchResults([]);
    setSearchTerm("");
  };

  const addNewPlayer = (name: string) => {
    const tempId = `temp-${Date.now()}`;
    setParticipants([...participants, { id: tempId, display_name: name, isNew: true }]);
    setSearchTerm("");
  };

  const saveEnrollment = async () => {
    setLoading(true);

    const existingIds = participants.filter(p => !p.isNew).map(p => p.id);
    const newNames = participants.filter(p => p.isNew).map(p => p.display_name);

    try {
      const response = await apiFetch(ROUTES.ADD_PLAYERS(competitionId), {
        method: 'POST',
        body: JSON.stringify({
          existing_players_ids: existingIds,
          new_players: newNames
        })
      });

      if (response.ok) {
        navigate(ROUTES.DASHBOARD);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Une erreur est survenue lors de l'ajout des joueurs");
      }
    } catch (error) {
      console.error("Erreur technique", error);
      alert("Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  return {
    participants,
    searchResults,
    searchTerm,
    setSearchTerm,
    addExistingPlayer,
    addNewPlayer,
    saveEnrollment,
    loading,
    isSearching
  };
};
