import { type ReactNode } from 'react';
import { ActionTableContext } from '@/context';
import { useActionTable } from '@/hooks';

interface ActionTableProviderProps {
  children: ReactNode;
  competitionId: string;
}

export const ActionTableProvider = ({
  children,
  competitionId,
}: ActionTableProviderProps) => {
  const value = useActionTable(competitionId);

  return (
    <ActionTableContext.Provider value={value}>
      {children}
    </ActionTableContext.Provider>
  );
};
