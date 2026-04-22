import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import RegistrationForm from './components/RegistrationForm';
import { ROUTES } from './constants/routes';
import LoginForm from './components/LoginForm';
import LogoutHandler from './components/LogoutHandler';
import { useAuth } from './hooks/useAuth';
import { LoadingScreen } from './components/UI/LoadingScreen';
import Dashboard from './components/Dashboard';
import { CreateCompetitionPage } from './pages/CreateCompetitionPage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';
import { ScrollToTop } from './components/UI/ScrollToTop';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
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
