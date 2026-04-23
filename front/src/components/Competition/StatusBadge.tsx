import { Badge } from '../UI/Badge';
import { CompetitionStatus } from '../../utils/competitionHelper';

type StatusType = (typeof CompetitionStatus)[keyof typeof CompetitionStatus];

export const StatusBadge = ({ status }: { status: StatusType }) => {
  return (
    <span role="status" aria-relevant="all">
      {(() => {
        switch (status) {
          case CompetitionStatus.ACTIVE:
            return (
              <Badge
                variant="success"
                isPulse
                aria-label="Compétition actuellement en cours"
              >
                En cours
              </Badge>
            );
          case CompetitionStatus.UPCOMING:
            return (
              <Badge variant="info" aria-label="Compétition à venir">
                À venir
              </Badge>
            );
          case CompetitionStatus.FINISHED:
            return (
              <Badge variant="danger" aria-label="Compétition terminée">
                Terminé
              </Badge>
            );
          default:
            return null;
        }
      })()}
    </span>
  );
};
