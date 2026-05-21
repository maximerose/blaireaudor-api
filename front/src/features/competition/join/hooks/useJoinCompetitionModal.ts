import React, { useState } from 'react';
import { useJoinByCode } from '@/features/competition';
import { formatJoinCode } from '@/shared';

export const useJoinCompetitionModal = (onJoined: (code: string) => void) => {
  const [code, setCode] = useState('');
  const { joinByCode, loading, error } = useJoinByCode(onJoined);

  const handleSubmit = () => {
    joinByCode(code.trim());
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatJoinCode(e.target.value);
    setCode(formatted);
  };

  return {
    code,
    loading,
    error,
    handleSubmit,
    handleCodeChange,
  };
};
