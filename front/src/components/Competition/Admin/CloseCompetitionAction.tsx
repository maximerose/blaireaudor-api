import { Button, Text } from '@/components/UI';
import { cn } from '@/utils';

export const CloseCompetitionAction = ({
  onSafeClose,
  isLoading,
  pendingCount,
}: any) => (
  <div className="flex flex-col items-center lg:items-end gap-3 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
    <Text
      variant="caption"
      className="opacity-40 uppercase font-black text-[10px] tracking-widest"
    >
      Fin de partie
    </Text>
    <div className="flex flex-col items-center lg:items-end gap-2">
      <Button
        variant="danger"
        onClick={onSafeClose}
        isLoading={isLoading}
        className={cn(
          'w-full sm:w-auto',
          pendingCount > 0 && 'opacity-50 cursor-not-allowed',
        )}
      >
        🚩 Clôturer la compétition
      </Button>
      {pendingCount > 0 && (
        <Text
          variant="micro"
          className="text-danger-bright animate-pulse font-bold"
        >
          ⚠️ {pendingCount} actions en attente
        </Text>
      )}
    </div>
  </div>
);
