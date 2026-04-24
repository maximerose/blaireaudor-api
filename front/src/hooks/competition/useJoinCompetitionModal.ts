import React, { useState } from 'react';
import { useJoinByCode } from '@/hooks';
import { formatJoinCode } from '@/utils';

export const useJoinCompetitionModal = (onJoined: (code: string) => void) => {
  const [code, setCode] = useState('');
  const { joinByCode, loading, error } = useJoinByCode(onJoined);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
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
