import { JoinCompetitionModal } from '@/components/Competition';
import { Navbar, Button, EmptyState } from '@/components/UI';
import { ROUTES } from '@/constants/routes';
import { useDashboardUI } from '@/hooks';
import { DashboardHeader } from './DashboardHeader';
import { CompetitionListSection } from './CompetitionListSection';

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
          <Button to={ROUTES.NAV_ADMIN_CREATE_COMPETITION} variant="primary">
            + Créer une compétition
          </Button>
          <Button onClick={openJoinModal} variant="secondary">
            Rejoindre une compétition
          </Button>
        </section>

        {/* --- SECTION GESTION (Admin / Arbitre) --- */}
        {managedCompetitions.length > 0 && (
          <CompetitionListSection
            title="🛡️ Gestion des compétitions"
            competitions={managedCompetitions}
            user={user}
            variant="gold"
          />
        )}

        {/* --- SECTION JOUEUR --- */}
        <CompetitionListSection
          title="Tes Participations"
          participations={sortedParticipations}
          user={user}
          emptyState={
            <EmptyState
              layout="dashed"
              icon="🏜️"
              title="Aucune compétition"
              message="Rejoins une arène !"
            />
          }
        />

        {isJoinModalOpen && (
          <JoinCompetitionModal
            onClose={closeJoinModal}
            onJoined={(code) => {
              window.location.href = ROUTES.NAV_COMPETITION_DETAIL(code);
            }}
          />
        )}
      </main>
    </div>
  );
};
export default Dashboard;
