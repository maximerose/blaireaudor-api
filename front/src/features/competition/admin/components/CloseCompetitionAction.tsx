import { Button, BUTTON_VARIANT, cn, Text, TEXT_VARIANT } from '@/shared';
import { COMPETITION_UI, useAdminContext } from '@/features/competition';

export const CloseCompetitionAction = () => {
  const { handleCloseCompetition, isUpdating, pendingCount } =
    useAdminContext();

  return (
    <div className="flex flex-col items-center gap-3 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
      <Text
        variant={TEXT_VARIANT.CAPTION}
        className="opacity-40 uppercase font-black text-[10px] tracking-widest"
      >
        {COMPETITION_UI.ADMIN.CLOSE.HEADER}
      </Text>
      <div className="flex flex-col items-center gap-2">
        <Button
          variant={BUTTON_VARIANT.DANGER}
          onClick={handleCloseCompetition}
          isLoading={isUpdating}
          disabled={pendingCount > 0}
          className={cn(
            'w-full sm:w-auto',
            pendingCount > 0 && 'opacity-50 cursor-not-allowed',
          )}
        >
          {COMPETITION_UI.ADMIN.CLOSE.SUBMIT}
        </Button>
        {pendingCount > 0 && (
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-danger-bright animate-pulse font-bold"
          >
            {COMPETITION_UI.ADMIN.CLOSE.PENDING_WARNING(pendingCount)}
          </Text>
        )}
      </div>
    </div>
  );
};
