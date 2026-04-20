import { useEffect, useState } from 'react';
import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';

export const useCompetitionData = (code: string) => {
  const [data, setData] = useState<{
    competition: any;
    leaderboard: any[];
    actions: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      try {
        const compRes = await apiFetch(ROUTES.API_COMPETITION_GET(code));
        const competition = await compRes.json();

        if (competition.id) {
          const [leadRes, actionsRes] = await Promise.all([
            apiFetch(ROUTES.COMPETITION_LEADERBOARD(competition.id)),
            apiFetch(ROUTES.COMPETITION_ACTIONS(competition.id)),
          ]);

          const leaderboardData = await leadRes.json();
          const actionsData = await actionsRes.json();

          setData({
            competition,
            leaderboard: Array.isArray(leaderboardData)
              ? leaderboardData
              : leaderboardData['hydra:member'] || [],
            actions: Array.isArray(actionsData)
              ? actionsData
              : actionsData['hydra:member'] || [],
          });
        }
      } catch (e) {
        console.error('Erreur fetchAll : ', e);
      } finally {
        setLoading(false);
      }
    };

    if (code) fetchAll();
  }, [code]);

  return {
    competition: data?.competition,
    leaderboard: data?.leaderboard || [],
    actions: data?.actions || [],
    loading,
  };
};
