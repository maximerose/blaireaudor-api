import { Button } from '@/components/UI';
import { cn, formatLongDate } from '@/utils';
import { useDateNavigation } from '@/hooks';
import { useCompetition } from '@/context/CompetitionContext';

export const DateNavigation = ({ dates, selectedDate, onSelect }: any) => {
  const { getMultiplier } = useCompetition();
  const { scrollRef, showMask, handleScroll } = useDateNavigation(dates);

  return (
    <nav className="relative group z-20" aria-label="Filtrer les actions par date">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto pb-4 no-scrollbar select-none"
        role="group"
      >
        <Button
          variant={selectedDate === null ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect(null)}
          className={cn(selectedDate !== null && 'opacity-40')}
        >
          Toutes les dates
        </Button>

        {dates.map((date: string) => {
          const multiplier = getMultiplier(date);
          const isActive = selectedDate === date;

          return (
            <div key={date} className="relative">
              <Button
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onSelect(date)}
                className={cn(
                  'whitespace-nowrap transition-default relative overflow-hidden px-4',
                  !isActive && 'opacity-40 hover:opacity-80',
                  multiplier && 'animate-danger-glow border-danger/50 pr-8'
                )}
              >
                {formatLongDate(date)}

                {multiplier && (
                  <div className="absolute top-0 right-0 w-10 h-10 overflow-hidden pointer-events-none">
                    <div className={cn(
                      "absolute top-0 right-0 bg-danger w-[140%] h-5 rotate-45 translate-x-[30%] -translate-y-[10%]",
                      "flex items-center justify-center shadow-lg border-b border-white/20",
                      "animate-pulse"
                    )}>
                      <span className="text-[9px] font-black text-white uppercase tracking-tighter pt-1.5 pl-1">
                        x{multiplier}
                      </span>
                    </div>
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'absolute right-0 top-0 bottom-4 w-24 pointer-events-none transition-slow',
          'bg-linear-to-r from-transparent to-dark',
          showMask ? 'opacity-100' : 'opacity-0',
        )}
      />
    </nav>
  );
};

