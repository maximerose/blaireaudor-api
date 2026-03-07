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

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Initialisation de l'espace joueur..." />;
  }

  return (
    <Router>
      <div className="h-full w-full flex items-center justify-center bg-dark">
        <div className="w-full max-w-md p-6">
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
                user ? (
                  <Navigate to={ROUTES.DASHBOARD} replace />
                ) : (
                  <LoginForm />
                )
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
            <Route path={ROUTES.LOGOUT} element={<LogoutHandler />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
