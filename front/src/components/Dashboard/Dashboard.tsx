import { JoinCompetitionModal } from '@/components/Competition';
import { Navbar, Button, EmptyState } from '@/components/UI';
import { ROUTES } from '@/constants/routes';
import { useDashboardUI } from '@/hooks';
import {
  DashboardHeader,
  CompetitionListSection,
} from '@/components/Dashboard';
import { DASHBOARD_UI, ICONS } from '@/constants';

const Dashboard = () => {
  const {
    user,
    participations,
    sortedParticipations,
    managedCompetitions,
    stats,
    isJoinModalOpen,
    openJoinModal,
    closeJoinModal,
  } = useDashboardUI();

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen flex flex-col p-4 sm:p-6">
      <Navbar />

      <main className="flex-1 space-y-6 sm:space-y-10 animate-fade-in mt-4">
        <DashboardHeader
          displayName={user?.player?.display_name}
          totalParticipations={participations.length}
          stats={stats}
        />

        <section
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          aria-label="Actions rapides"
        >
          <Button to={ROUTES.NAV.ADMIN_CREATE_COMPETITION} variant="primary">
            {DASHBOARD_UI.BUTTONS.CREATE_COMPETITION}
          </Button>
          <Button onClick={openJoinModal} variant="secondary">
            {DASHBOARD_UI.BUTTONS.JOIN_COMPETITION}
          </Button>
        </section>

        {/* --- SECTION GESTION (Admin / Arbitre) --- */}
        {managedCompetitions.length > 0 && (
          <CompetitionListSection
            title={DASHBOARD_UI.CARD.SECTIONS.MANAGEMENT}
            competitions={managedCompetitions}
            user={user}
            variant="gold"
          />
        )}

        {/* --- SECTION JOUEUR --- */}
        <CompetitionListSection
          title={DASHBOARD_UI.CARD.SECTIONS.PARTICIPATIONS}
          participations={sortedParticipations}
          user={user}
          emptyState={
            <EmptyState
              layout="dashed"
              icon={ICONS.EMPTY}
              title={DASHBOARD_UI.CARD.EMPTY.TITLE}
              message={DASHBOARD_UI.CARD.EMPTY.MESSAGE}
            />
          }
        />

        {isJoinModalOpen && (
          <JoinCompetitionModal
            onClose={closeJoinModal}
            onJoined={(code) => {
              window.location.href = ROUTES.NAV.COMPETITION_DETAIL(code);
            }}
          />
        )}
      </main>
    </div>
  );
};
export default Dashboard;
