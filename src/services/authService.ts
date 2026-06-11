import type { AuthResponse, LoginCredentials, RegisterData } from '@/types';
import { mockUsers } from './mockData';
import { storage } from '@/utils/storage';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function generateToken(userId: string): string {
  return `mock_jwt_${userId}_${Date.now()}`;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);

    const user = mockUsers.find(
      (u) => u.email === credentials.email,
    );

    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    const tokens = {
      accessToken: generateToken(user.id),
      refreshToken: generateToken(`${user.id}_refresh`),
    };

    storage.setAccessToken(tokens.accessToken);
    storage.setRefreshToken(tokens.refreshToken);
    storage.setUser(user);

    return { user, tokens };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000);

    const existing = mockUsers.find((u) => u.email === data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const user = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockUsers.push(user);

    const tokens = {
      accessToken: generateToken(user.id),
      refreshToken: generateToken(`${user.id}_refresh`),
    };

    storage.setAccessToken(tokens.accessToken);
    storage.setRefreshToken(tokens.refreshToken);
    storage.setUser(user);

    return { user, tokens };
  },

  async logout(): Promise<void> {
    await delay(300);
    storage.clearAuth();
  },

  getCurrentUser() {
    return storage.getUser<AuthResponse['user']>();
  },

  isAuthenticated(): boolean {
    return !!storage.getAccessToken() && !!storage.getUser();
  },
};
