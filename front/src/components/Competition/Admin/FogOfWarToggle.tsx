import { Button, Text, Badge } from '@/components/UI';
import { COMPETITION_UI, ICONS } from '@/constants';
import { useAdmin } from '@/context/AdminProvider';
import { cn } from '@/utils';

export const FogOfWarToggle = () => {
  const { isFogActive, handleToggleFog, isUpdating } = useAdmin();

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant={isFogActive ? 'primary' : 'ghost'}
        onClick={handleToggleFog}
        isLoading={isUpdating}
        className={cn(
          'w-full sm:w-auto min-w-70 h-20 transition-all duration-500',
          isFogActive ? 'border-gold/50 bg-gold/10' : 'border-white/10',
        )}
      >
        <div className="flex items-center gap-4 text-left w-full">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner',
              isFogActive ? 'bg-gold text-black' : 'bg-white/5 text-white/20',
            )}
          >
            {ICONS.FOG_STATUS(isFogActive)}
          </div>
          <div className="flex flex-col flex-1">
            <Text
              variant="h3"
              className="font-black uppercase text-[11px] leading-none tracking-tight"
            >
              {isFogActive
                ? COMPETITION_UI.ADMIN.FOG.DISABLE
                : COMPETITION_UI.ADMIN.FOG.ENABLE}
            </Text>
            <Text
              variant="body"
              className="text-[10px] opacity-60 font-normal italic mt-1 leading-tight"
            >
              {isFogActive
                ? COMPETITION_UI.ADMIN.FOG.DESC_OFF
                : COMPETITION_UI.ADMIN.FOG.DESC_ON}
            </Text>
          </div>
          <Badge variant={isFogActive ? 'success' : 'warning'}>
            {isFogActive
              ? COMPETITION_UI.ADMIN.FOG.STATUS_ACTIVE
              : COMPETITION_UI.ADMIN.FOG.STATUS_OFF}
          </Badge>
        </div>
      </Button>
    </div>
  );
};
