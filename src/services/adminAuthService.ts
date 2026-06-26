import { api } from './api';

export const adminAuthService = {
  async checkEligibility(): Promise<{ eligible: boolean }> {
    const { data } = await api.get('/admin/check');
    return data;
  },
  async verifyPin(pin: string): Promise<{ adminToken: string }> {
    const { data } = await api.post('/admin/verify-pin', { pin });
    return data;
  },
};
