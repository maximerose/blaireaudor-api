// 1. Points d'entrée graphiques et Pages pour l'extérieur
export { CompetitionDetailPage } from './view/components/CompetitionDetailPage';
export { CreateCompetitionPage } from './create/components/CreateCompetitionPage';
export { CompetitionCard } from './view/components/CompetitionCard';
export { JoinCompetitionModal } from './join/components/JoinCompetitionModal';

// 2. Outils métiers requis par l'extérieur (ex: le Dashboard)
export { getCompetitionStatus } from './utils/competitionHelper';

// 2. Types requis par les autres domaines
export { CompetitionStatus } from './types/competition';
export type { Competition, CompetitionStatusType } from './types/competition';
export type {
  Participation,
  EnrichedLeaderboardItem,
} from './types/participation';
