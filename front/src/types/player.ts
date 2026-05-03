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
  | (Player & { isNew: false })
  | { id: string; display_name: string; isNew: true };

/**
 * Type utilisé pour les aperçus rapides lors de l'inscription
 * ou de la recherche, sans charger tout l'historique.
 */
export interface PlayerPreview {
  id: string;
  display_name: string;
  last_competition_name?: string | null;
}
