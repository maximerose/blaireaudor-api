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

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <ScrollToTop />
      <div className="min-h-screen w-full bg-dark">
        <Routes>
          <Route
            path={ROUTES.NAV_DASHBOARD}
            element={
              user ? <Dashboard /> : <Navigate to={ROUTES.NAV_LOGIN} replace />
            }
          />
          <Route
            path={ROUTES.NAV_LOGIN}
            element={
              user ? (
                <Navigate to={ROUTES.NAV_DASHBOARD} replace />
              ) : (
                <LoginForm />
              )
            }
          />
          <Route
            path={ROUTES.NAV_HOME}
            element={
              <Navigate
                to={user ? ROUTES.NAV_DASHBOARD : ROUTES.NAV_LOGIN}
                replace
              />
            }
          />
          <Route
            path={ROUTES.NAV_REGISTER}
            element={
              user ? (
                <Navigate to={ROUTES.NAV_DASHBOARD} replace />
              ) : (
                <RegistrationForm />
              )
            }
          />
          <Route
            path={ROUTES.NAV_ADMIN_CREATE_COMPETITION}
            element={
              user ? (
                <CreateCompetitionPage />
              ) : (
                <Navigate to={ROUTES.NAV_LOGIN} />
              )
            }
          />
          <Route
            path={ROUTES.NAV_COMPETITION_DETAIL_ROUTE}
            element={
              user ? (
                <CompetitionDetailPage />
              ) : (
                <Navigate to={ROUTES.NAV_LOGIN} replace />
              )
            }
          />
          <Route path={ROUTES.NAV_LOGOUT} element={<LogoutHandler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
