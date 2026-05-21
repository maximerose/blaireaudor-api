import { type ReactNode } from 'react';
import { ActionTableContext } from '@/features/competition/context';
import { useActionTable } from '@/features/competition/actions';

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
