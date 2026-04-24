import { useActionTable } from '@/hooks';
import { cn } from '@/utils';
import { Card, EmptyState, Text } from '@/components/UI';
import { DateNavigation, ActionRow } from '@/components/Competition';

const TABLE_COLUMNS = [
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
];

export const ActionTable = ({ actions }: { actions: any[] }) => {
  const {
    sortedActions,
    handleSort,
    selectedDate,
    setSelectedDate,
    availableDates,
    getAriaSort,
    getSortIndicator,
  } = useActionTable(actions);

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
          {TABLE_COLUMNS.map((col) => {
            const indicator = getSortIndicator(col.id);

            return (
              <div
                key={col.id}
                role="columnheader"
                aria-sort={col.noSort ? undefined : getAriaSort(col.id)}
                className={col.colSpan}
              >
                {!col.noSort ? (
                  <button
                    className={cn(
                      'w-full flex items-center group transition-default hover:text-gold focus-visible:outline-none focus-visible:text-gold',
                      col.align === 'text-center' && 'justify-center',
                      col.align === 'text-right' && 'justify-end',
                    )}
                    onClick={() => handleSort(col.id)}
                    aria-label={`Trier par ${col.label}`}
                  >
                    <Text
                      variant="micro"
                      className="text-inherit opacity-60 uppercase font-black tracking-widest transition-default"
                    >
                      {col.label}
                    </Text>
                    <span className={indicator.className} aria-hidden="true">
                      {indicator.char}
                    </span>
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
            );
          })}
        </div>
      </div>

      <Card
        variant="dark"
        className="rounded-t-none border-t-0 shadow-2xl overflow-hidden"
      >
        <div className="divide-y divide-white/5" role="rowgroup">
          {sortedActions.map((action) => (
            <ActionRow key={action.id} action={action} />
          ))}
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
