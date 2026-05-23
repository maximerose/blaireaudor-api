import {
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  BUTTONS,
  ICONS,
  cn,
  formatShortDate,
  TextButton,
  TEXT_BUTTON_THEME,
  IconButton,
  Grid,
  Row,
  Stack,
} from '@/shared';
import { ActionStatus, type Action } from '@/features/competition/types';
import { useCompetitionContext } from '@/features/competition/context';
import { useActionRow } from '@/features/competition/actions/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useCompetitionAdmin } from '@/features/competition/admin';

interface ActionRowDisplayModeProps {
  action: Action;
  onEdit: () => void;
}

export const ActionRowDisplayMode = ({
  action,
  onEdit,
}: ActionRowDisplayModeProps) => {
  const { handleActionStatus } = useCompetitionAdmin();
  const { competition, isAdmin } = useCompetitionContext();

  const {
    isPending,
    pointsDisplay,
    displayColor,
    playerName,
    multiplier,
    playerIsMe,
    creatorIsMe,
    shouldHidePoints,
  } = useActionRow(action);

  const canEdit =
    !competition.is_finished && (isAdmin || (isPending && creatorIsMe));

  return (
    <Grid
      cols={12}
      gap="xs"
      align="center"
      className={cn(
        'p-4 transition-default group relative',
        playerIsMe
          ? 'bg-player-me-bg hover:bg-surface-hover'
          : 'hover:bg-surface-hover',
      )}
    >
      <div className="col-span-3 md:col-span-2">
        <Text
          variant={TEXT_VARIANT.MONO}
          colorTheme={TEXT_THEME.DIMMED}
          className="text-[10px]"
        >
          {formatShortDate(action.date_action)}
        </Text>
      </div>

      <Grid
        cols={1}
        md={8}
        gap="xs"
        align="center"
        className="col-span-6 md:col-span-8 overflow-hidden"
      >
        <Row justify="center" className="md:col-span-3 overflow-hidden">
          <Text
            variant={TEXT_VARIANT.H3}
            className={cn(
              'truncate italic text-xs text-player-other transition-default',
              playerIsMe && 'text-player-me',
            )}
          >
            {playerName}
          </Text>
        </Row>

        <Stack gap="none" className="md:col-span-5">
          <Text
            variant={TEXT_VARIANT.BODY}
            className="text-[10px] md:text-xs text-info-bright"
          >
            {action.description}
          </Text>

          {action.creator_name && (
            <Text
              variant={TEXT_VARIANT.BODY}
              colorTheme={TEXT_THEME.DIMMED}
              className="text-[8px] md:text-[10px]"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.REPORTED_BY}{' '}
              <span
                className={cn(
                  'font-bold text-player-other',
                  creatorIsMe && 'text-player-me', // 🟢 Doublon de ligne supprimé ici
                )}
              >
                {action.creator_name}
              </span>
            </Text>
          )}

          {isPending && isAdmin && !competition.is_finished && (
            <Row gap="md" justify="center" mt="xs" className="animate-fade-in">
              <TextButton
                theme={TEXT_BUTTON_THEME.SUCCESS}
                icon={ICONS.CHECK}
                onClick={() =>
                  handleActionStatus(action.id, ActionStatus.VALIDATED)
                }
              >
                {BUTTONS.ACCEPT}
              </TextButton>

              <TextButton
                theme={TEXT_BUTTON_THEME.DANGER}
                icon={ICONS.CANCEL}
                onClick={() =>
                  handleActionStatus(action.id, ActionStatus.REJECTED)
                }
              >
                {BUTTONS.REJECT}
              </TextButton>
            </Row>
          )}
        </Stack>
      </Grid>

      <Stack
        gap="none"
        align="end"
        className={cn(
          'col-span-3 md:col-span-2 text-right transition-default',
          canEdit && 'pr-8 md:pr-10',
        )}
      >
        {multiplier > 1 && !shouldHidePoints && (
          <Row gap="xs" align="center" justify="end">
            <Text
              variant={TEXT_VARIANT.MONO}
              colorTheme={TEXT_THEME.DIMMED}
              className="text-[10px] line-through"
            >
              {action.points}
            </Text>
            <span className="text-[9px] font-black text-game-bonus-bright bg-game-bonus/20 px-1 rounded">
              x{multiplier}
            </span>
          </Row>
        )}

        <span
          className={cn(
            'flex items-baseline justify-end gap-1 w-full',
            displayColor,
          )}
        >
          <Text
            variant={TEXT_VARIANT.MONO}
            colorTheme={TEXT_THEME.INHERIT}
            className="text-sm md:text-base font-black"
          >
            {pointsDisplay}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.INHERIT}
            className="opacity-50"
            as="span"
          >
            {COMPETITION_UI.DETAIL.POINTS_SHORT}
          </Text>
        </span>
      </Stack>

      {canEdit && (
        <IconButton
          icon={ICONS.EDIT}
          onClick={onEdit}
          className="absolute right-2 top-1/2 -translate-y-1/2 md:top-2 md:translate-y-0 opacity-100 focus:opacity-100"
          aria-label={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.ARIA.UPDATE_ACTION}
        />
      )}
    </Grid>
  );
};
