import type { UserRole } from '@/types';

export const APP_NAME = 'PUGI';

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  learner: '/learner/dashboard',
  tutor: '/tutor/dashboard',
  admin: '/admin/dashboard',
};
