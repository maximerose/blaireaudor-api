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

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen w-full bg-dark">
        <Routes>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              user ? <Dashboard /> : <Navigate to={ROUTES.LOGIN} replace />
            }
          />
          <Route
            path={ROUTES.LOGIN}
            element={
              user ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginForm />
            }
          />
          <Route
            path={ROUTES.HOME}
            element={
              <Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              user ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <RegistrationForm />
              )
            }
          />
          <Route
            path={ROUTES.CREATE_COMPETITION}
            element={
              user ? <CreateCompetitionPage /> : <Navigate to={ROUTES.LOGIN} />
            }
          />
          <Route
            path={ROUTES.COMPETITION_VIEW}
            element={
              user ? (
                <CompetitionDetailPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
          <Route path={ROUTES.LOGOUT} element={<LogoutHandler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
