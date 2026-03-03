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

function App() {
  return (
    <Router>
      <div className="h-full w-full flex items-center justify-center bg-dark">
        <div className="w-full max-w-md p-6">
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginForm />} />
            <Route
              path={ROUTES.HOME}
              element={<Navigate to={ROUTES.LOGIN} replace />}
            />
            <Route path={ROUTES.REGISTER} element={<RegistrationForm />} />
            <Route path={ROUTES.LOGOUT} element={<LogoutHandler />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={<div>Bienvenue sur le Dashboard ! 🏆</div>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
