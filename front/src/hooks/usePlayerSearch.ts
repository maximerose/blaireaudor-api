import { useState } from "react"
import { apiFetch } from "../api/config";
import { ROUTES } from "../constants/routes";

export const usePlayerSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);

    try {
      const response = await apiFetch(`${ROUTES.PLAYERS}?displayName=${query}`);
      const data = await response.json();
      setResults(data['hydra:member'] || data || []);
    } catch (error) {
      console.error("Erreur recherche", error);
    } finally {
      setSearching(false);
    }

    return { search, results, searching }
  }
}