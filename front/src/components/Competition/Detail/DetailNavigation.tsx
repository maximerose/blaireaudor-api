import { ROUTES } from '@/constants/routes';
import {
  Button,
  Badge,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  BADGE_VARIANT,
} from '@/components/UI';
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
      <Button
        to={ROUTES.NAV.DASHBOARD}
        variant={BUTTON_VARIANT.GHOST}
        size={BUTTON_SIZE.SMALL}
      >
        {BUTTONS.BACK}
      </Button>

      {canDelete.allowed ? (
        <Button
          variant={BUTTON_VARIANT.DANGER}
          size={BUTTON_SIZE.SMALL}
          onClick={() =>
            deleteCompetition(competition.id, competition.name, hasActions)
          }
        >
          {BUTTONS.DELETE}
        </Button>
      ) : (
        <Badge
          variant={BADGE_VARIANT.GHOST}
          className="opacity-70 italic text-[8px]"
        >
          {COMPETITION_UI.DETAIL.PROTECTED}
        </Badge>
      )}
    </nav>
  );
};
