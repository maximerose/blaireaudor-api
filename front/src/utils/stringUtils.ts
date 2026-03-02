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
