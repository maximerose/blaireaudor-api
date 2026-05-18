import { JoinCompetitionModal } from '@/components/Competition';
import {
  Button,
  EmptyState,
  BUTTON_VARIANT,
  BUTTON_SIZE,
} from '@/components/UI';
import { ROUTES } from '@/constants/routes';
import { useDashboardUI } from '@/hooks';
import {
  DashboardHeader,
  CompetitionListSection,
} from '@/components/Dashboard';
import { DASHBOARD_UI, ICONS, NAV } from '@/constants';
import { MainLayout } from '../Layout';

export const Dashboard = () => {
  const {
    ongoing,
    upcoming,
    finished,
    isJoinModalOpen,
    openJoinModal,
    closeJoinModal,
  } = useDashboardUI();

  const isTotallyEmpty =
    ongoing.length === 0 && upcoming.length === 0 && finished.length === 0;

  return (
    <MainLayout
      title={DASHBOARD_UI.HEADER.TITLE}
      subtitle={NAV.SUBTITLE.DASHBOARD}
    >
      <DashboardHeader />
      <section
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4"
        aria-label={DASHBOARD_UI.CARD.ARIA.QUICK_ACTIONS}
      >
        <Button
          to={ROUTES.NAV.ADMIN_CREATE_COMPETITION}
          variant={BUTTON_VARIANT.PRIMARY}
          size={BUTTON_SIZE.MEDIUM}
        >
          {DASHBOARD_UI.BUTTONS.CREATE_COMPETITION}
        </Button>
        <Button
          onClick={openJoinModal}
          variant={BUTTON_VARIANT.SECONDARY}
          size={BUTTON_SIZE.MEDIUM}
        >
          {DASHBOARD_UI.BUTTONS.JOIN_COMPETITION}
        </Button>
      </section>

      {isTotallyEmpty ? (
        <EmptyState
          layout="dashed"
          icon={ICONS.EMPTY}
          title={DASHBOARD_UI.CARD.EMPTY.TITLE}
          message={DASHBOARD_UI.CARD.EMPTY.MESSAGE}
        />
      ) : (
        <div className="space-y-10">
          <CompetitionListSection
            title={DASHBOARD_UI.CARD.SECTIONS.ONGOING}
            items={ongoing}
            variant="gold"
            emptyState={
              <EmptyState
                title={DASHBOARD_UI.NO_COMPETITON_ENTRIES}
              ></EmptyState>
            }
          />

          <CompetitionListSection
            title={DASHBOARD_UI.CARD.SECTIONS.UPCOMING}
            items={upcoming}
          />

          <CompetitionListSection
            title={DASHBOARD_UI.CARD.SECTIONS.FINISHED}
            items={finished}
            variant="dimmed"
          />
        </div>
      )}

      {isJoinModalOpen && (
        <JoinCompetitionModal
          onClose={closeJoinModal}
          onJoined={(code) => {
            window.location.href = ROUTES.NAV.COMPETITION_DETAIL(code);
          }}
        />
      )}
    </MainLayout>
  );
};
export default Dashboard;
