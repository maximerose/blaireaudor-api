import { useState } from 'react';
import { apiFetch } from '@/api/config';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks';
import { formatToApiISO } from '@/utils';

export const useCreateCompetition = () => {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const create = async (data: any) => {
    setLoading(true);

    const formattedStartDate = formatToApiISO(data.startDate, data.startTime, data.startFullDay, false);
    const formattedEndDate = data.endDate 
      ? formatToApiISO(data.endDate, data.endTime, data.endFullDay, true) 
      : null;

    try {
      const response = await apiFetch(ROUTES.API_COMPETITION_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          start_date: formattedStartDate,
          end_date: formattedEndDate || null,
          join_code: data.joinCode || null,
          participate: data.participate ?? true,
          fog_of_war: data.fogOfWar,
          is_creator_referee: data.isCreatorReferee ?? true,
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
