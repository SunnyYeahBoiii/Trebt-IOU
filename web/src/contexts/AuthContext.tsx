import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  login: (userId: string, apiKey: string) => Promise<boolean>;
  logout: () => void;
}

const USER_NAMES: Record<string, string> = {
  '1': 'Phương',
  '2': 'Pha',
  '3': 'Thịnh',
  '4': 'Tuấn',
};

const AuthContext = createContext<AuthState | null>(null);

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

      localStorage.setItem('api_key', apiKey);
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
        userName: userId ? USER_NAMES[userId] ?? null : null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
