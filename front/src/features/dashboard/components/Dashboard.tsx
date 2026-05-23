import { JoinCompetitionModal } from '@/features/competition';
import {
  Button,
  EmptyState,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  ROUTES,
  ICONS,
  NAV,
  MainLayout,
  Grid,
  Stack,
} from '@/shared';
import { DASHBOARD_UI } from '@/features/dashboard/constants';
import { useDashboardUI } from '@/features/dashboard/hooks';
import { DashboardHeader } from './DashboardHeader';
import { CompetitionListSection } from './CompetitionListSection';
import { DashboardStats } from './DashboardStats';
import { DashboardPalmares } from './DashboardPalmares';

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
      <Stack gap="xl" className="w-full">
        <DashboardHeader />

        <Grid
          as="section"
          cols={1}
          sm={2}
          gap="sm"
          aria-label={DASHBOARD_UI.CARD.ARIA.QUICK_ACTIONS}
          className="w-full"
        >
          <Button
            to={ROUTES.NAV.ADMIN_CREATE_COMPETITION}
            variant={BUTTON_VARIANT.PRIMARY}
            size={BUTTON_SIZE.MEDIUM}
            className="w-full cursor-pointer"
          >
            {DASHBOARD_UI.BUTTONS.CREATE_COMPETITION}
          </Button>
          <Button
            onClick={openJoinModal}
            variant={BUTTON_VARIANT.SECONDARY}
            size={BUTTON_SIZE.MEDIUM}
            className="w-full cursor-pointer"
          >
            {DASHBOARD_UI.BUTTONS.JOIN_COMPETITION}
          </Button>
        </Grid>

        {isTotallyEmpty ? (
          <EmptyState
            layout="dashed"
            icon={ICONS.EMPTY}
            title={DASHBOARD_UI.CARD.EMPTY.TITLE}
            message={DASHBOARD_UI.CARD.EMPTY.MESSAGE}
          />
        ) : (
          <Stack gap="xl" className="w-full">
            <CompetitionListSection
              title={DASHBOARD_UI.CARD.SECTIONS.ONGOING}
              icon={ICONS.ONGOING}
              items={ongoing}
              variant="gold"
              emptyState={
                <EmptyState title={DASHBOARD_UI.NO_COMPETITON_ENTRIES} />
              }
            />

            <CompetitionListSection
              title={DASHBOARD_UI.CARD.SECTIONS.UPCOMING}
              icon={ICONS.UPCOMING}
              items={upcoming}
            />

            <CompetitionListSection
              title={DASHBOARD_UI.CARD.SECTIONS.FINISHED(finished.length)}
              items={finished}
              icon={ICONS.FINISHED}
              variant="dimmed"
            />

            <DashboardStats />

            <DashboardPalmares />
          </Stack>
        )}
      </Stack>

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
