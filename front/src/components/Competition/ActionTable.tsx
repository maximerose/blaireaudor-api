import { useActionTable } from '../../hooks/useActionTable';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Text } from '../UI/Typography';
import { DateNavigation } from './DateNavigation';
import { EmptyState } from '../UI/EmptyState';
import { cn } from '../../utils/cn';

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

      <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-gold/5 rounded-t-3xl border-x border-t border-gold/10 mb-0">
        <button
          className="col-span-3 md:col-span-2 text-left flex items-center hover:text-gold transition-colors group"
          onClick={() => handleSort('date_action')}
        >
          <Text variant="micro" className="text-inherit opacity-40">
            Date
          </Text>
          <SortIcon field="date_action" />
        </button>

        <button
          className="col-span-6 md:col-span-3 text-center flex items-center justify-center hover:text-gold transition-colors group"
          onClick={() => handleSort('player')}
        >
          <Text variant="micro" className="text-inherit opacity-40">
            Joueur
          </Text>
          <SortIcon field="player" />
        </button>

        <div className="hidden md:block md:col-span-5 text-center">
          <Text variant="micro" className="opacity-40">
            Action
          </Text>
        </div>

        <button
          className="col-span-3 md:col-span-2 text-right flex items-center justify-end hover:text-gold transition-colors group"
          onClick={() => handleSort('points')}
        >
          <Text variant="micro" className="text-inherit opacity-40">
            Points
          </Text>
          <SortIcon field="points" />
        </button>
      </div>

      <Card
        variant="dark"
        className="rounded-t-none border-t-0 shadow-2xl overflow-hidden"
      >
        <div className="divide-y divide-white/5">
          {sortedActions.map((action) => {
            const isPending = action.status?.toUpperCase() === 'PENDING';
            const isPositive = action.points >= 0;

            return (
              <div
                key={action.id}
                className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/2 transition-all group"
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
                    <Text
                      variant="h3"
                      className="text-white truncate normal-case italic text-xs"
                    >
                      {action.player?.display_name || 'Anonyme'}
                    </Text>
                  </div>

                  <div className="flex flex-col items-center md:col-span-5 w-full">
                    <Text
                      variant="body"
                      className="text-[10px] md:text-xs text-white/40 italic md:text-white/60 w-full text-center truncate"
                      title={action.description}
                    >
                      "{action.description}"
                    </Text>

                    {isPending && (
                      <Badge variant="warning" isPulse className="mt-1">
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="col-span-3 md:col-span-2 text-right">
                  <Text
                    variant="mono"
                    className={cn(
                      'text-sm md:text-base font-black',
                      isPositive ? 'text-danger' : 'text-success-bright',
                    )}
                  >
                    {isPositive ? `+${action.points}` : action.points}
                    <Text
                      variant="micro"
                      as="span"
                      className="ml-1 opacity-40 lowercase"
                    >
                      pts
                    </Text>
                  </Text>
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
