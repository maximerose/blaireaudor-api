import { useActionTable, useCompetition } from '@/hooks';
import { Card, EmptyState, Text } from '@/components/UI';
import {
  DateNavigation,
  ActionRow,
  PendingSection,
  TableHeader,
} from '@/components/Competition';
import { COMPETITION_UI, ICONS } from '@/constants';

export const ActionTable = ({ actions, onUpdate, onStatusChange }: any) => {
  const {
    categories,
    selectedDate,
    setSelectedDate,
    availableDates,
    handleSort,
    getAriaSort,
    getSortIndicator,
  } = useActionTable(actions);
  const { isAdmin } = useCompetition();

  return (
    <div
      className="space-y-12 animate-fade-in"
      role="table"
      aria-label="Historique des actions"
    >
      {/* 1. Modération : Pending & Jury */}
      <PendingSection
        myPending={categories.myPending}
        othersPending={categories.othersPending}
        onUpdate={onUpdate}
        onStatusChange={onStatusChange}
      />

      {/* 2. Journal principal : Validated */}
      <section className="space-y-4">
        <DateNavigation
          dates={availableDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        <TableHeader
          onSort={handleSort}
          getAriaSort={getAriaSort}
          getSortIndicator={getSortIndicator}
        />

        <Card
          variant="dark"
          className="rounded-t-none border-t-0 shadow-2xl overflow-hidden divide-y divide-white/5"
        >
          {categories.validated.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              onUpdate={onUpdate}
              onStatusChange={onStatusChange}
            />
          ))}

          {categories.validated.length === 0 && (
            <EmptyState
              layout="card"
              icon={ICONS.EMPTY}
              title={
                COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.EMPTY_ACTIONS_TITLE
              }
              message={
                COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE
                  .EMPTY_ACTIONS_SUBTITILE
              }
            />
          )}
        </Card>
      </section>

      {/* 3. Archives : Rejected */}
      {isAdmin && categories.rejected.length > 0 && (
        <section className="opacity-20 grayscale hover:opacity-60 transition-all duration-700">
          <Text
            variant="micro"
            className="mb-2 px-2 uppercase tracking-tighter italic"
          >
            {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.REJECTED}
          </Text>
          <div className="divide-y divide-white/5 bg-black/20 rounded-xl overflow-hidden border border-white/5">
            {categories.rejected.map((action) => (
              <ActionRow key={action.id} action={action} isAdmin={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
