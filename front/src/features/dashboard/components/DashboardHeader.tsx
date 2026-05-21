import {
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Text,
  TEXT_VARIANT,
} from '@/shared';
import { DASHBOARD_UI } from '@/features/dashboard/constants';
import { useDashboardHeader } from '@/features/dashboard/hooks';

export const DashboardHeader = () => {
  const { displayName, totalParticipations, statItems } = useDashboardHeader();
  const greetingTitle = (
    <>
      {DASHBOARD_UI.HEADER.GREETING}
      {displayName && (
        <>
          <span className="text-player-me">{displayName}</span>
        </>
      )}
    </>
  );
  return (
    <section aria-labelledby="dashboard-title">
      <div className="flex flex-col sm:items-center justify-between gap-4 px-1">
        <div>
          <SectionHeader
            id="dashboard-title"
            variant={SECTION_HEADER_VARIANT.TITLE}
            title={DASHBOARD_UI.HEADER.TITLE}
            subtitle={greetingTitle}
            centered
          />
        </div>

        <div className="pt-2 sm:pt-0 border-t border-white/5 sm:border-0 text-center align-middle">
          <Text variant={TEXT_VARIANT.CAPTION} className="text-white/40">
            {DASHBOARD_UI.HEADER.TOTAL_PARTICIPATIONS(totalParticipations)}
          </Text>
        </div>

        <div
          className="flex justify-center flex-wrap gap-3"
          role="list"
          aria-label={DASHBOARD_UI.HEADER.ARIA.SUMMARY}
        >
          {statItems.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center"
              role="listitem"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
