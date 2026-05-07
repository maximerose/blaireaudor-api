import { useState } from 'react';
import { useAuth } from '@/hooks';
import { competitionService } from '@/services/api/competitionService';
import type { Competition, CompetitionCreatePayload } from '@/types';

export const useCreateCompetition = () => {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const create = async (
    data: CompetitionCreatePayload,
  ): Promise<Competition | null> => {
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
