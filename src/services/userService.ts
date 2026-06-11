import type { User } from '@/types';
import { mockNotifications, mockUsers } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  async getAllUsers(): Promise<User[]> {
    await delay(500);
    return mockUsers;
  },

  async getPendingTutors(): Promise<User[]> {
    await delay(500);
    return [
      {
        id: 't1',
        email: 'newtutor@email.com',
        name: 'Lisa Park',
        role: 'tutor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        createdAt: '2025-06-01',
      },
      {
        id: 't2',
        email: 'dev@email.com',
        name: 'Tom Baker',
        role: 'tutor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        createdAt: '2025-06-05',
      },
    ];
  },

  async approveTutor(id: string): Promise<void> {
    await delay(500);
    console.log(`Tutor ${id} approved`);
  },

  async rejectTutor(id: string): Promise<void> {
    await delay(500);
    console.log(`Tutor ${id} rejected`);
  },

  async getNotifications() {
    await delay(300);
    return mockNotifications;
  },

  async markNotificationRead(id: string): Promise<void> {
    await delay(200);
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) notification.read = true;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(600);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, data);
    return user;
  },
};
