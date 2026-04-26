import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface Competition {
  id: string;
  name: string;
  join_code: string;
  start_date: string;
  end_date: string;
  is_finished: boolean;
  fog_of_war: boolean;
  participants_count: number;
  created_by: User | string;
  referees: (Player | string)[];
}

export interface Participation {
  score: number;
  rank: number;
  competition: Competition;
}

export interface Player {
  id: string;
  display_name: string;
  username: string;
  participations: Participation[];
  refereed_competitions: Competition[];
}

export interface User {
  id: string;
  username: string;
  roles: string[];
  player?: Player;
  created_competitions: Competition[];
}

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (_credentials: any) => Promise<{ ok: boolean; data: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
