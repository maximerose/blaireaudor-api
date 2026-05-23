import type { Dispatch, SetStateAction } from 'react';
import type { User } from './user';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  plain_password: string;
  display_name?: string;
  email?: string;
  player_id?: string | null;
  join_code?: string | null;
}

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AuthResponseData {
  token?: string;
  user?: User;
  message?: string;
  violations?: Array<{ propertyPath: string; message: string }>;
}

export interface AuthResult {
  ok: boolean;
  data: AuthResponseData;
}
