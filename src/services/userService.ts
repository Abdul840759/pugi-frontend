import { api } from './api';

const normalizeUser = (user: any) => ({ ...user, id: user.id ?? user._id });
const normalizeUsers = (users: any[]) => users.map(normalizeUser);

export const userService = {
  // Get all users (admin)
  async getAllUsers() {
    const { data } = await api.get('/users');
    return normalizeUsers(data); // User[]
  },

  // Get pending tutor approvals (admin)
  async getPendingTutors() {
    const { data } = await api.get('/users/pending-tutors');
    return normalizeUsers(data); // User[]
  },

  // Approve or reject a tutor (admin)
  async moderateTutor(id: string, action: 'approve' | 'reject') {
    const { data } = await api.patch(`/users/${id}/moderate`, { action });
    return data;
  },

  // Get logged-in user's profile
  async getProfile() {
    const { data } = await api.get('/users/profile');
    return normalizeUser(data); // User
  },

  // Update logged-in user's profile (name, email)
  async updateProfile(payload: { name?: string; email?: string }) {
    const { data } = await api.patch('/users/profile', payload);
    return normalizeUser(data);
  },

  // Upload avatar as base64
  async uploadAvatar(base64: string) {
    const { data } = await api.patch('/users/profile/avatar', { avatar: base64 });
    return data; // { avatar: string }
  },

  // Change password
  async changePassword(payload: { oldPassword: string; newPassword: string }) {
    const { data } = await api.patch('/users/profile/password', payload);
    return data;
  },

  // Get notifications for logged-in user
  async getNotifications() {
    const { data } = await api.get('/users/notifications');
    return data; // Notification[]
  },

  // Mark a notification as read
  async markNotificationRead(id: string) {
    const { data } = await api.patch(`/users/notifications/${id}/read`);
    return data;
  },

  // Mark all notifications as read
  async markAllNotificationsRead() {
    const { data } = await api.patch('/users/notifications/read-all');
    return data;
  },

  // Search tutors by name (for messaging)
  async searchTutors(query: string) {
    const { data } = await api.get('/users/tutors/search', { params: { q: query } });
    return normalizeUsers(data); // User[]
  },
};
