import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboardSort } from '../hooks/useDashboardSort';
import { CompetitionCard } from '../components/Dashboard/CompetitionCard';
import { Navbar } from '../components/UI/Navbar';
import { ROUTES } from '../constants/routes';
import {
  CompetitionStatus,
  getCompetitionStatus,
} from '../utils/competitionHelper';
import { Button } from '../components/UI/Button';
import { JoinCompetitionModal } from '../components/Dashboard/JoinCompetitionModal';
import { Text } from '../components/UI/Typography';
import { EmptyState } from './UI/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const participations = user?.player?.participations || [];
  const sortedParticipations = useDashboardSort(participations);

  const stats = useMemo(() => {
    return participations.reduce(
      (acc, p) => {
        const status = getCompetitionStatus(
          p.competition.start_date,
          p.competition.end_date,
        );
        if (status === CompetitionStatus.ACTIVE) acc.active++;
        if (status === CompetitionStatus.FINISHED) acc.finished++;
        if (status === CompetitionStatus.UPCOMING) acc.upcoming++;
        return acc;
      },
      { active: 0, finished: 0, upcoming: 0 },
    );
  }, [participations]);

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen flex flex-col p-4 sm:p-6">
      <Navbar />

      <main className="flex-1 space-y-6 sm:space-y-10 animate-fade-in mt-4">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <div className="space-y-4">
              <Text variant="caption" className="text-gold">
                Tableau de bord
              </Text>

              <Text variant="h1" className="text-white normal-case">
                Salut,{' '}
                <span className="text-gold">{user?.player?.display_name}</span>
              </Text>
            </div>

            <div className="pt-4 sm:pt-0 border-t border-white/5 sm:border-0 text-center align-middle">
              <Text variant="caption" className="text-white/20">
                {participations.length > 0
                  ? `${participations.length} participation${participations.length > 1 ? 's' : ''} au total`
                  : 'Aucune compétition active'}
              </Text>
            </div>

            <div className="flex justify-center gap-3">
              {[
                {
                  label: 'En cours',
                  val: stats.active,
                  color: 'text-success-bright',
                },
                {
                  label: 'À venir',
                  val: stats.upcoming,
                  color: 'text-info-bright',
                },
                {
                  label: 'Terminées',
                  val: stats.finished,
                  color: 'text-white/20',
                },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span
                    className={`text-lg sm:text-xl font-black leading-none ${s.color}`}
                  >
                    {s.val}
                  </span>
                  <Text variant="micro" className="mt-0.5">
                    {s.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          >
            Rejoindre une compétition
          </Button>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <Text variant="caption" className="opacity-20">
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
                />
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
