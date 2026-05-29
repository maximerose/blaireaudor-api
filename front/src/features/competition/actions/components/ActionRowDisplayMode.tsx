// front/src/features/competition/actions/components/ActionRowDisplayMode.tsx

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
  IconButton,
  ICONS,
  Row,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';

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
    canEdit,
  } = useActionRow(action);

  // Correction : Suppression du franglais pour une variable claire et lisible
  const canArbitrate = isPending && isAdmin && !competition.is_finished;

  return (
    <div
      className={cn(
        'flex flex-col border-b border-border-subtle/30 last:border-0 w-full relative group',
        playerIsMe ? 'bg-player-me-bg' : 'bg-transparent',
      )}
    >
      {/* 🥞 A. LIGNE PRINCIPALE DE CONTENU */}
      <Grid cols={12} gap="sm" align="center" className="p-4 w-full">
        {/* 📅 1. DATE */}
        <div className="col-span-2">
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="text-[11px] sm:text-xs font-mono text-left block"
          >
            {formatCompactDate(action.date_action)}
          </Text>
        </div>

        {/* 💬 2. INFOS DU MÉFAIT (Typographie hiérarchisée et harmonieuse) */}
        <div className="col-span-7 md:col-span-8 flex flex-col text-left min-w-0">
          <Text
            variant={TEXT_VARIANT.CAPTION}
            className={cn(
              'text-md font-bold tracking-wide transition-default block normal-case',
              playerIsMe ? 'text-player-me font-black' : 'text-player-other',
            )}
          >
            {playerName}
          </Text>

          <Stack gap="none" className="min-w-0 mt-0.5">
            <Text
              variant={TEXT_VARIANT.BODY}
              colorTheme={TEXT_THEME.WARNING}
              className="text-sm normal-case italic tracking-normal line-clamp-2 leading-tight"
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

        {/* 🎯 3. COMPTEUR DE POINTS GÉRAL */}
        <Stack
          gap="none"
          align="end"
          className={cn(
            'col-span-3 md:col-span-2 text-right justify-center min-w-0',
            canEdit && 'max-md:pr-3',
          )}
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

      {/* 📱 B. INTERFACE DE CONTROLE MOBILE (Bannières d'arbitrage Full-Width) */}
      {canArbitrate && (
        <div className="w-full grid grid-cols-2 border-t border-border-subtle/50 md:hidden animate-fade-in divide-x divide-border-subtle/50 select-none">
          <button
            type="button"
            onClick={() =>
              handleActionStatus(action.id, ActionStatus.VALIDATED)
            }
            className="py-3 bg-success-soft/20 text-success-bright font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-default active:bg-success/20"
          >
            <span className="text-xs">{ICONS.SUCCESS}</span> {BUTTONS.ACCEPT}
          </button>
          <button
            type="button"
            onClick={() => handleActionStatus(action.id, ActionStatus.REJECTED)}
            className="py-3 bg-danger-soft/20 text-danger-bright font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-default active:bg-danger/20"
          >
            <span className="text-xs">{ICONS.CANCEL}</span> {BUTTONS.REJECT}
          </button>
        </div>
      )}

      {/* 🖥️ C. INTERFACE DE CONTROLE DESKTOP (Menu en survol à droite) */}
      {/* Si l'arbitrage est possible, on affiche le pack complet en survol */}
      {canArbitrate && (
        <div className="hidden md:flex items-center gap-1.5 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-default bg-dark-lighter/90 backdrop-blur-xs pl-2 py-1 rounded-l-xl z-10">
          <IconButton
            icon={ICONS.SUCCESS}
            className="bg-success-soft border border-success-border/30 text-success-bright hover:bg-success/20"
            onClick={() =>
              handleActionStatus(action.id, ActionStatus.VALIDATED)
            }
            title={BUTTONS.ACCEPT}
          />
          <IconButton
            icon={ICONS.CANCEL}
            className="bg-danger-soft border border-danger-border/30 text-danger-bright hover:bg-danger/20"
            onClick={() => handleActionStatus(action.id, ActionStatus.REJECTED)}
            title={BUTTONS.REJECT}
          />
          {canEdit && (
            <IconButton
              icon={ICONS.EDIT}
              onClick={onEdit}
              title={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.ARIA.UPDATE_ACTION}
            />
          )}
        </div>
      )}

      {/* Si pas d'arbitrage requis mais modifiable, bouton d'édition classique en survol sur Desktop */}
      {canEdit && !canArbitrate && (
        <IconButton
          icon={ICONS.EDIT}
          onClick={onEdit}
          className="absolute right-2 top-1/2 -translate-y-1/2 max-md:hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-default z-10"
          aria-label={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.ARIA.UPDATE_ACTION}
        />
      )}

      {/* 📱 D. INTERFACE D'ÉDITION MOBILE (Bouton d'édition toujours accessible en haut à droite) */}
      {canEdit && (
        <IconButton
          icon={ICONS.EDIT}
          onClick={onEdit}
          className="absolute right-1 top-3 md:hidden opacity-50 focus:opacity-100 p-1"
          aria-label={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.ARIA.UPDATE_ACTION}
        />
      )}
    </div>
  );
};
