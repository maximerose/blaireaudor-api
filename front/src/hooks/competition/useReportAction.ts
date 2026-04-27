import { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '@/api/config';
import { ROUTES } from '@/constants/routes';
import type { Competition } from '@/context/AuthContext';

interface ReportData {
  targetPlayerId: string;
  description: string;
  points: number;
  dateAction: string;
}

export const useReportAction = (
  competition: Competition,
  players: { id: string; display_name: string }[],
  onSuccess: () => void,
  isAdmin: boolean,
) => {
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ReportData>({
    targetPlayerId: '',
    description: '',
    points: 10,
    dateAction: new Date().toISOString().split('T')[0],
  });

  const dateLimits = useMemo(() => {
    if (!competition) return { minDate: '', maxDate: '' };

    const today = new Date().toISOString().split('T')[0];
    const start = competition.start_date.split('T')[0];
    const end = competition.end_date
      ? competition.end_date.split('T')[0]
      : null;

    if (start > today) return { minDate: start, maxDate: start };

    return {
      minDate: start,
      maxDate: end && end < today ? end : today,
    };
  }, [competition]);

  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) =>
      p.display_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [players, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field: keyof ReportData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectPlayer = (id: string, name: string) => {
    handleChange('targetPlayerId', id);
    setSearch(name);
    setShowDropdown(false);
  };

  const submitReport = async () => {
    if (!formData.targetPlayerId || !formData.description || !formData.points)
      return;

    setLoading(true);
    try {
      const response = await apiFetch(ROUTES.API_ACTIONS, {
        method: 'POST',
        body: JSON.stringify({
          description: formData.description,
          dateAction: formData.dateAction,
          points: Number(formData.points),
          player: ROUTES.IRI_PLAYER(formData.targetPlayerId),
          competition: ROUTES.IRI_COMPETITION(competition.id),
          status: isAdmin ? 'validated' : 'pending',
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData((prev) => ({
          ...prev,
          targetPlayerId: '',
          description: '',
          points: 0,
        }));
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onSuccess();
            setIsSuccess(false);
            setIsExiting(false);
          }, 500);
        }, 2500);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une action", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    dateLimits,
    handleChange,
    submitReport,
    isSuccess,
    isExiting,
    search,
    setSearch,
    showDropdown,
    setShowDropdown,
    searchContainerRef,
    filteredPlayers,
    selectPlayer,
  };
};
