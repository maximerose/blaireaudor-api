import { useState, useEffect } from 'react';

export const useCompetitionCountdown = (startDate: string, onStart?: () => void) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
  } | null>(null);

  useEffect(() => {
    const startTimestamp = new Date(startDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = startTimestamp - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true });
        if (onStart) onStart();
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isStarted: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startDate, onStart]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return { timeLeft, formatTime };
};