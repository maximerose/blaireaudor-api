import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Text,
  TEXT_VARIANT,
  ICONS,
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
    <div
      className="flex flex-col items-center gap-2 mt-3 p-4 bg-info/10 border border-info-bright/20 rounded-2xl animate-slide-up"
      role="alert"
    >
      <Text
        variant={TEXT_VARIANT.MICRO}
        className="text-info-bright text-center opacity-100"
      >
        <span aria-hidden="true">{ICONS.GUEST_EYE} </span>{' '}
        {AUTH_UI.GUEST_ALERT.TITLE}
      </Text>

      <Text
        variant={TEXT_VARIANT.BODY}
        className="text-white/70 text-[11px] text-center leading-tight"
      >
        {AUTH_UI.GUEST_ALERT.USERNAME_PREFIX}{' '}
        <Text
          variant={TEXT_VARIANT.MONO}
          as="span"
          className="text-white text-[11px]"
        >
          @{username}
        </Text>{' '}
        {AUTH_UI.GUEST_ALERT.BELONGS_TO}{' '}
        <span className="text-white font-bold">{foundGuest.display_name}</span>.
      </Text>

      {foundGuest.last_competition_name ? (
        <div className="flex items-center gap-1 mt-1 overflow-hidden">
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="italic shrink-0 opacity-20 font-bold"
          >
            {AUTH_UI.GUEST_ALERT.LAST_COMPETITION}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-info-bright/60 italic truncate opacity-100"
          >
            {foundGuest.last_competition_name}
          </Text>
        </div>
      ) : (
        <Badge variant={BADGE_VARIANT.INFO} className="mt-1 opacity-60">
          {AUTH_UI.GUEST_ALERT.NEW_PLAYER}{' '}
          <span aria-hidden="true">{ICONS.GUEST_NEW}</span>
        </Badge>
      )}

      <Button
        variant={BUTTON_VARIANT.SECONDARY}
        size={BUTTON_SIZE.SMALL}
        className="mt-2 w-full border-info-bright/30 hover:bg-info/20 text-info-bright transition-default"
        onClick={onLink}
        type="button"
        aria-label={AUTH_UI.GUEST_ALERT.ARIA_LINK(foundGuest.display_name)}
      >
        {AUTH_UI.GUEST_ALERT.LINK_BUTTON}
      </Button>
    </div>
  );
};
