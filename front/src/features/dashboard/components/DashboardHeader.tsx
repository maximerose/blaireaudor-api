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

      <Stack
        gap="xs"
        align="center"
        className="w-full"
        role="list"
        aria-label={DASHBOARD_UI.HEADER.ARIA.SUMMARY}
      >
        <Row wrap gap="md" justify="center" className="w-full">
          {statItems.slice(0, 3).map((s) => (
            <Stack
              key={s.label}
              gap="none"
              align="center"
              role="listitem"
              className="w-auto shrink-0 min-w-20"
            >
              <span
                className={`text-base sm:text-lg font-black leading-none ${s.color}`}
              >
                {s.val}
              </span>
              <Text variant={TEXT_VARIANT.MICRO} className="mt-1">
                {s.label}
              </Text>
            </Stack>
          ))}
        </Row>

        <Row wrap gap="md" justify="center" className="w-full mt-1 sm:mt-0">
          {statItems.slice(3).map((s) => (
            <Stack
              key={s.label}
              gap="none"
              align="center"
              role="listitem"
              className="w-auto shrink-0 min-w-20"
            >
              <span
                className={`text-base sm:text-lg font-black leading-none ${s.color}`}
              >
                {s.val}
              </span>
              <Text variant={TEXT_VARIANT.MICRO} className="mt-1">
                {s.label}
              </Text>
            </Stack>
          ))}
        </Row>
      </Stack>
    </Stack>
  );
};
