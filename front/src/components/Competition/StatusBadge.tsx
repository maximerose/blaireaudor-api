import { Badge } from '../UI/Badge';
import { CompetitionStatus } from '../../utils/competitionHelper';

type StatusType = (typeof CompetitionStatus)[keyof typeof CompetitionStatus];

export const StatusBadge = ({ status }: { status: StatusType }) => {
  switch (status) {
    case CompetitionStatus.ACTIVE:
      return (
        <Badge variant="success" isPulse>
          En cours
        </Badge>
      );
    case CompetitionStatus.UPCOMING:
      return <Badge variant="info">À venir</Badge>;
    case CompetitionStatus.FINISHED:
      return <Badge variant="danger">Terminé</Badge>;
    default:
      return null;
  }
};
