import { formatLongDate } from '../../utils/actionUtils';

export const DateNavigation = ({ dates, selectedDate, onSelect }: any) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar selec-none">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
          selectedDate === null
            ? 'bg-gold text-dark border-gold'
            : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
        }`}
      >
        Toutes les dates
      </button>

      {dates.map((date: string) => (
        <button
          key={date}
          onClick={() => onSelect(date)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
            selectedDate === date
              ? 'bg-gold text-dark border-gold'
              : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
          }`}
        >
          {formatLongDate(date)}
        </button>
      ))}
    </div>
  );
};
