import { CompetitionContext, useAuthContext } from '@/context';
import { canManage, isCreator, isParticipant, isReferee } from '@/utils';
import type { Competition } from '@/types';
import { useContext } from 'react';

export const usePermissions = (manualCompetition?: Competition | null) => {
  const { user } = useAuthContext();

  const context = useContext(CompetitionContext);
  const competition = manualCompetition ?? context?.competition;
  const hasActions =
    competition?.participations?.some((p) => p.has_actions) ?? false;

  const _isCreator = isCreator(competition, user);
  const _isReferee = isReferee(competition, user);
  const _isParticipant = isParticipant(competition, user);

  return {
    canEditSettings: check(
      _isCreator || _isReferee,
      'Réservé aux gestionnaires.',
    ),
    canManageParticipants: check(
      _isCreator || _isReferee,
      'Réservé aux gestionnaires.',
    ),
    canDelete: check(
      _isCreator && !hasActions,
      'Seul le créateur peut supprimer.',
    ),
    canManageGame: check(
      _isReferee,
      'Seul un arbitre actif peut modifier la mécanique de jeu.',
    ),
    canReport: check(_isParticipant, 'Vous devez être inscrit pour dénoncer.'),
    roles: {
      isCreator: isCreator(competition, user),
      isReferee: isReferee(competition, user),
      isParticipant: isParticipant(competition, user),
      isManager: canManage(competition, user),
    },
  };
};

const check = (condition: boolean | undefined, reason: string = '') => ({
  allowed: !!condition,
  reason: condition ? '' : reason,
});
