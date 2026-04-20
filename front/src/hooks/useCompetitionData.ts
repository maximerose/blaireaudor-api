import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';

export const useCompetitionData = (code: string) => {
  const [competition, setCompetition] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!code) return;

    try {
      const compRes = await apiFetch(ROUTES.API_COMPETITION_GET(code));
      const compData = await compRes.json();
      setCompetition(compData);

      if (compData.id) {
        const [lbRes, actRes] = await Promise.all([
          apiFetch(ROUTES.COMPETITION_LEADERBOARD(compData.id)),
          apiFetch(ROUTES.COMPETITION_ACTIONS(compData.id)),
        ]);

        setLeaderboard(await lbRes.json());
        setActions(await actRes.json());
      }
    } catch (e) {
      console.error('Erreur de chargement', e);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { competition, leaderboard, actions, loading, refresh: fetchData };
};
