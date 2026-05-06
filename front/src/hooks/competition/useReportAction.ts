import { useMemo, useRef, useState } from 'react';
import { actionService } from '@/services/api/action';
import { useCompetitionDateLimits } from './useCompetitionDateLimits';
import { toast } from 'react-hot-toast';
import { ActionStatus, type Competition } from '@/types';
import { API } from '@/constants';
import { formatToApiISO } from '@/utils';

export const useReportAction = (
  competition: Competition,
  players: { id: string; display_name: string }[],
  onSuccess: () => void,
  isAdmin: boolean,
) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    targetPlayerId: '',
    description: '',
    points: 10,
    dateAction: new Date().toISOString().split('T')[0],
  });

  const { minDate, maxDate } = useCompetitionDateLimits(competition, true);

  const filteredPlayers = useMemo(
    () =>
      players.filter((p) =>
        p.display_name.toLowerCase().includes(search.toLowerCase()),
      ),
    [players, search],
  );

  const selectPlayer = (id: string, name: string) => {
    setFormData((prev) => ({ ...prev, targetPlayerId: id }));
    setSearch(name);
    setShowDropdown(false);
  };

  const submitReport = async () => {
    if (!formData.targetPlayerId || !formData.description) return;

    setLoading(true);
    const payload = {
      description: formData.description,
      date_action: formatToApiISO(formData.dateAction),
      points: Number(formData.points),
      player: API.IRI.PLAYER(formData.targetPlayerId),
      competition: API.IRI.COMPETITION(competition.id),
      status: isAdmin ? ActionStatus.VALIDATED : ActionStatus.PENDING,
    };

    const { ok } = await actionService.create(competition.id, payload);

    if (ok) {
      toast.success(
        isAdmin ? 'Méfait enregistré !' : "Dénonciation transmise à l'arbitre.",
      );
      onSuccess();
    } else {
      toast.error('Erreur lors du signalement.');
    }
    setLoading(false);
  };

  return {
    formData,
    loading,
    dateLimits: { minDate, maxDate },
    setFormData,
    submitReport,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
  };
};
