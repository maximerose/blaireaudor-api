import { Button, Text } from '@/components/UI';
import { COMPETITION_UI } from '@/constants';
import { cn } from '@/utils';

export const CloseCompetitionAction = ({
  onSafeClose,
  isLoading,
  pendingCount,
}: any) => (
  <div className="flex flex-col items-center gap-3 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
    <Text
      variant="caption"
      className="opacity-40 uppercase font-black text-[10px] tracking-widest"
    >
      {COMPETITION_UI.ADMIN.CLOSE.HEADER}
    </Text>
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="danger"
        onClick={onSafeClose}
        isLoading={isLoading}
        className={cn(
          'w-full sm:w-auto',
          pendingCount > 0 && 'opacity-50 cursor-not-allowed',
        )}
      >
        {COMPETITION_UI.ADMIN.CLOSE.SUBMIT}
      </Button>
      {pendingCount > 0 && (
        <Text
          variant="micro"
          className="text-danger-bright animate-pulse font-bold"
        >
          {COMPETITION_UI.ADMIN.CLOSE.PENDING_WARNING(pendingCount)}
        </Text>
      )}
    </div>
  </div>
);
