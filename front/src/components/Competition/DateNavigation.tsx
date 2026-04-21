import { formatLongDate } from '../../utils/actionUtils';
import { Button } from '../UI/Button';

export const DateNavigation = ({ dates, selectedDate, onSelect }: any) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar selec-none">
      <Button
        variant={selectedDate === null ? 'primary' : 'secondary'}
        onClick={() => onSelect(null)}
        className="whitespace-nowrap"
      >
        Toutes les dates
      </Button>

      {dates.map((date: string) => (
        <Button
          key={date}
          variant={selectedDate === date ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect(date)}
          className="whitespace-nowrap"
        >
          {formatLongDate(date)}
        </Button>
      ))}
    </div>
  );
};
