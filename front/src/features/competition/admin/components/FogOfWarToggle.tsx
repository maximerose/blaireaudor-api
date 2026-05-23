import {
  Text,
  Badge,
  BADGE_VARIANT,
  TEXT_VARIANT,
  cn,
  ICONS,
  Stack,
  Row,
} from '@/shared';
import { useAdminContext } from '@/features/competition/context';
import { COMPETITION_UI } from '@/features/competition/constants';

export const FogOfWarToggle = () => {
  const { isFogActive, handleToggleFog, isUpdating } = useAdminContext();

  return (
    <Stack align="center" gap="sm">
      <Row
        align="center"
        gap="md"
        onClick={!isUpdating ? handleToggleFog : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isUpdating) {
            e.preventDefault();
            handleToggleFog();
          }
        }}
        className={cn(
          'transition-slow h-auto py-3 px-3 sm:px-4 rounded-2xl border flex-col sm:flex-row text-center sm:text-left select-none', // 🟢 duration-500 unifié en transition-slow
          isUpdating ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
          isFogActive
            ? 'border-gold/50 bg-gold/10 hover:bg-gold/15 shadow-[inline_0_0_20px_rgba(212,175,55,0.02)]'
            : 'border-white/10 bg-white/5 hover:bg-white/10',
        )}
      >
        {/* Pastille de l'icône d'état */}
        <div
          className={cn(
            'rounded-full p-2 flex items-center justify-center text-xl shadow-inner shrink-0 transition-colors duration-500',
            isFogActive ? 'bg-gold text-black' : 'bg-white/5 text-text-muted',
          )}
        >
          <div className={cn(isUpdating && 'animate-spin')}>
            {ICONS.FOG_STATUS(isFogActive)}
          </div>
        </div>

        {/* Bloc Textes */}
        <Stack gap="none" className="flex-1 min-w-0">
          <Text
            variant={TEXT_VARIANT.H3}
            className="font-black uppercase text-[10px] sm:text-[11px] leading-none tracking-tight"
          >
            {isFogActive
              ? COMPETITION_UI.ADMIN.FOG.DISABLE
              : COMPETITION_UI.ADMIN.FOG.ENABLE}
          </Text>
          <Text
            variant={TEXT_VARIANT.BODY}
            className="text-[9px] sm:text-[10px] opacity-60 font-normal italic mt-1 leading-tight line-clamp-2"
          >
            {isFogActive
              ? COMPETITION_UI.ADMIN.FOG.DESC_OFF
              : COMPETITION_UI.ADMIN.FOG.DESC_ON}
          </Text>
        </Stack>

        {/* Badge de statut final */}
        <div className="shrink-0">
          <Badge
            variant={isFogActive ? BADGE_VARIANT.SUCCESS : BADGE_VARIANT.DANGER}
            className={cn(isUpdating && 'animate-pulse')}
          >
            {isUpdating
              ? '...'
              : isFogActive
                ? COMPETITION_UI.ADMIN.FOG.STATUS_ACTIVE
                : COMPETITION_UI.ADMIN.FOG.STATUS_OFF}
          </Badge>
        </div>
      </Row>
    </Stack>
  );
};
