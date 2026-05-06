import { createContext } from 'react';
import type { AdminContextType } from './types';

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined,
);
