import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import {
  ROUTES,
  ConfirmModalProvider,
  LoadingScreen,
  ScrollToTop,
} from '@/shared';
import {
  ForgotPasswordForm,
  LoginForm,
  LogoutHandler,
  RegistrationForm,
  ResetPasswordForm,
} from '@/features/account';
import { QRJoinPage } from '@/features/competition';
import { SplashScreen } from '@/shared/components/UI/SplashScreen';
import { useAuthContext } from '@/features/account/context/AuthContext';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(
  () => import('@/features/dashboard/components/Dashboard'),
);
const PlayerStatsPage = lazy(
  () => import('@/features/stats/components/PlayerStatsPage'),
);
const ProfilePage = lazy(
  () => import('@/features/account/components/ProfilePage'),
);
const CompetitionDetailPage = lazy(
  () => import('@/features/competition/view/components/CompetitionDetailPage'),
);
const CreateCompetitionPage = lazy(
  () =>
    import('@/features/competition/create/components/CreateCompetitionPage'),
);

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmModalProvider>
        <SplashScreen />
        <Router>
          <Toaster position="bottom-center" reverseOrder={false} />
          <ScrollToTop />
          <div className="min-h-screen w-full bg-dark">
            <Suspense fallback={<LoadingScreen layout="fullscreen" />}>
              <Routes>
                <Route
                  path={ROUTES.NAV.QR_JOIN_PATH}
                  element={<QRJoinPage />}
                />
                <Route
                  path={ROUTES.NAV.FORGOT_PASSWORD}
                  element={<ForgotPasswordForm />}
                />
                <Route
                  path={ROUTES.NAV.RESET_PASSWORD_PATH}
                  element={<ResetPasswordForm />}
                />
                <Route path={ROUTES.NAV.LOGIN} element={<LoginForm />} />
                <Route
                  path={ROUTES.NAV.REGISTER}
                  element={<RegistrationForm />}
                />

                <Route
                  path={ROUTES.NAV.DASHBOARD}
                  element={
                    user ? (
                      <Dashboard />
                    ) : (
                      <Navigate to={ROUTES.NAV.LOGIN} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.NAV.STATS}
                  element={
                    user ? (
                      <PlayerStatsPage />
                    ) : (
                      <Navigate to={ROUTES.NAV.LOGIN} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.NAV.PROFILE}
                  element={
                    user ? (
                      <ProfilePage />
                    ) : (
                      <Navigate to={ROUTES.NAV.LOGIN} replace />
                    )
                  }
                />

                <Route
                  path={ROUTES.NAV.HOME}
                  element={
                    <Navigate
                      to={user ? ROUTES.NAV.DASHBOARD : ROUTES.NAV.LOGIN}
                      replace
                    />
                  }
                />

                <Route
                  path={ROUTES.NAV.ADMIN_CREATE_COMPETITION}
                  element={
                    user ? (
                      <CreateCompetitionPage />
                    ) : (
                      <Navigate to={ROUTES.NAV.LOGIN} />
                    )
                  }
                />
                <Route
                  path={ROUTES.NAV.COMPETITION_DETAIL_PATH}
                  element={
                    user ? (
                      <CompetitionDetailPage />
                    ) : (
                      <Navigate to={ROUTES.NAV.LOGIN} replace />
                    )
                  }
                />
                <Route path={ROUTES.NAV.LOGOUT} element={<LogoutHandler />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ConfirmModalProvider>
    </QueryClientProvider>
  );
}

export default App;
