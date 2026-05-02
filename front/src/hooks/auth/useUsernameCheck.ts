import { useState, useEffect } from 'react';
import { authService } from '@/services/api/auth';

export const useUsernameCheck = (username: string, playerId: string | null) => {
  const [status, setStatus] = useState<
    'available' | 'taken' | 'guest_exists' | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foundGuest, setFoundGuest] = useState<{
    id: string;
    name: string;
    last_competition_name: string;
  } | null>(null);

  useEffect(() => {
    if (!username || username.length < 3) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await authService.checkUsername(username);
        if (!data.available) {
          setStatus('taken');
        } else if (data.is_guest_profile) {
          if (playerId === data.guest_id) {
            setStatus('available');
          } else {
            setStatus('guest_exists');
            setFoundGuest({
              id: data.guest_id,
              name: data.guest_name,
              last_competition_name: data.player.last_competition_name,
            });
          }
        } else {
          setStatus('available');
        }
      } catch (e) {
        console.error('Erreur check username', e);
        setStatus('taken');
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, playerId]);

  return { status, setStatus, isLoading, foundGuest, setFoundGuest };
};
