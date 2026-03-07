import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface Competition {
  name: string;
  join_code: string;
  start_date: string;
  end_date: string;
  fog_of_war: boolean;
}

export interface Participation {
  score: number;
  rank?: number;
  competition: Competition;
}

export interface Player {
  display_name: string;
  username: string;
  participations: Participation[];
}

export interface User {
  username: string;
  roles: string[];
  player?: Player;
}

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  login: (credentials: any) => Promise<{ ok: boolean; data: any }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
