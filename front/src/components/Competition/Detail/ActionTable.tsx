import { useActionTable, useAuth, useCompetition } from '@/hooks';
import { Badge, Card, EmptyState, LoadingScreen, Text } from '@/components/UI';
import {
  DateNavigation,
  ActionRow,
  PendingSection,
  TableHeader,
  PlayerFilter,
} from '@/components/Competition';
import { COMPETITION_UI, ICONS } from '@/constants';
import type { ActionTableProps } from '@/types';

export const ActionTable = ({ onUpdate, onStatusChange }: ActionTableProps) => {
  const { user } = useAuth();
  const { competition, isAdmin } = useCompetition();

  const {
    categories,
    availableDates,
    selectedDate,
    setSelectedDate,
    selectedPlayerId,
    setSelectedPlayerId,
    totalActions,
    isLoadingActions,
    loadMoreRef,
    isFetchingNextPage,
    hasNextPage,
    handleSort,
    getAriaSort,
    getSortIndicator,
  } = useActionTable(competition?.id);

  return (
    <section className="space-y-6">
      <header className="flex items-center px-1 animate-fade-in">
        <Text variant="caption" className="whitespace-nowrap font-bold">
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TITLE}
        </Text>
        <div className="h-px w-full bg-white/5" />
        <Badge variant="ghost" className="opacity-60 text-[8px]">
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.ENTRIES(totalActions)}
        </Badge>
      </header>
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
          <PlayerFilter
            // On récupère la liste des joueurs depuis la compétition (leaderboard)
            players={
              competition?.participations?.map((p) => ({
                id: p.player?.id,
                display_name: p.player?.display_name,
              })) || []
            }
            selectedId={selectedPlayerId}
            onSelect={setSelectedPlayerId}
            currentUserId={user?.player?.id}
          />

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
            {isLoadingActions ? (
              <LoadingScreen layout="local" />
            ) : (
              <>
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
                      COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE
                        .EMPTY_ACTIONS_TITLE
                    }
                    message={
                      COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE
                        .EMPTY_ACTIONS_SUBTITILE
                    }
                  />
                )}
                <div
                  ref={loadMoreRef}
                  className="p-8 flex justify-center border-t border-white/5"
                >
                  {isFetchingNextPage ? (
                    <Text variant="micro" className="animate-pulse text-gold">
                      {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.LOADING}
                    </Text>
                  ) : hasNextPage ? (
                    <div className="h-1" />
                  ) : (
                    totalActions > 0 && (
                      <Text variant="micro" className="opacity-20 italic">
                        {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.END}
                      </Text>
                    )
                  )}
                </div>
              </>
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
                <ActionRow
                  key={action.id}
                  action={action}
                  onUpdate={onUpdate}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
