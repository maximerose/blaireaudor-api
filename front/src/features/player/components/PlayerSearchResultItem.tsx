import type React from 'react';
import { Badge, BADGE_VARIANT, Text, FORM, ICONS, Stack, Row } from '@/shared';
import type { PlayerCompact } from '@/features/player/types';
import { usePlayerSearchResultUI } from '@/features/player/hooks/usePlayerSearchResultUI';

interface Props extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  player: PlayerCompact;
  onClick: (player: PlayerCompact) => void;
  actionIcon?: string | React.ReactNode;
}

export const PlayerSearchResultItem = ({
  player,
  onClick,
  actionIcon = '+',
  className = '',
  ...props
}: Props) => {
  const { name, lastComp, classes } = usePlayerSearchResultUI(
    player,
    className,
  );

  return (
    <button
      type="button"
      onClick={() => onClick(player)}
      role="option"
      aria-label={FORM.ADMIN.ENROLLMENT.SELECT_ARIA(name || '')}
      className={classes.container}
      {...props}
    >
      <Stack gap="none" align="start" className={classes.infoWrapper}>
        <Text as="span" className={classes.name}>
          {name}
        </Text>

        <Text as="span" className={classes.username}>
          @{player.username}
        </Text>

        {lastComp ? (
          <Row className={classes.lastCompWrapper}>
            <Text as="span" className={classes.lastCompLabel}>
              {FORM.ADMIN.ENROLLMENT.LAST_COMPETITION}
            </Text>
            <Text as="span" className={classes.lastCompValue}>
              {lastComp}
            </Text>
          </Row>
        ) : (
          <Badge
            variant={BADGE_VARIANT.INFO}
            className={classes.newPlayerBadge}
          >
            {FORM.ADMIN.ENROLLMENT.NEW_PLAYER_HINT}{' '}
            <span aria-hidden="true">{ICONS.GUEST_NEW}</span>
          </Badge>
        )}
      </Stack>

      <div className={classes.actionWrapper} aria-hidden="true">
        <span className={classes.actionIcon}>{actionIcon}</span>
      </div>
    </button>
  );
};
