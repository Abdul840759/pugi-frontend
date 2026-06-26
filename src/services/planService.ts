import { api } from './api';

export interface PlanInfo {
  plan: 'free' | 'pro';
  planActivatedAt?: string;
  planExpiresAt?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  techLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export const planService = {
  async getMyPlan(): Promise<PlanInfo> {
    const { data } = await api.get('/plans/me');
    return data;
  },
};
