import {
  Badge,
  BADGE_VARIANT,
  Card,
  EmptyState,
  LoadingScreen,
  Text,
  TEXT_VARIANT,
} from '@/components/UI';
import { COMPETITION_UI, ICONS } from '@/constants';
import { useActionTableContext } from '@/context/ActionTableContext';
import { useCompetition } from '@/hooks';
import { PendingSection } from './Sections/PendingSection';
import { PlayerFilter } from './PlayerFilter';
import { DateNavigation } from './DateNavigation';
import { TableHeader } from './Sections/TableHeader';
import { ActionRow } from './ActionRow';

export const ActionTableContent = () => {
  const { isAdmin } = useCompetition();
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
      <header className="flex items-center px-1 animate-fade-in">
        <Text
          variant={TEXT_VARIANT.CAPTION}
          className="whitespace-nowrap font-bold"
        >
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TITLE}
        </Text>
        <div className="h-px w-full bg-white/5" />
        <Badge variant={BADGE_VARIANT.GHOST} className="opacity-60 text-[8px]">
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.ENTRIES(totalActions)}
        </Badge>
      </header>
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
            variant="dark"
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
