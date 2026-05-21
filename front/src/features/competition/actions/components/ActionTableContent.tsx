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

import { ActionRow } from './ActionRow';
import { DateNavigation } from './DateNavigation';
import { PendingSection } from './PendingSection';
import { PlayerFilter } from './PlayerFilter';
import { TableHeader } from './TableHeader';
import { COMPETITION_UI } from '@/features/competition/constants';
import {
  useActionTableContext,
  useCompetitionContext,
} from '@/features/competition/context';
import type { Action } from '@/features/competition/types';

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
        aria-label={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.ARIA_TABLE}
      >
        <PendingSection />

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
                {categories.validated.map((action: Action) => (
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

        {isAdmin && categories.rejected.length > 0 && (
          <section className="opacity-20 grayscale hover:opacity-60 transition-all duration-700">
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="mb-2 px-2 uppercase tracking-tight italic"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.REJECTED}
            </Text>
            <div className="divide-y divide-white/5 bg-black/20 rounded-xl overflow-hidden border border-white/5">
              {categories.rejected.map((action: Action) => (
                <ActionRow action={action} />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
