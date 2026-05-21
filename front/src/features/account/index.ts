// 1. Pages et formulaires d'authentification requis par le Routeur (App.tsx)
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { LoginForm } from './components/LoginForm';
export { LogoutHandler } from './components/LogoutHandler';
export { ProfilePage } from './components/ProfilePage';
export { RegistrationForm } from './components/RegistrationForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';

// 2. Gestion de session et Contexte global d'authentification
export { AuthProvider } from './context/AuthProvider';
export { useAuthContext } from './context/AuthContext';

// 3. Contrat de type de l'utilisateur connecté requis par les autres features
export type { User } from './types/user';
