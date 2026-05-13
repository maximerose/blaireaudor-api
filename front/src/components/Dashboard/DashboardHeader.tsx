import { Text } from '@/components/UI';
import { DASHBOARD_UI } from '@/constants';
import { useDashboardHeader } from '@/hooks';

export const DashboardHeader = () => {
  const { displayName, totalParticipations, statItems } = useDashboardHeader();

  return (
    <section className="space-y-4" aria-labelledby="dashboard-title">
      <div className="flex flex-col md:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="space-y-4">
          <Text
            id="dashboard-title"
            variant="h1"
            className="text-white normal-case"
          >
            {DASHBOARD_UI.HEADER.GREETING}
            {displayName && (
              <>
                , <span className="text-gold">{displayName}</span>
              </>
            )}
          </Text>
        </div>

        <div className="pt-4 sm:pt-0 border-t border-white/5 sm:border-0 text-center align-middle">
          <Text variant="caption" className="text-white/40">
            {DASHBOARD_UI.HEADER.TOTAL_PARTICIPATIONS(totalParticipations)}
          </Text>
        </div>

        <div
          className="flex justify-center gap-3"
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
              <Text variant="micro" className="mt-0.5" aria-hidden="true">
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
