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

function App() {
  const { user, loading } = useAuth();
  const isLogoutRoute = window.location.pathname === ROUTES.LOGOUT;

  if (loading && !isLogoutRoute) {
    return <LoadingScreen message="Initialisation de l'arène" />;
  }

  return (
    <Router>
      <div className="h-full w-full flex items-center justify-center bg-dark">
        <div className="w-full max-w-md p-6">
          <Routes>
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
            <Route
              path={ROUTES.DASHBOARD}
              element={
                user ? (
                  <div className="w-full space-y-6">
                    <div className="text-center">
                      <h1 className="text-2xl text-gold font-bold uppercase tracking-tighter">
                        Espace Athlète
                      </h1>
                      <p className="text-gold/50 text-xs italic">
                        Affichage des métadonnées de session
                      </p>
                    </div>

                    {/* LE DUMP VISUEL */}
                    <div className="text-left bg-black/40 border border-gold/20 rounded-xl p-4 overflow-auto max-h-96 shadow-inner">
                      <pre className="text-[10px] text-gold/80 font-mono leading-tight">
                        {JSON.stringify(user, null, 2)}
                      </pre>
                    </div>

                    <p className="text-center text-gold font-medium">
                      Salut{' '}
                      <span className="underline decoration-gold/30">
                        {user.player?.display_name || user.username}
                      </span>{' '}
                      !
                    </p>
                  </div>
                ) : (
                  <Navigate to={ROUTES.LOGIN} replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
