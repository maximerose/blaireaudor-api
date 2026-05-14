import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@/components/UI';
import { cn, formatLongDate } from '@/utils';
import { useDateNavigation } from '@/hooks';
import { COMPETITION_UI } from '@/constants';
import { useActionTableContext, useCompetitionContext } from '@/context';

export const DateNavigation = () => {
  const { availableDates, selectedDate, setSelectedDate } =
    useActionTableContext();
  const { getMultiplier } = useCompetitionContext();
  const { scrollRef, showMask, handleScroll } =
    useDateNavigation(availableDates);

  return (
    <nav
      className="relative group z-20"
      aria-label="Filtrer les actions par date"
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto pb-4 no-scrollbar select-none"
        role="group"
      >
        <Button
          variant={
            selectedDate === null
              ? BUTTON_VARIANT.PRIMARY
              : BUTTON_VARIANT.SECONDARY
          }
          size={BUTTON_SIZE.SMALL}
          onClick={() => setSelectedDate(null)}
          className={cn(selectedDate !== null && 'opacity-40')}
        >
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.ALL_DATES}
        </Button>

        {availableDates.map((date: string) => {
          const multiplier = getMultiplier(date);
          const isActive = selectedDate === date;

          return (
            <div key={date} className="relative">
              <Button
                variant={
                  isActive ? BUTTON_VARIANT.PRIMARY : BUTTON_VARIANT.SECONDARY
                }
                size={BUTTON_SIZE.SMALL}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'whitespace-nowrap transition-default relative overflow-hidden px-4',
                  !isActive && 'opacity-40 hover:opacity-80',
                  multiplier && 'border-game-bonus/50 pr-8',
                )}
              >
                {formatLongDate(date)}

                {multiplier && (
                  <div className="absolute top-0 right-0 bottom-0 w-6 bg-game-bonus flex items-center justify-center border-l border-white/20">
                    <span className="text-[10px] font-black text-white">
                      x{multiplier}
                    </span>
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
