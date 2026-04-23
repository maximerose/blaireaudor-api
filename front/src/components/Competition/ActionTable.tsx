import { useActionTable } from '../../hooks/useActionTable';
import { cn } from '../../utils/cn';
import { Badge } from '../UI/Badge';
import { Card } from '../UI/Card';
import { EmptyState } from '../UI/EmptyState';
import { Text } from '../UI/Typography';
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

  const getAriaSort = (field: string) => {
    if (sortField !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field)
      return (
        <span className="ml-1 opacity-10" aria-hidden="true">
          ↕
        </span>
      );
    return (
      <span className="ml-1 text-gold animate-fade-in" aria-hidden="true">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div
      className="space-y-4 animate-fade-in"
      role="table"
      aria-label="Historique des actions"
    >
      <DateNavigation
        dates={availableDates}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <div
        className="grid grid-cols-12 gap-2 px-6 py-2 bg-gold/5 rounded-t-3xl border-x border-t border-gold/10 mb-0"
        role="rowgroup"
      >
        <div role="row" className="contents">
          {[
            {
              id: 'date_action',
              label: 'Date',
              colSpan: 'col-span-3 md:col-span-2',
              align: 'text-left',
            },
            {
              id: 'player',
              label: 'Joueur',
              colSpan: 'col-span-6 md:col-span-3',
              align: 'text-center',
            },
            {
              id: 'description',
              label: 'Action',
              colSpan: 'hidden md:block md:col-span-5',
              align: 'text-center',
              noSort: true,
            },
            {
              id: 'points',
              label: 'Points',
              colSpan: 'col-span-3 md:col-span-2',
              align: 'text-right',
            },
          ].map((col) => (
            <div
              key={col.id}
              role="columnheader"
              aria-sort={col.noSort ? undefined : getAriaSort(col.id)}
              className={col.colSpan}
            >
              {!col.noSort ? (
                <button
                  className={cn(
                    'w-full flex items-center group transition-colors hover:text-gold focus-visible:outline-none focus-visible:text-gold',
                    col.align === 'text-center' && 'justify-center',
                    col.align === 'text-right' && 'justify-end',
                  )}
                  onClick={() => handleSort(col.id)}
                  aria-label={`Trier par ${col.label}`}
                >
                  <Text
                    variant="micro"
                    className="text-inherit opacity-60 uppercase font-black tracking-widest"
                  >
                    {col.label}
                  </Text>
                  <SortIcon field={col.id} />
                </button>
              ) : (
                <Text
                  variant="micro"
                  className="opacity-60 uppercase font-black tracking-widest text-center"
                >
                  {col.label}
                </Text>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card
        variant="dark"
        className="rounded-t-none border-t-0 shadow-2xl overflow-hidden"
      >
        <div className="divide-y divide-white/5" role="rowgroup">
          {sortedActions.map((action) => {
            const isPending = action.status?.toUpperCase() === 'PENDING';
            const isPositive = action.points >= 0;

            return (
              <div
                key={action.id}
                role="row"
                className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/2 transition-all group"
              >
                <div className="col-span-3 md:col-span-2" role="cell">
                  <Text
                    variant="mono"
                    className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors"
                  >
                    {new Date(action.date_action).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </Text>
                </div>

                <div
                  className="col-span-6 md:col-span-8 flex flex-col items-center md:grid md:grid-cols-8 md:gap-4 overflow-hidden"
                  role="cell"
                >
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
                      className="text-[10px] md:text-xs text-white/50 italic md:text-white/70 w-full text-center truncate"
                      title={action.description}
                    >
                      "{action.description}"
                    </Text>

                    {isPending && (
                      <Badge
                        variant="warning"
                        isPulse
                        className="mt-1"
                        aria-label="Action en attente de validation"
                      >
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>

                <div
                  className="col-span-3 md:col-span-2 text-right"
                  role="cell"
                >
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
                      className="ml-1 opacity-50 lowercase"
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
