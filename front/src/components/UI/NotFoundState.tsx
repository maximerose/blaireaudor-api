import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '@/components/UI';
import { ICONS, ROUTES } from '@/constants';

interface NotFoundStateProps {
  title?: string;
  message?: string;
  returnPath?: string;
  returnLabel?: string;
}

export const NotFoundState = ({
  title = 'Erreur 404',
  message = "La ressource que tu cherches n'existe pas ou a été supprimée.",
  returnPath,
  returnLabel = 'Retour',
}: NotFoundStateProps) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      navigate(ROUTES.NAV.DASHBOARD);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <EmptyState
        icon={ICONS.EMPTY}
        title={title}
        message={message}
        layout="card"
        action={
          <Button variant="primary" onClick={handleReturn} fullWidth>
            {returnLabel}
          </Button>
        }
      />
    </div>
  );
};
