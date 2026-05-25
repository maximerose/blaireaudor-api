import { useMemo } from 'react';
import { useAuthContext } from '@/features/account';

export const useCareerPalmares = () => {
  const { user } = useAuthContext();
  const participations = user?.player?.participations || [];

  const sortedPalmares = useMemo(() => {
    const finished = participations.filter((p) => p.competition.is_finished);

    return [...finished].sort((a, b) => {
      return (
        new Date(b.competition.start_date).getTime() -
        new Date(a.competition.start_date).getTime()
      );
    });
  }, [participations]);

  return {
    palmares: sortedPalmares,
  };
};
