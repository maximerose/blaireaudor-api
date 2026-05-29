import { useCompetitionDelete } from '@/features/competition/admin/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useCompetitionContext } from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import type { Participation } from '@/features/competition/types';
import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  BUTTONS,
  ICONS,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
} from '@/shared';

export const DeleteCompetitionAction = () => {
  const { competition } = useCompetitionContext();
  const { canDelete, roles } = usePermissions();
  const { deleteCompetition } = useCompetitionDelete();

  const hasActions =
    competition?.participations?.some((p: Participation) => p.has_actions) ??
    false;

  if (!roles.isCreator) return null;

  return (
    <Stack
      align="center"
      gap="md"
      className="pt-6 border-t border-danger/20 w-full"
    >
      {canDelete.allowed ? (
        <>
          <SectionHeader
            title={COMPETITION_UI.ADMIN.GENERAL.DELETE_ZONE}
            colorTheme="danger"
            subtitle={COMPETITION_UI.ADMIN.GENERAL.DELETE_HINT}
            className="text-danger-bright"
            variant={SECTION_HEADER_VARIANT.SUB || 'sub'}
            centered
          />

          <Button
            variant={BUTTON_VARIANT.DANGER}
            size={BUTTON_SIZE.SMALL}
            onClick={() =>
              deleteCompetition(competition.id, competition.name, hasActions)
            }
            icon={ICONS.TRASH}
            className="cursor-pointer"
          >
            {BUTTONS.DELETE}
          </Button>
        </>
      ) : (
        <Badge
          variant={BADGE_VARIANT.GHOST}
          className="opacity-70 italic text-xs"
        >
          {COMPETITION_UI.DETAIL.PROTECTED}
        </Badge>
      )}
    </Stack>
  );
};
