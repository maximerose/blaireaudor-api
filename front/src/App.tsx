import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import RegistrationForm from './components/Auth/Registration/RegistrationForm';
import { ROUTES } from './constants/routes';
import LoginForm from './components/Auth/Login/LoginForm';
import LogoutHandler from './components/Auth/Login/LogoutHandler';
import { useAuth } from './hooks/auth/useAuth';
import { LoadingScreen } from './components/UI/LoadingScreen';
import Dashboard from './components/Dashboard/Dashboard';
import { CreateCompetitionPage } from './components/Competition/CreateCompetition/CreateCompetitionPage';
import CompetitionDetailPage from './components/Competition/Detail/CompetitionDetailPage';
import { ScrollToTop } from './components/UI/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="bottom-right" reverseOrder={false} />
        <ScrollToTop />
        <div className="min-h-screen w-full bg-dark">
          <Routes>
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
    </QueryClientProvider>
  );
}

export default App;
