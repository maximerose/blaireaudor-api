import {
  Button,
  Badge,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  BADGE_VARIANT,
  SectionHeader,
} from '@/components/UI';
import { BUTTONS, COMPETITION_UI, ICONS } from '@/constants';
import { useCompetitionDelete, usePermissions } from '@/hooks';
import { useCompetitionContext } from '@/context';

export const DeleteCompetitionAction = () => {
  const { competition } = useCompetitionContext();
  const { canDelete, roles } = usePermissions();
  const { deleteCompetition } = useCompetitionDelete();

  const hasActions =
    competition?.participations?.some((p) => p.has_actions) ?? false;

  if (!roles.isCreator) return null;

  return (
    <div className="pt-4 border-t border-danger/20 flex flex-col items-center justify-center gap-4">
      {canDelete.allowed ? (
        <>
          <SectionHeader
            title={COMPETITION_UI.ADMIN.GENERAL.DELETE_ZONE}
            colorTheme="danger"
            subtitle={COMPETITION_UI.ADMIN.GENERAL.DELETE_HINT}
            className="text-danger-bright"
            variant="sub"
            centered
          />

          <Button
            variant={BUTTON_VARIANT.DANGER}
            size={BUTTON_SIZE.SMALL}
            onClick={() =>
              deleteCompetition(competition.id, competition.name, hasActions)
            }
            icon={ICONS.TRASH}
            className="shrink-0"
          >
            {BUTTONS.DELETE}
          </Button>
        </>
      ) : (
        <Badge
          variant={BADGE_VARIANT.GHOST}
          className="opacity-70 italic text-[8px] shrink-0"
        >
          {COMPETITION_UI.DETAIL.PROTECTED}
        </Badge>
      )}
    </div>
  );
};
