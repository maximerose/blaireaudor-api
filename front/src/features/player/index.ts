// 1. Composants d'exposition publique
export { PlayerSearchResultItem } from './components/PlayerSearchResultItem';

// 2. Hooks utilisables par les autres domaines (ex: le recrutement)
export {
  usePlayerSearch,
  type PlayerSearchLogic,
} from './hooks/usePlayerSearch';

// 3. Contrats de types (Uniquement les types requis par l'extérieur)
export type {
  Player,
  PlayerCompact,
  RefereeListItem,
  FormParticipant,
} from './types/player';
