// front/src/utils/api.ts

/**
 * Type représentant une donnée dont on peut extraire un ID :
 * - Une string (IRI du type /api/players/123)
 * - Un objet avec une propriété id (string ou number)
 * - null ou undefined
 */
type Identifiable = string | { id: string | number } | null | undefined;

export const getIdFromData = (data: Identifiable): string | null => {
  if (!data) return null;

  // Cas de l'IRI (string)
  if (typeof data === 'string') {
    return data.split('/').pop() || null;
  }

  // Cas de l'objet (TypeScript sait ici que data est l'objet avec .id)
  return data.id?.toString() || null;
};

/**
 * Extrait l'ID Utilisateur (UUID) de n'importe quel sujet (User, Player ou IRI)
 */
export const resolveUserId = (subject: any): string | null => {
  if (!subject) return null;
  if (typeof subject === 'string') return subject;
  return 'associated_user' in subject
    ? subject.associated_user
      ? getIdFromData(subject.associated_user)
      : null
    : getIdFromData(subject);
};

/**
 * Extrait l'ID Joueur (UUID) de n'importe quel sujet (User, Player ou IRI)
 */
export const resolvePlayerId = (subject: any): string | null => {
  if (!subject) return null;
  if (typeof subject === 'string') return subject;
  return 'player' in subject
    ? subject.player
      ? getIdFromData(subject.player)
      : null
    : getIdFromData(subject);
};
