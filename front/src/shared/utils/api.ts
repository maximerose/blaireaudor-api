/**
 * Type représentant une donnée dont on peut extraire un ID :
 * - Une string (IRI du type /api/players/123)
 * - Un objet avec une propriété id (string ou number)
 * - null ou undefined
 */
type Identifiable = string | { id: string | number } | null | undefined;

export const getIdFromData = (data: Identifiable): string | null => {
  if (!data) return null;

  if (typeof data === 'string') {
    return data.split('/').pop() || null;
  }

  return data.id?.toString() || null;
};

/**
 * Extrait l'ID Utilisateur (UUID) de n'importe quel sujet (User, Player ou IRI)
 */
export const resolveUserId = (subject: unknown): string | null => {
  if (!subject) return null;
  if (typeof subject === 'string') return subject;
  const obj = subject as Record<string, unknown>;

  return 'associated_user' in obj
    ? obj.associated_user
      ? getIdFromData(obj.associated_user as Identifiable)
      : null
    : getIdFromData(subject as Identifiable);
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
