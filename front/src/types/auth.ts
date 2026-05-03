import type { Dispatch, SetStateAction } from 'react';
import type { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (credentials: any) => Promise<{ ok: boolean; data: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
