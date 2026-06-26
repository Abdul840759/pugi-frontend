import { api } from './api';

export const liveClassService = {
  async getAll() {
    const { data } = await api.get('/live-classes');
    return data;
  },
  async create(payload: any) {
    const { data } = await api.post('/live-classes', payload);
    return data;
  },
};
