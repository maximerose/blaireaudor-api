import { ROUTES } from '@/constants/routes';
import { Button, Badge } from '@/components/UI';
import { BUTTONS, COMPETITION_UI } from '@/constants';
import { useCompetition, useCompetitionDelete, usePermissions } from '@/hooks';

export const DetailNavigation = () => {
  const { competition } = useCompetition();
  const { canDelete } = usePermissions();
  const { deleteCompetition } = useCompetitionDelete();
  const hasActions =
    competition?.participations?.some((p) => p.has_actions) ?? false;

  return (
    <nav className="mb-10 flex justify-between items-center">
      <Button to={ROUTES.NAV.DASHBOARD} variant="ghost" size="sm">
        {BUTTONS.BACK}
      </Button>

      {canDelete.allowed ? (
        <Button
          variant="danger"
          size="sm"
          onClick={() =>
            deleteCompetition(competition.id, competition.name, hasActions)
          }
        >
          {BUTTONS.DELETE}
        </Button>
      ) : (
        <Badge variant="ghost" className="opacity-70 italic text-[8px]">
          {COMPETITION_UI.DETAIL.PROTECTED}
        </Badge>
      )}
    </nav>
  );
};
