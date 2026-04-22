/**
 * Vérifie si un utilisateur a les droits de gestion sur une compétition
 * (Propriétaire, et bientôt Arbitre)
 */
export const canManageCompetition = (user: any, competition: any): boolean => {
  if (!user || !competition) return false;

  const userId = user.id;
  const creatorId = competition.created_by?.id || competition.created_by;

  const isOwner = userId === creatorId;

  return isOwner;
};
