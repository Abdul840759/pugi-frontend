import type { UserRole } from '@/types';

export const APP_NAME = 'PUGI';

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  learner: '/learner/dashboard',
  tutor: '/tutor/dashboard',
  admin: '/admin/dashboard',
};

export const DEMO_USERS = [
  { email: 'learner@pugi.com', password: 'password123', role: 'learner' as const },
  { email: 'tutor@pugi.com', password: 'password123', role: 'tutor' as const },
  { email: 'admin@pugi.com', password: 'password123', role: 'admin' as const },
];
