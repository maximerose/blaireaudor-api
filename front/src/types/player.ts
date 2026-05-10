import type { Competition, Participation, User } from '@/types';

/**
 * Structure exacte provenant de l'API (Backend)
 */
export interface Player {
  id: string;
  display_name: string;
  username: string;
  participations: Participation[];
  has_account: boolean;
  refereed_competitions: Competition[];
  associated_user: User | null;
  last_competition_name?: string;
}

/**
 * Union discriminée pour le formulaire de création (Frontend logic)
 * Permet de gérer à la fois les joueurs existants et les profils temporaires
 */
export type FormParticipant =
  | (PlayerCompact & { isNew: false })
  | { id: string; display_name: string; isNew: true };

/**
 * Type utilisé pour les résultats de recherche et les affichages rapides
 */
export interface PlayerCompact {
  id: string;
  display_name: string;
  username?: string;
  last_competition_name?: string | null;
}

/**
 * Interface pour le ViewModel des arbitres utilisé dans la vue
 * Aligné sur le contrat attendu par RefereeManagement
 */
export interface RefereeListItem {
  id: string | null;
  name: string;
  userId: string | null;
}
