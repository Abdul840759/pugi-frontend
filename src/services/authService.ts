import { api } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'learner' | 'tutor';
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // fail silently
    }
  },

  async refreshToken(refreshToken: string) {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },

  async verifyEmail(email: string, otp: string) {
    const { data } = await api.post('/auth/verify-email', { email, otp });
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const { data } = await api.post('/auth/reset-password', payload);
    return data;
  },
};
