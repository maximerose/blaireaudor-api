/**
 * Normalise une chaîne : enlève les accents et passe en minuscule.
 */
export const normalizeString = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Transforme une chaîne de caractères en "slug" (minuscules, sans espaces, sans caractères spéciaux).
 * Exemple : "Jean-Édouard de la Tour" -> "jean-edouard-de-la-tour"
 */
export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD') // Sépare les accents des lettres
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/[^a-z0-9-]/g, '') // Supprime tout ce qui n'est pas alphanumérique
    .replace(/-+/g, '-'); // Évite les doubles tirets
};

/**
 * Supprime les - au début et à la fin d'un slug
 */
export const finalizeSlug = (text: string) => {
  return text.replace(/^-+|-+$/g, '');
};

/**
 * Formate un code d'accès en temps réel : slugify + MAJUSCULES.
 * On garde le tiret final si l'utilisateur est en train de taper.
 */
export const formatJoinCode = (text: string): string => {
  return slugify(text).toUpperCase();
};

/**
 * Nettoie définitivement le code : enlève les tirets qui traînent au début/fin.
 */
export const cleanJoinCode = (text: string | null): string | null => {
  if (!text) return null;
  const cleaned = finalizeSlug(text.toLowerCase()).toUpperCase();
  return cleaned === '' ? null : cleaned;
};

export const generateClientSideCode = () => {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
  ).join('');
};

/**
 * Gère le pluriel en français (ajoute un 's' si count > 1)
 */
export const pluralize = (count: number, word: string, plural?: string) => {
  if (count <= 1) return word;
  return `${plural || word + 's'}`;
};

/**
 * Évalue la force d'un mot de passe de 0 à 4
 */
export const getPasswordStrength = (password: string | undefined): number => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
};

/**
 * Convertit une chaîne de camelCase (DTO Back) vers snake_case (Formulaire Front)
 * Exemple : "displayName" -> "display_name"
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * Convertit une chaîne de snake_case (Formulaire Front) vers camelCase (DTO Back)
 * Exemple : "join_code" -> "joinCode"
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
};
