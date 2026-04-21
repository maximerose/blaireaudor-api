import { useActionTable } from '../../hooks/useActionTable';
import { DateNavigation } from './DateNavigation';

export const ActionTable = ({ actions }: { actions: any[] }) => {
  const {
    sortedActions,
    sortField,
    sortOrder,
    handleSort,
    selectedDate,
    setSelectedDate,
    availableDates,
  } = useActionTable(actions);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <span className="ml-1 opacity-20">↕</span>;
    return (
      <span className="ml-1 text-gold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
    );
  };

  return (
    <div className="space-y-4">
      <DateNavigation
        dates={availableDates}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      {/* Header de Tri - Adapté pour être cliquable sur Mobile */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gold/10 rounded-t-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-gold/60">
        <button
          className="col-span-3 md:col-span-2 text-left flex items-center hover:text-gold transition-colors"
          onClick={() => handleSort('date_action')}
        >
          Date <SortIcon field="date_action" />
        </button>
        <button
          className="col-span-6 md:col-span-3 text-left flex items-center hover:text-gold transition-colors"
          onClick={() => handleSort('player')}
        >
          Joueur <SortIcon field="player" />
        </button>
        <div className="hidden md:block md:col-span-5">Action</div>
        <button
          className="col-span-3 md:col-span-2 text-right flex items-center justify-end hover:text-gold transition-colors"
          onClick={() => handleSort('points')}
        >
          Points <SortIcon field="points" />
        </button>
      </div>

      <div className="bg-black/20 border-x border-b border-white/5 rounded-b-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {sortedActions.map((action) => {
            const isPending = action.status?.toUpperCase() === 'PENDING';
            return (
              <div
                key={action.id}
                className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-3 md:col-span-2 text-[10px] font-mono text-white/40">
                  {new Date(action.date_action).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </div>

                <div className="col-span-6 md:col-span-8 flex flex-col md:grid md:grid-cols-8 md:gap-4 overflow-hidden">
                  <span className="text-xs md:text-sm font-bold text-white truncate md:col-span-3">
                    {action.player?.display_name || 'Anonyme'}
                  </span>
                  {isPending && (
                    <span className="text-[7px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/30 font-black uppercase tracking-tighter shrink-0 animate-pulse">
                      En attente
                    </span>
                  )}
                  <span
                    className="text-[10px] md:text-xs text-white/50 italic truncate md:col-span-5 md:text-white/70"
                    title={action.description}
                  >
                    "{action.description}"
                  </span>
                </div>

                <div className="col-span-3 md:col-span-2 text-right">
                  <span
                    className={`text-sm md:text-base font-black font-mono ${action.points >= 0 ? 'text-gold' : 'text-red-500'}`}
                  >
                    {action.points >= 0 ? `+${action.points}` : action.points}
                    <span className="ml-0.5 text-[8px] opacity-40 uppercase">
                      pts
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {sortedActions.length === 0 && (
          <div className="p-10 text-center text-white/20 text-xs italic">
            Aucune action trouvée.
          </div>
        )}
      </div>
    </div>
  );
};
