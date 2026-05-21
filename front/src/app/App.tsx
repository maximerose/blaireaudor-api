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
import { Dashboard } from '@/components/Dashboard';
import {
  useAuthContext,
  ForgotPasswordForm,
  LoginForm,
  LogoutHandler,
  ProfilePage,
  RegistrationForm,
  ResetPasswordForm,
} from '@/features/account';
import {
  CompetitionDetailPage,
  CreateCompetitionPage,
} from '@/components/Competition';

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
        <Router>
          <Toaster position="bottom-right" reverseOrder={false} />
          <ScrollToTop />
          <div className="min-h-screen w-full bg-dark">
            <Routes>
              <Route
                path={ROUTES.NAV.FORGOT_PASSWORD}
                element={
                  user ? (
                    <Navigate to={ROUTES.NAV.DASHBOARD} replace />
                  ) : (
                    <ForgotPasswordForm />
                  )
                }
              />

              <Route
                path={ROUTES.NAV.RESET_PASSWORD_PATH}
                element={
                  user ? (
                    <Navigate to={ROUTES.NAV.DASHBOARD} replace />
                  ) : (
                    <ResetPasswordForm />
                  )
                }
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
                path={ROUTES.NAV.LOGIN}
                element={
                  user ? (
                    <Navigate to={ROUTES.NAV.DASHBOARD} replace />
                  ) : (
                    <LoginForm />
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
                path={ROUTES.NAV.REGISTER}
                element={
                  user ? (
                    <Navigate to={ROUTES.NAV.DASHBOARD} replace />
                  ) : (
                    <RegistrationForm />
                  )
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
          </div>
        </Router>
      </ConfirmModalProvider>
    </QueryClientProvider>
  );
}

export default App;
