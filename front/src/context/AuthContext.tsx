import { createContext } from 'react';

export interface User {
  username: string;
  display_name: string;
  roles: string[];
  participations: any[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  login: (credentials: any) => Promise<{ ok: boolean; data: any }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
