import { useActionTable } from '../../hooks/useActionTable';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Text } from '../UI/Typography';
import { DateNavigation } from './DateNavigation';
import { EmptyState } from '../UI/EmptyState';

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
    if (sortField !== field) return <span className="ml-1 opacity-10">↕</span>;
    return (
      <span className="ml-1 text-gold animate-fade-in">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <DateNavigation
        dates={availableDates}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-gold/5 rounded-t-3xl border-x border-t border-gold/10 text-[9px] font-black uppercase tracking-[0.2em] text-gold/40 mb-0">
        <button
          className="col-span-3 md:col-span-2 text-left flex items-center hover:text-gold transition-colors group"
          onClick={() => handleSort('date_action')}
        >
          Date <SortIcon field="date_action" />
        </button>

        <button
          className="col-span-6 md:col-span-3 text-center flex items-center justify-center hover:text-gold transition-colors group"
          onClick={() => handleSort('player')}
        >
          Joueur <SortIcon field="player" />
        </button>

        <div className="hidden md:block md:col-span-5 text-center">Action</div>

        <button
          className="col-span-3 md:col-span-2 text-right flex items-center justify-end hover:text-gold transition-colors group"
          onClick={() => handleSort('points')}
        >
          Points <SortIcon field="points" />
        </button>
      </div>

      <Card
        variant="dark"
        className="rounded-t-none border-t-0 shadow-2xl overflow-hidden"
      >
        <div className="divide-y divide-white/5">
          {sortedActions.map((action) => {
            const isPending = action.status?.toUpperCase() === 'PENDING';

            return (
              <div
                key={action.id}
                className="grid grid-cols-12 gap-2 p-2 items-center hover:bg-white/2 transition-all group"
              >
                <div className="col-span-3 md:col-span-2">
                  <Text
                    variant="mono"
                    className="text-[10px] text-white/20 group-hover:text-white/40 transition-colors"
                  >
                    {new Date(action.date_action).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </Text>
                </div>

                <div className="col-span-6 md:col-span-8 flex flex-col items-center md:grid md:grid-cols-8 md:gap-4 overflow-hidden">
                  <div className="flex items-center justify-center md:col-span-3 overflow-hidden w-full">
                    <span className="text-xs font-bold text-white truncate">
                      {action.player?.display_name || 'Anonyme'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center md:col-span-5 w-full">
                    <span
                      className="text-[10px] md:text-xs text-white/40 italic md:text-white/60 w-full text-center"
                      title={action.description}
                    >
                      "{action.description}"
                    </span>

                    {isPending && (
                      <Badge
                        variant="warning"
                        isPulse
                        className="text-[6px] px-1.5 py-0 mt-1 uppercase"
                      >
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="col-span-3 md:col-span-2 text-right">
                  <span
                    className={`text-sm md:text-base font-black font-mono tabular-nums ${
                      action.points >= 0 ? 'text-danger' : 'text-success-bright'
                    }`}
                  >
                    {action.points >= 0 ? `+${action.points}` : action.points}
                    <span className="ml-1 text-[8px] opacity-60 uppercase font-bold">
                      pts
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {sortedActions.length === 0 && (
          <EmptyState
            layout="card"
            icon="📜"
            title="Casier vierge"
            message="Aucune action à signaler."
          />
        )}
      </Card>
    </div>
  );
};
