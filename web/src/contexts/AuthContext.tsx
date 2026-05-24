import { createContext, useState, useCallback, type ReactNode } from 'react';
import { getUserName } from '../config/users';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  login: (userId: string, apiKey: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(
    () => !!localStorage.getItem('api_key'),
  );
  const [userId, setUserId] = useState<string | null>(
    () => localStorage.getItem('user_id'),
  );

  const login = useCallback(async (uid: string, apiKey: string): Promise<boolean> => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/v1/auth/verify`, {
        headers: { 'x-api-key': apiKey },
      });
      if (!res.ok) return false;

      const { token } = await res.json();
      localStorage.setItem('api_key', token);
      localStorage.setItem('user_id', uid);
      setAuthenticated(true);
      setUserId(uid);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('api_key');
    localStorage.removeItem('user_id');
    setAuthenticated(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        userName: userId ? getUserName(userId) : null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
