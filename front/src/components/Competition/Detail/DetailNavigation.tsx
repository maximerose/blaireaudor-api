import { ROUTES } from '@/constants/routes';
import { Button, Badge } from '@/components/UI';
import type { Competition } from '@/context/AuthContext';

interface DetailNavigationProps {
  competition: Competition;
  hasActions: boolean;
  isCreator: boolean;
  onDelete: (
    id: string,
    name: string,
    count: number,
  ) => Promise<boolean> | void;
}

export const DetailNavigation = ({
  competition,
  hasActions,
  isCreator,
  onDelete,
}: DetailNavigationProps) => (
  <nav className="mb-10 flex justify-between items-center">
    <Button to={ROUTES.NAV_DASHBOARD} variant="ghost" size="sm">
      <span aria-hidden="true">← </span>Retour
    </Button>

    {isCreator &&
      (!hasActions ? (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(competition.id, competition.name, 0)}
        >
          Supprimer l'arène
        </Button>
      ) : (
        <Badge variant="ghost" className="opacity-70 italic text-[8px]">
          Historique protégé
        </Badge>
      ))}
  </nav>
);
