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
    stats,
    isJoinModalOpen,
    setIsJoinModalOpen,
  } = useDashboardUI();

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
          <Button
            to={ROUTES.NAV_ADMIN_CREATE_COMPETITION}
            variant="primary"
            size="md"
            className="shadow-gold/10"
          >
            + Créer une compétition
          </Button>
          <Button
            onClick={() => setIsJoinModalOpen(true)}
            variant="secondary"
            size="md"
            aria-haspopup="dialog"
          >
            Rejoindre une compétition
          </Button>
        </section>

        <section className="space-y-4" aria-labelledby="participations-title">
          <div className="flex items-center justify-between px-1">
            <Text
              as="h2"
              id="participations-title"
              variant="caption"
              className="opacity-40 uppercase font-bold tracking-widest"
            >
              Tes Participations
            </Text>
            <div className="h-px flex-1 bg-white/5 ml-4" aria-hidden="true" />
          </div>

          <div
            className="grid gap-3"
            role={participations.length > 0 ? 'list' : undefined}
          >
            {participations.length > 0 ? (
              sortedParticipations.map((p) => (
                <div key={p.competition.join_code} role="listitem">
                  <CompetitionCard participation={p} />
                </div>
              ))
            ) : (
              <EmptyState
                layout="dashed"
                icon="🏜️"
                title="Aucune arène en vue"
                message="C'est bien calme ici... trop calme. Crée ou rejoins une compétition pour commencer."
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
