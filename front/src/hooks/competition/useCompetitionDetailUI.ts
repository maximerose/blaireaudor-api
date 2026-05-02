import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth, useCompetitionData, useCompetitionDelete } from '@/hooks';
import {
  isCompetitionCreator,
  isPlayerReferee,
  resolveCreatorName,
} from '@/utils';
import type { Participation } from '@/context/AuthContext';

export const useCompetitionDetailUI = () => {
  const { user } = useAuth();
  const { code } = useParams<{ code: string }>();
  const { competition, leaderboard, actions, loading, refresh } =
    useCompetitionData(code || '');
  const { deleteCompetition } = useCompetitionDelete();
  const [isReporting, setIsReporting] = useState(false);

  // Calcul du nombre d'entrées filtrées selon le rôle
  const entriesCount = useMemo(() => {
    if (!actions) return 0;
    const isReferee = isPlayerReferee(competition, user?.player?.id);

    if (isReferee) return actions.length;

    // Pour les non-arbitres, on ne compte que ce qui n'est pas rejeté
    return actions.filter((a: any) => a.status !== 'rejected').length;
  }, [actions, competition, user]);

  const potentialTargets = useMemo(
    () =>
      leaderboard?.map((item: Participation) => ({
        id: item.player.id,
        display_name: item.player.display_name,
      })) || [],
    [leaderboard],
  );

  const isReferee = isPlayerReferee(competition, user?.player?.id);
  const isCreator = isCompetitionCreator(competition, user);

  const creatorName = useMemo(
    () => resolveCreatorName(competition, leaderboard, user),
    [competition, leaderboard, user],
  );

  return {
    competition,
    leaderboard,
    actions,
    loading,
    refresh,
    deleteCompetition,
    isReporting,
    setIsReporting,
    potentialTargets,
    isReferee,
    isCreator,
    creatorName,
    entriesCount,
  };
};
