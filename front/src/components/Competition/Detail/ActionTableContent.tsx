import {
  Badge,
  BADGE_VARIANT,
  Card,
  CARD_VARIANT,
  EmptyState,
  LoadingScreen,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Text,
  TEXT_VARIANT,
  ICONS,
  UI,
} from '@/shared';
import { COMPETITION_UI } from '@/constants';
import { useActionTableContext, useCompetitionContext } from '@/context';
import {
  ActionRow,
  DateNavigation,
  PendingSection,
  PlayerFilter,
  TableHeader,
} from '@/components/Competition';

export const ActionTableContent = () => {
  const { isAdmin } = useCompetitionContext();
  const {
    categories,
    hasNextPage,
    isFetchingNextPage,
    isLoadingActions,
    loadMoreRef,
    totalActions,
  } = useActionTableContext();

  return (
    <section className="space-y-6">
      <SectionHeader
        title={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TITLE}
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        rightElement={
          <Badge
            variant={BADGE_VARIANT.GHOST}
            className="opacity-60 text-[8px]"
          >
            {UI.ENTRIES(totalActions)}
          </Badge>
        }
      />
      <div
        className="space-y-12 animate-fade-in"
        role="table"
        aria-label="Historique des actions"
      >
        {/* 1. Modération : Pending & Jury */}
        <PendingSection />

        {/* 2. Journal principal : Validated */}
        <section className="space-y-4">
          <PlayerFilter />

          <DateNavigation />

          <TableHeader />

          <Card
            variant={CARD_VARIANT.DARK}
            className="rounded-t-none border-t-0 shadow-2xl overflow-hidden divide-y divide-white/5"
          >
            {isLoadingActions ? (
              <LoadingScreen layout="local" />
            ) : (
              <>
                {categories.validated.map((action) => (
                  <ActionRow action={action} />
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
                    <Text
                      variant={TEXT_VARIANT.MICRO}
                      className="animate-pulse text-gold"
                    >
                      {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.LOADING}
                    </Text>
                  ) : hasNextPage ? (
                    <div className="h-1" />
                  ) : (
                    totalActions > 0 && (
                      <Text
                        variant={TEXT_VARIANT.MICRO}
                        className="opacity-20 italic"
                      >
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
              variant={TEXT_VARIANT.MICRO}
              className="mb-2 px-2 uppercase tracking-tight italic"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.REJECTED}
            </Text>
            <div className="divide-y divide-white/5 bg-black/20 rounded-xl overflow-hidden border border-white/5">
              {categories.rejected.map((action) => (
                <ActionRow action={action} />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
