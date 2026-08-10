import { useActionRow } from '@/features/competition/actions/hooks';
import { useCompetitionAdmin } from '@/features/competition/admin';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useCompetitionContext } from '@/features/competition/context';
import { ActionStatus, type Action } from '@/features/competition/types';
import {
  BUTTONS,
  cn,
  formatCompactDate,
  Grid,
  ICONS,
  Row,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
  UI,
} from '@/shared';

interface ActionRowDisplayModeProps {
  action: Action;
  onEdit: () => void;
}

export const ActionRowDisplayMode = ({
  action,
  onEdit,
}: ActionRowDisplayModeProps) => {
  const { handleActionStatus, isChangingStatus } = useCompetitionAdmin();
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
    canEdit,
  } = useActionRow(action);

  const isFinished = competition.is_finished;
  const statusLower = action.status?.toLowerCase();

  const canArbitrate = isPending && isAdmin && !isFinished;
  const isValidated = statusLower === ActionStatus.VALIDATED;
  const canInvalidate = isValidated && isAdmin && !isFinished;
  const hasActions = canArbitrate || canInvalidate || canEdit;

  return (
    <div
      className={cn(
        'flex flex-col border-b border-border-subtle/30 last:border-0 w-full relative group transition-opacity',
        playerIsMe ? 'bg-player-me-bg' : 'bg-transparent',
        isChangingStatus && 'opacity-50 pointer-events-none',
      )}
    >
      {/* 🥞 A. LIGNE PRINCIPALE DE CONTENU */}
      <Grid cols={12} gap="sm" align="center" className="p-4 w-full">
        {/* 📅 1. DATE */}
        <div className="col-span-3 md:col-span-2">
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="text-[11px] sm:text-xs font-mono text-left block"
          >
            {formatCompactDate(action.date_action)}
          </Text>
        </div>

        {/* 👤 2. COLONNE JOUEUR (Desktop uniquement) */}
        <div className="hidden md:flex flex-col text-center min-w-0 md:col-span-3">
          <Text
            variant={TEXT_VARIANT.CAPTION}
            className={cn(
              'text-md font-bold tracking-wide transition-default block normal-case',
              playerIsMe ? 'text-player-me font-black' : 'text-player-other',
            )}
          >
            {shouldHidePoints && !playerIsMe ? UI.ANONYMOUS : playerName}
          </Text>
        </div>

        {/* 💬 3. COLONNE ACTION / MÉFAIT */}
        <div className="col-span-6 md:col-span-5 flex flex-col text-center min-w-0">
          <Text
            variant={TEXT_VARIANT.CAPTION}
            className={cn(
              'text-xs font-bold tracking-wide transition-default md:hidden block normal-case mb-0.5',
              playerIsMe ? 'text-player-me font-black' : 'text-player-other',
            )}
          >
            {shouldHidePoints && !playerIsMe ? UI.ANONYMOUS : playerName}
          </Text>

          <Stack gap="none" className="min-w-0">
            <Text
              variant={TEXT_VARIANT.BODY}
              colorTheme={TEXT_THEME.WARNING}
              className="text-xs sm:text-sm normal-case italic tracking-normal line-clamp-2 leading-tight"
            >
              {action.description}
            </Text>

            {action.creator_name && (
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="text-[10px] tracking-normal mt-0.5 block"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.REPORTED_BY}{' '}
                <span
                  className={cn(
                    'font-semibold',
                    creatorIsMe ? 'text-player-me' : 'text-player-other',
                  )}
                >
                  {action.creator_name}
                </span>
              </Text>
            )}
          </Stack>
        </div>

        {/* 🎯 4. COMPTEUR DE POINTS */}
        <Stack
          gap="none"
          align="end"
          className="col-span-3 md:col-span-2 text-right justify-center min-w-0"
        >
          {multiplier > 1 && !shouldHidePoints && (
            <Row gap="xs" align="center" justify="end" className="mb-0.5">
              <Text
                variant={TEXT_VARIANT.MONO}
                colorTheme={TEXT_THEME.DIMMED}
                className="line-through text-[10px]"
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
              'flex items-baseline justify-end gap-0.5 w-full',
              displayColor,
            )}
          >
            <Text
              variant={TEXT_VARIANT.MONO}
              colorTheme={TEXT_THEME.INHERIT}
              className="text-sm sm:text-base font-black tabular-nums"
            >
              {pointsDisplay}
            </Text>
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.INHERIT}
              className="opacity-40 text-[10px]"
              as="span"
            >
              {COMPETITION_UI.DETAIL.POINTS_SHORT}
            </Text>
          </span>
        </Stack>
      </Grid>

      {/* 🥞 B. BANNIÈRE DE CONTRÔLE ET ACTIONS */}
      {hasActions && (
        <div className="w-full flex border-t border-border-subtle/50 animate-fade-in divide-x divide-border-subtle/50 select-none">
          {canArbitrate && (
            <>
              <button
                type="button"
                disabled={isChangingStatus}
                onClick={() =>
                  handleActionStatus(action.id, ActionStatus.VALIDATED)
                }
                className="flex-1 py-2 bg-success-soft/20 text-success-bright hover:bg-success/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-default active:bg-success/30 disabled:opacity-50 cursor-pointer"
              >
                <span className="text-xs">{ICONS.SUCCESS}</span>{' '}
                {BUTTONS.ACCEPT}
              </button>

              <button
                type="button"
                disabled={isChangingStatus}
                onClick={() =>
                  handleActionStatus(action.id, ActionStatus.REJECTED)
                }
                className="flex-1 py-2 bg-danger-soft/20 text-danger-bright hover:bg-danger/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-default active:bg-danger/30 disabled:opacity-50 cursor-pointer"
              >
                <span className="text-xs">{ICONS.CANCEL}</span> {BUTTONS.REJECT}
              </button>
            </>
          )}

          {canInvalidate && !canArbitrate && (
            <button
              type="button"
              disabled={isChangingStatus}
              onClick={() =>
                handleActionStatus(action.id, ActionStatus.REJECTED)
              }
              className="flex-1 py-2 bg-danger-soft/10 text-danger-bright hover:bg-danger-soft/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-default active:bg-danger/30 disabled:opacity-50 cursor-pointer"
            >
              <span className="text-xs">{ICONS.CANCEL}</span> Invalider l'action
            </button>
          )}

          {canEdit && (
            <button
              type="button"
              disabled={isChangingStatus}
              onClick={onEdit}
              className="flex-1 py-2 bg-white/5 text-dimmed hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-default active:bg-white/15 disabled:opacity-50 cursor-pointer"
            >
              <span className="text-xs">{ICONS.EDIT}</span> Modifier
            </button>
          )}
        </div>
      )}
    </div>
  );
};
