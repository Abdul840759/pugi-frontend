import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'tutor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'learner' | 'tutor') => Promise<{ email: string }>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = storage.getAccessToken();
      const refreshToken = storage.getRefreshToken();
      const storedUser = storage.getUser<AuthUser>();

      if (token && storedUser) {
        setUser(storedUser);
      }

      if (!token && refreshToken) {
        try {
          const data = await authService.refreshToken(refreshToken);
          storage.setAccessToken(data.accessToken);
          const me = await authService.me();
          storage.setUser(me);
          setUser(me);
        } catch {
          storage.clearAuth();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    storage.setAccessToken(data.accessToken);
    storage.setRefreshToken(data.refreshToken);
    storage.setUser(data.user);
    setUser(data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'learner' | 'tutor' = 'learner'
  ) => {
    const data = await authService.register({ name, email, password, role });
    return { email: data.email };
  };

  const verifyEmail = async (email: string, otp: string) => {
    const data = await authService.verifyEmail(email, otp);
    storage.setAccessToken(data.accessToken);
    storage.setRefreshToken(data.refreshToken);
    storage.setUser(data.user);
    setUser(data.user);
  };

  const logout = async () => {
    await authService.logout();
    storage.clearAuth();
    setUser(null);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        verifyEmail,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
