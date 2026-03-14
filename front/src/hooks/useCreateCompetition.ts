import { useState } from 'react';
import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';
import { useAuth } from './useAuth';

export const useCreateCompetition = () => {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const create = async (data: any) => {
    setLoading(true);

    const formattedStartDate = data.startDate
      ? new Date(data.startDate).toISOString()
      : null;
    const formattedEndDate = data.endDate
      ? new Date(data.endDate).toISOString()
      : null;

    try {
      const response = await apiFetch(ROUTES.CREATE_COMPETITION, {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          start_date: formattedStartDate,
          end_date: formattedEndDate || null,
          join_code: data.joinCode || null,
          participate: data.participate ?? true,
          fog_of_war: data.fogOfWar,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Détails de l'erreur Symfony:", result);
        return null;
      }

      await refreshUser();

      return result;
    } catch (error) {
      console.error('Erreur réseau:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
};
