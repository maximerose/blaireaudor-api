import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between py-4 mb-8 border-b border-gold/10">
      <div className="flex flex-col">
        <span className="text-gold font-black italic tracking-tighter text-xl leading-none">
          BLAIREAU D'OR
        </span>
        <span className="text-[8px] text-gold/50 uppercase tracking-[0.3em]">
          Espace joueur
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-gold/40 uppercase font-bold">
            Connecté en tant que
          </p>
          <p className="text-xs text-gold font-medium">
            {user?.player?.display_name || user?.username}
          </p>
        </div>
        <Link
          to={ROUTES.LOGOUT}
          className="text-[10px] bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all uppercase font-bold"
        >
          Quitter
        </Link>
      </div>
    </nav>
  );
};
