import type { Player } from '@/features/player';
import { getIdFromData } from '@/shared';
import type { User, Competition, EnrichedLeaderboardItem } from '@/types';

/**
 * Extrait l'ID Utilisateur (UUID) de n'importe quel sujet
 */
export const resolveUserId = (
  subject: User | Player | string | null | undefined,
): string | null => {
  if (!subject) return null;
  if (typeof subject === 'string') return subject;
  return 'associated_user' in subject
    ? subject.associated_user
      ? getIdFromData(subject.associated_user)
      : null
    : getIdFromData(subject);
};

/**
 * Extrait l'ID Joueur de n'importe quel sujet
 */
export const resolvePlayerId = (
  subject: User | Player | string | null | undefined,
): string | null => {
  if (!subject) return null;
  if (typeof subject === 'string') return subject;
  return 'player' in subject
    ? subject.player
      ? getIdFromData(subject.player)
      : null
    : getIdFromData(subject);
};

/**
 * Résout l'ID du créateur d'une compétition
 */
export const resolveCreatorId = (
  competition: Competition | null | undefined,
): string | null => {
  if (!competition?.created_by) return null;
  return getIdFromData(competition.created_by);
};

/**
 * Résout le nom d'affichage du créateur (Logique exhaustive)
 */
export const resolveCreatorName = (
  competition: Competition | null | undefined,
  leaderboard: EnrichedLeaderboardItem[] = [],
  currentUser: User | null,
): string | null => {
  if (!competition) return null;
  if (competition.creator_name) return competition.creator_name;

  const creatorId = resolveCreatorId(competition);
  if (!creatorId) return null;

  if (currentUser && getIdFromData(currentUser) === creatorId) {
    return currentUser.player?.display_name || null;
  }

  const inLeaderboard = leaderboard.find(
    (item) => item.player?.id === creatorId,
  );
  return inLeaderboard?.player.display_name || null;
};

/**
 * Extrait et formate la liste des arbitres d'une compétition
 */
export const getCompetitionReferees = (
  competition: Competition | null | undefined,
) => {
  if (!competition?.referees) return [];

  return competition.referees.map((ref: Player | string) => {
    const id = getIdFromData(ref);

    let name = 'Arbitre';
    let userId = null;
    if (typeof ref === 'object' && ref !== null) {
      name = ref.display_name || ref.username || 'Arbitre';
      userId = ref.associated_user?.id || getIdFromData(ref.associated_user);
    }

    return { id, name, userId };
  });
};
