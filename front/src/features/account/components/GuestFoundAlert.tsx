import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  ICONS,
  Row,
  Stack,
} from '@/shared';
import { AUTH_UI } from '@/features/account/constants';
import type { PlayerCompact } from '@/features/player';

interface GuestFoundAlertProps {
  foundGuest: PlayerCompact;
  username: string;
  onLink: () => void;
}

export const GuestFoundAlert = ({
  foundGuest,
  username,
  onLink,
}: GuestFoundAlertProps) => {
  return (
    <Stack
      align="center"
      gap="sm"
      p="md"
      className="bg-info-soft border border-info-border rounded-2xl animate-slide-up"
      role="alert"
    >
      <Text
        variant={TEXT_VARIANT.MICRO}
        colorTheme={TEXT_THEME.INFO}
        className="text-center"
      >
        <span className="mr-1" aria-hidden="true">
          {ICONS.GUEST_EYE}
        </span>{' '}
        {AUTH_UI.GUEST_ALERT.TITLE}
      </Text>

      <Text
        variant={TEXT_VARIANT.BODY}
        colorTheme={TEXT_THEME.MUTED}
        className="text-center leading-tight"
      >
        {AUTH_UI.GUEST_ALERT.USERNAME_PREFIX}{' '}
        <Text
          variant={TEXT_VARIANT.MONO}
          as="span"
          colorTheme={TEXT_THEME.INFO}
          className="lowercase"
        >
          @{username}
        </Text>{' '}
        {AUTH_UI.GUEST_ALERT.BELONGS_TO}{' '}
        <Text as="span" colorTheme={TEXT_THEME.INFO} className="font-bold">
          {foundGuest.display_name}
        </Text>
        .
      </Text>

      {foundGuest.last_competition_name ? (
        <Row
          align="center"
          justify="center"
          gap="xs"
          className="overflow-hidden"
        >
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="italic shrink-0"
          >
            {AUTH_UI.GUEST_ALERT.LAST_COMPETITION}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.INFO}
            className="italic truncate"
          >
            {foundGuest.last_competition_name}
          </Text>
        </Row>
      ) : (
        <Badge variant={BADGE_VARIANT.INFO}>
          {AUTH_UI.GUEST_ALERT.NEW_PLAYER}{' '}
          <span aria-hidden="true">{ICONS.GUEST_NEW}</span>
        </Badge>
      )}

      <Button
        variant={BUTTON_VARIANT.SECONDARY}
        size={BUTTON_SIZE.SMALL}
        fullWidth
        onClick={onLink}
        aria-label={AUTH_UI.GUEST_ALERT.ARIA_LINK(foundGuest.display_name)}
      >
        {AUTH_UI.GUEST_ALERT.LINK_BUTTON}
      </Button>
    </Stack>
  );
};
