import { JoinCompetitionModal } from '@/components/Competition';
import {
  Navbar,
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
import { DASHBOARD_UI, ICONS } from '@/constants';

export const Dashboard = () => {
  const {
    ongoing,
    upcoming,
    finished,
    hasAdminAccess,
    isJoinModalOpen,
    openJoinModal,
    closeJoinModal,
  } = useDashboardUI();

  const isTotallyEmpty =
    ongoing.length === 0 && upcoming.length === 0 && finished.length === 0;

  return (
    <div className="w-full mx-auto min-h-screen flex flex-col p-4 sm:p-6">
      <Navbar />

      <main className="flex-1 space-y-6 sm:space-y-10 animate-fade-in mt-4">
        <DashboardHeader />
        {hasAdminAccess && (
          <Button
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
            className="opacity-40 hover:opacity-100"
          >
            {DASHBOARD_UI.HEADER.ADMIN_ACCESS}
          </Button>
        )}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          aria-label={DASHBOARD_UI.CARD.ARIA.QUICK_ACTIONS}
        >
          <Button
            to={ROUTES.NAV.ADMIN_CREATE_COMPETITION}
            variant={BUTTON_VARIANT.PRIMARY}
          >
            {DASHBOARD_UI.BUTTONS.CREATE_COMPETITION}
          </Button>
          <Button onClick={openJoinModal} variant={BUTTON_VARIANT.SECONDARY}>
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
              title="🟢 En cours"
              items={ongoing}
              variant="gold"
              emptyState={
                <div className="col-span-full opacity-40 text-sm italic text-center py-6 border border-dashed border-white/10 rounded-xl">
                  Aucune compétition actuellement en cours.
                </div>
              }
            />

            {/* À VENIR (Masqué si vide) */}
            <CompetitionListSection
              title="⏳ À venir" // À mettre dans tes constantes !
              items={upcoming}
            />

            {/* TERMINÉES (Masqué si vide) */}
            <CompetitionListSection
              title="🏁 Terminées" // À mettre dans tes constantes !
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
      </main>
    </div>
  );
};
export default Dashboard;
