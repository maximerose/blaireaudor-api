import { useRef, useState, useEffect } from 'react';
import { formatLongDate } from '../../utils/actionUtils';
import { Button } from '../UI/Button';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMask, setShowMask] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 20;
      const canScroll = scrollWidth > clientWidth;
      setShowMask(canScroll && !isAtEnd);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [dates]);

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto pb-4 no-scrollbar select-none"
      >
        <Button
          variant={selectedDate === null ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect(null)}
          className={`whitespace-nowrap ${selectedDate === null ? '' : 'opacity-60'}`}
        >
          Toutes les dates
        </Button>

        {dates.map((date: string) => (
          <Button
            key={date}
            variant={selectedDate === date ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSelect(date)}
            className={`whitespace-nowrap ${selectedDate === date ? '' : 'opacity-60'}`}
          >
            {formatLongDate(date)}
          </Button>
        ))}
      </div>
      <div
        className={`
          absolute right-0 top-0 bottom-4 w-20 pointer-events-none 
          bg-linear-to-r from-transparent to-dark
          transition-opacity duration-500 ease-in-out
          ${showMask ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
};
