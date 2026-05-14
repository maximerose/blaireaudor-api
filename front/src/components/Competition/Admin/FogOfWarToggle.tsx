import {
  Button,
  Text,
  Badge,
  BADGE_VARIANT,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
} from '@/components/UI';
import { COMPETITION_UI, ICONS } from '@/constants';
import { useAdminContext } from '@/context';
import { cn } from '@/utils';

export const FogOfWarToggle = () => {
  const { isFogActive, handleToggleFog, isUpdating } = useAdminContext();

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant={
          isFogActive ? BUTTON_VARIANT.PRIMARY : BUTTON_VARIANT.SECONDARY
        }
        onClick={handleToggleFog}
        isLoading={isUpdating}
        disabled={isUpdating}
        size={BUTTON_SIZE.MEDIUM}
        className={cn(
          'transition-all duration-500',
          isFogActive
            ? 'border-gold/50 bg-gold/10 hover:bg-gold-light/10'
            : 'border-white/10',
        )}
      >
        <div className="flex items-center gap-4 text-left w-full">
          <div
            className={cn(
              'rounded-full p-1 flex items-center justify-center text-2xl shadow-inner',
              isFogActive ? 'bg-gold' : 'bg-white/5',
            )}
          >
            {ICONS.FOG_STATUS(isFogActive)}
          </div>
          <div className="flex flex-col flex-1">
            <Text
              variant={TEXT_VARIANT.H3}
              className="font-black uppercase text-[11px] leading-none tracking-tight"
            >
              {isFogActive
                ? COMPETITION_UI.ADMIN.FOG.DISABLE
                : COMPETITION_UI.ADMIN.FOG.ENABLE}
            </Text>
            <Text
              variant={TEXT_VARIANT.BODY}
              className="text-[10px] opacity-60 font-normal italic mt-1 leading-tight"
            >
              {isFogActive
                ? COMPETITION_UI.ADMIN.FOG.DESC_OFF
                : COMPETITION_UI.ADMIN.FOG.DESC_ON}
            </Text>
          </div>
          <Badge
            variant={isFogActive ? BADGE_VARIANT.SUCCESS : BADGE_VARIANT.DANGER}
          >
            {isFogActive
              ? COMPETITION_UI.ADMIN.FOG.STATUS_ACTIVE
              : COMPETITION_UI.ADMIN.FOG.STATUS_OFF}
          </Badge>
        </div>
      </Button>
    </div>
  );
};
