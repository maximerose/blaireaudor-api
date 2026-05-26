import { useQuery } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { useCompetitionContext } from '@/features/competition/context';

export const useCompetitionStats = () => {
  const { competition, hidePoints } = useCompetitionContext();

  // On ne charge les stats que si le brouillard est levé (ou si on est arbitre)
  const canViewStats = !hidePoints;

  const statsQuery = useQuery({
    queryKey: ['competitions', competition.id, 'stats'],
    queryFn: ({ signal }) =>
      competitionService.getStats(competition.id, signal),
    enabled: canViewStats && !!competition.id,
  });

  const evolutionQuery = useQuery({
    queryKey: ['competitions', competition.id, 'daily-evolution'],
    queryFn: ({ signal }) =>
      competitionService.getDailyEvolution(competition.id, signal),
    enabled: canViewStats && !!competition.id,
  });

  return {
    stats: statsQuery.data,
    dailyEvolution: evolutionQuery.data || [],
    isLoading: statsQuery.isLoading || evolutionQuery.isLoading,
    canViewStats,
  };
};
