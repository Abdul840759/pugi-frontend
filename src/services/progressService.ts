import {
  mockLiveClasses,
  mockProgress,
  mockStudentPerformance,
  mockTutorAnalytics,
  mockAdminStats,
  mockConversations,
} from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const progressService = {
  async getLearnerProgress() {
    await delay(500);
    return mockProgress;
  },

  async getTutorAnalytics() {
    await delay(500);
    return mockTutorAnalytics;
  },

  async getAdminStats() {
    await delay(500);
    return mockAdminStats;
  },

  async getConversations() {
    await delay(400);
    return mockConversations;
  },

  async getStudentPerformance() {
    await delay(500);
    return mockStudentPerformance;
  },

  async getLiveClasses() {
    await delay(400);
    return mockLiveClasses;
  },
};
