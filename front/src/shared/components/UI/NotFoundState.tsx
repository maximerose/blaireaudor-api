import { useNavigate } from 'react-router-dom';
import { Button, BUTTON_VARIANT } from './Button';
import { BUTTONS, ICONS, ROUTES, UI } from '@/shared/constants';
import { useDocumentTitle } from '@/shared/hooks';
import { EmptyState } from './EmptyState';

interface NotFoundStateProps {
  title?: string;
  message?: string;
  returnPath?: string;
  returnLabel?: string;
}

export const NotFoundState = ({
  title = UI.NOT_FOUND_TITLE,
  message = UI.NOT_FOUND_SUBTITLE,
  returnPath,
  returnLabel = BUTTONS.BACK,
}: NotFoundStateProps) => {
  useDocumentTitle(title);
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
          <Button
            variant={BUTTON_VARIANT.PRIMARY}
            onClick={handleReturn}
            fullWidth
          >
            {returnLabel}
          </Button>
        }
      />
    </div>
  );
};
