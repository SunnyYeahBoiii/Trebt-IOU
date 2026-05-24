import { createContext } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  login: (userId: string, apiKey: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);
