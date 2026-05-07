import type { Dispatch, SetStateAction } from 'react';
import type { User } from '@/types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email?: string;
  display_name?: string;
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

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ ok: boolean; data: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
