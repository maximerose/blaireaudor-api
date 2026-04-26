import { JoinCompetitionModal } from '@/components/Competition';
import { Navbar, Button, Text, EmptyState } from '@/components/UI';
import { ROUTES } from '@/constants/routes';
import { useDashboardUI } from '@/hooks';
import { DashboardHeader } from './DashboardHeader';
import { CompetitionCard } from './CompetitionCard';

const Dashboard = () => {
  const {
    user,
    participations,
    sortedParticipations,
    managedCompetitions,
    stats,
    isJoinModalOpen,
    setIsJoinModalOpen,
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
          <Button onClick={() => setIsJoinModalOpen(true)} variant="secondary">
            Rejoindre une compétition
          </Button>
        </section>

        {/* --- SECTION GESTION (Admin / Arbitre) --- */}
        {managedCompetitions.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <Text
                variant="caption"
                className="text-gold uppercase font-bold tracking-widest opacity-60"
              >
                🛡️ Gestion des compétitions
              </Text>
              <div className="h-px flex-1 bg-gold/10 ml-4" />
            </div>
            <div className="grid gap-3">
              {managedCompetitions.map((comp) => (
                <CompetitionCard
                  key={comp.join_code}
                  competition={comp}
                  user={user}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- SECTION JOUEUR --- */}
        <section className="space-y-4" aria-labelledby="participations-title">
          <div className="flex items-center justify-between px-1">
            <Text
              variant="caption"
              className="opacity-40 uppercase font-bold tracking-widest"
            >
              Tes Participations
            </Text>
            <div className="h-px flex-1 bg-white/5 ml-4" />
          </div>

          <div className="grid gap-3">
            {participations.length > 0 ? (
              sortedParticipations.map((p) => (
                <CompetitionCard
                  key={p.competition.join_code}
                  participation={p}
                  competition={p.competition}
                  user={user}
                />
              ))
            ) : (
              <EmptyState
                layout="dashed"
                icon="🏜️"
                title="Aucune compétition en vue"
                message="Crée ou rejoins une compétition pour commencer."
              />
            )}
          </div>
        </section>

        {isJoinModalOpen && (
          <JoinCompetitionModal
            onClose={() => setIsJoinModalOpen(false)}
            onJoined={(code) => {
              setIsJoinModalOpen(false);
              window.location.href = ROUTES.NAV_COMPETITION_DETAIL(code);
            }}
          />
        )}
      </main>
    </div>
  );
};
export default Dashboard;
