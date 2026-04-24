import { Button } from '@/components/UI';
import { cn, formatLongDate } from '@/utils';
import { useDateNavigation } from '@/hooks';

interface DateNavigationProps {
  dates: string[];
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
}

export const DateNavigation = ({
  dates,
  selectedDate,
  onSelect,
}: DateNavigationProps) => {
  const { scrollRef, showMask, handleScroll } = useDateNavigation(dates);

  return (
    <nav className="relative group" aria-label="Filtrer les actions par date">
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
          aria-current={selectedDate === null ? 'true' : undefined}
          className={cn(
            'whitespace-nowrap transition-default',
            selectedDate !== null && 'opacity-40 hover:opacity-80',
          )}
        >
          Toutes les dates
        </Button>

        {dates.map((date: string) => (
          <Button
            key={date}
            variant={selectedDate === date ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSelect(date)}
            aria-current={selectedDate === date ? 'true' : undefined}
            className={cn(
              'whitespace-nowrap transition-default',
              selectedDate !== date && 'opacity-40 hover:opacity-80',
            )}
          >
            {formatLongDate(date)}
          </Button>
        ))}
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
