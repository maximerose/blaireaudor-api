import { useState } from 'react';
import { useAuth } from '@/hooks';
import { competitionService } from '@/services/api/competition';

export const useCreateCompetition = () => {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const create = async (data: any) => {
    setLoading(true);
    try {
      const result = await competitionService.create(data);

      await refreshUser();

      return result;
    } catch (error) {
      console.error('Erreur réseau ou technique:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
};
