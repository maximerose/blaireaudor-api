import {
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Text,
  TEXT_VARIANT,
  Stack,
  Row,
} from '@/shared';
import { DASHBOARD_UI } from '@/features/dashboard/constants';
import { useDashboardHeader } from '@/features/dashboard/hooks';

export const DashboardHeader = () => {
  const { displayName, totalParticipations, statItems } = useDashboardHeader();

  const greetingTitle = (
    <>
      {DASHBOARD_UI.HEADER.GREETING}{' '}
      {displayName && <span className="text-player-me">{displayName}</span>}
    </>
  );

  return (
    <Stack
      as="section"
      gap="md"
      align="center"
      aria-labelledby="dashboard-title"
      className="w-full text-center px-1"
    >
      <div className="w-full">
        <SectionHeader
          id="dashboard-title"
          variant={SECTION_HEADER_VARIANT.TITLE}
          title={DASHBOARD_UI.HEADER.TITLE}
          subtitle={greetingTitle}
          centered
        />
      </div>

      <div className="w-full pt-2 sm:pt-0 border-t border-border-subtle sm:border-0 text-center">
        <Text variant={TEXT_VARIANT.CAPTION} className="text-text-muted">
          {DASHBOARD_UI.HEADER.TOTAL_PARTICIPATIONS(totalParticipations)}
        </Text>
      </div>

      <Row
        wrap
        gap="sm"
        justify="center"
        role="list"
        aria-label={DASHBOARD_UI.HEADER.ARIA.SUMMARY}
        className="w-full"
      >
        {statItems.map((s) => (
          <Stack
            key={s.label}
            gap="none"
            align="center"
            role="listitem"
            className="w-auto shrink-0 min-w-20"
          >
            <span
              className={`text-lg sm:text-xl font-black leading-none ${s.color}`}
              aria-hidden="true"
            >
              {s.val}
            </span>

            <Text
              variant={TEXT_VARIANT.MICRO}
              className="mt-0.5"
              aria-hidden="true"
            >
              {s.label}
            </Text>

            <span className="sr-only">
              {DASHBOARD_UI.HEADER.ARIA.STAT_DETAIL(s.val, s.label)}
            </span>
          </Stack>
        ))}
      </Row>
    </Stack>
  );
};
