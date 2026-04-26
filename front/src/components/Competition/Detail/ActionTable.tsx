// front/src/components/Competition/Detail/ActionTable.tsx
import { useActionTable, useAuth } from '@/hooks';
import { cn } from '@/utils';
import { Card, EmptyState, Text, Badge } from '@/components/UI';
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

interface ActionTableProps {
  actions: any[];
  isAdmin?: boolean;
  hidePoints?: boolean;
  onUpdate?: (id: string, data: any) => Promise<boolean>;
  onStatusChange?: (
    id: string,
    status: 'validated' | 'rejected',
  ) => Promise<boolean>;
}

export const ActionTable = ({
  actions,
  isAdmin,
  hidePoints,
  onUpdate,
  onStatusChange,
}: ActionTableProps) => {
  const {
    sortedActions,
    handleSort,
    selectedDate,
    setSelectedDate,
    availableDates,
    getAriaSort,
    getSortIndicator,
  } = useActionTable(actions);

  // FIX: On déstructure pour avoir l'objet User, car useAuth() renvoie le contexte complet
  const { user } = useAuth();

  // Filtrage par statut
  const pendingActions = sortedActions.filter((a) => a.status === 'pending');
  const validatedActions = sortedActions.filter(
    (a) => a.status === 'validated',
  );
  const rejectedActions = sortedActions.filter((a) => a.status === 'rejected');

  // Séparation pour la section Modération
  const myPending = pendingActions.filter((a) => {
    const creatorId =
      typeof a.created_by === 'string'
        ? a.created_by.split('/').pop()
        : a.created_by?.id;
    return creatorId === user?.id;
  });

  const othersPending = pendingActions.filter((a) => {
    const creatorId =
      typeof a.created_by === 'string'
        ? a.created_by.split('/').pop()
        : a.created_by?.id;
    return creatorId !== user?.id;
  });

  return (
    <div
      className="space-y-12 animate-fade-in"
      role="table"
      aria-label="Historique des actions"
    >
      {/* --- SECTION 1 : MODÉRATION (Actions en attente) --- */}
      {pendingActions.length > 0 && (
        <section className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Text
                variant="caption"
                className="text-gold uppercase font-bold tracking-widest opacity-80"
              >
                ⚖️ Actions en attente
              </Text>
              <Badge variant="gold" isPulse>
                {pendingActions.length}
              </Badge>
            </div>
            <div className="h-px flex-1 bg-gold/10 ml-4" />
          </div>

          <div className="space-y-8">
            {/* SOUS-SECTION : MES SIGNALEMENTS */}
            {myPending.length > 0 && (
              <div className="space-y-3">
                <Text
                  variant="micro"
                  className="ml-4 opacity-40 uppercase font-black tracking-tighter italic"
                >
                  Mes envois
                </Text>
                <Card
                  variant="dark"
                  className="border-gold/20 shadow-xl shadow-gold/5 overflow-hidden"
                >
                  <div className="divide-y divide-white/5">
                    {myPending.map((action) => (
                      <ActionRow
                        key={action.id}
                        action={action}
                        isAdmin={isAdmin}
                        onUpdate={onUpdate}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* SOUS-SECTION : SIGNALEMENTS COMMUNAUTAIRES */}
            {othersPending.length > 0 && (
              <div className="space-y-3">
                <Text
                  variant="micro"
                  className="ml-4 opacity-40 uppercase font-black tracking-tighter italic"
                >
                  Signalements des autres
                </Text>
                <Card
                  variant="dark"
                  className="border-white/5 overflow-hidden shadow-lg"
                >
                  <div className="divide-y divide-white/5">
                    {othersPending.map((action) => (
                      <ActionRow
                        key={action.id}
                        action={action}
                        isAdmin={isAdmin}
                        onUpdate={onUpdate}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- SECTION 2 : JOURNAL DES MÉFAITS (Uniquement Validés) --- */}
      <section className="space-y-4">
        <DateNavigation
          dates={availableDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-white/5 rounded-t-3xl border-x border-t border-white/10 mb-0">
          <div role="row" className="contents">
            {TABLE_COLUMNS.map((col) => {
              const indicator = getSortIndicator(col.id);
              return (
                <div
                  key={col.id}
                  className={col.colSpan}
                  role="columnheader"
                  aria-sort={col.noSort ? undefined : getAriaSort(col.id)}
                >
                  {!col.noSort ? (
                    <button
                      className={cn(
                        'w-full flex items-center group transition-default hover:text-gold',
                        col.align === 'text-center' && 'justify-center',
                        col.align === 'text-right' && 'justify-end',
                      )}
                      onClick={() => handleSort(col.id)}
                    >
                      <Text
                        variant="micro"
                        className="text-inherit opacity-60 uppercase font-black tracking-widest"
                      >
                        {col.label}
                      </Text>
                      <span className={indicator.className}>
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
          <div className="divide-y divide-white/5">
            {validatedActions.map((action) => (
              <ActionRow
                key={action.id}
                action={action}
                isAdmin={isAdmin}
                hidePoints={hidePoints}
                onUpdate={onUpdate}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
          {validatedActions.length === 0 && (
            <EmptyState
              layout="card"
              icon="🏜️"
              title="Journal vide"
              message="Aucune action confirmée pour le moment."
            />
          )}
        </Card>
      </section>

      {/* --- SECTION 3 : ARCHIVES (Rejetés) --- */}
      {isAdmin && rejectedActions.length > 0 && (
        <section className="opacity-20 grayscale hover:opacity-60 transition-all">
          <Text
            variant="micro"
            className="mb-2 px-2 uppercase tracking-tighter italic"
          >
            🗑️ Actions rejetées (Archive)
          </Text>
          <div className="divide-y divide-white/5 bg-black/20 rounded-xl overflow-hidden border border-white/5">
            {rejectedActions.map((action) => (
              <ActionRow key={action.id} action={action} isAdmin={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
