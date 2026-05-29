import { COMPETITION_UI } from '@/features/competition/constants';
import {
  useActionTableContext,
  useCompetitionContext,
} from '@/features/competition/context';
import type { Action } from '@/features/competition/types';
import {
  Card,
  CARD_VARIANT,
  EmptyState,
  ICONS,
  LoadingScreen,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Text,
  TEXT_VARIANT,
} from '@/shared';
import { ActionRow } from './ActionRow';
import { DateNavigation } from './DateNavigation';
import { PendingSection } from './PendingSection';
import { PlayerFilter } from './PlayerFilter';
import { TableHeader } from './TableHeader';

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
    <Stack as="section" gap="md">
      <PendingSection />

      <SectionHeader
        title={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TITLE}
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        badge={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.NB_ACTIONS(totalActions)}
      />

      <Stack
        gap="xl"
        className="animate-fade-in"
        role="table"
        aria-label={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.ARIA_TABLE}
      >
        <Stack as="section" gap="md">
          <PlayerFilter />
          <DateNavigation />

          <Stack gap="none">
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
                    <ActionRow key={action.id} action={action} />
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
                    className="flex justify-center p-3 border-t border-border-subtle w-full"
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
          </Stack>
        </Stack>

        {/* --- SECTION SECONDAIRE : ACTIONS REFUSÉES --- */}
        {isAdmin && categories.rejected.length > 0 && (
          /* 🟢 Remplacement de duration-700 par ton token de transition superslow */
          <Stack
            as="section"
            gap="xs"
            className="opacity-20 grayscale hover:opacity-60 transition-superslow"
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="px-2 uppercase tracking-tight italic"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.REJECTED}
            </Text>

            <div className="divide-y divide-white/5 bg-black/20 rounded-xl overflow-hidden border border-white/5">
              {categories.rejected.map((action: Action) => (
                <ActionRow key={action.id} action={action} />
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
