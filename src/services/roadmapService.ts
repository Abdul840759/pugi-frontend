import { api } from './api';

export const roadmapService = {
  async getAllRoadmaps() {
    const { data } = await api.get('/roadmaps');
    return data;
  },
  async getRoadmapById(id: string) {
    const { data } = await api.get(`/roadmaps/${id}`);
    return data;
  },
};
