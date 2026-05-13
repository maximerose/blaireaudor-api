import { ROUTES } from '@/constants/routes';
import { Button, Badge } from '@/components/UI';
import { BUTTONS, COMPETITION_UI } from '@/constants';
import { useCompetition, useCompetitionDelete, usePermissions } from '@/hooks';

export const DetailNavigation = () => {
  const { competition } = useCompetition();
  const { roles, canDelete } = usePermissions();
  const { deleteCompetition } = useCompetitionDelete();
  console.log(canDelete);

  return (
    <nav className="mb-10 flex justify-between items-center">
      <Button to={ROUTES.NAV.DASHBOARD} variant="ghost" size="sm">
        {BUTTONS.BACK}
      </Button>

      {roles.isCreator && canDelete.allowed ? (
        <Button
          variant="danger"
          size="sm"
          onClick={() => deleteCompetition(competition.id, competition.name, 0)}
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
