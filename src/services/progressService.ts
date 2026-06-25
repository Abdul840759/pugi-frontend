import { api } from './api';

export const progressService = {
  // Get learner's full progress (XP, streak, badges, enrollments)
  async getLearnerProgress() {
    const { data } = await api.get('/progress/learner');
    return data;
  },

  // Mark a lesson as complete
  async completeLesson(courseId: string, lessonId: string) {
    const { data } = await api.post('/progress/complete-lesson', { courseId, lessonId });
    return data; // { xp, streak, progress, badges }
  },

  // Revert a lesson back to incomplete (used when a retake quiz is failed)
  async uncompleteLesson(courseId: string, lessonId: string) {
    const { data } = await api.post('/progress/uncomplete-lesson', { courseId, lessonId });
    return data; // { progress, completedLessons[] }
  },

  // Get progress for a specific course
  async getCourseProgress(courseId: string) {
    const { data } = await api.get(`/progress/course/${courseId}`);
    return data; // { completedLessons[], progress%, xp }
  },

  // Tutor analytics (student performance across their courses)
  async getTutorAnalytics() {
    const { data } = await api.get('/progress/tutor/analytics');
    return data;
  },

  // Admin platform-wide stats
  async getAdminStats() {
    const { data } = await api.get('/progress/admin/stats');
    return data;
  },

  // Submit a quiz result
  async submitQuiz(courseId: string, lessonId: string, score: number) {
    const { data } = await api.post('/progress/quiz', { courseId, lessonId, score });
    return data; // { passed, badge? }
  },

  async getConversations() {
    const { data } = await api.get('/messages');
    return data.map((conversation: any) => {
      const messages = conversation.messages ?? [];
      const last = messages[messages.length - 1];
      return {
        id: conversation._id,
        participantName: conversation.participantName ?? 'Conversation',
        participantAvatar: conversation.participantAvatar,
        lastMessage: last?.content ?? 'No messages yet',
        lastMessageTime: last?.timestamp ?? conversation.updatedAt,
        unreadCount: messages.filter((message: any) => !message.read).length,
        messages: messages.map((message: any) => ({
          id: message._id,
          senderId: message.senderId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          content: message.content,
          timestamp: message.timestamp ?? message.createdAt,
          read: message.read,
        })),
      };
    });
  },

  async getLiveClasses() {
    const { data } = await api.get('/progress/tutor/live-classes');
    return data;
  },

  async getStudentPerformance() {
    const { data } = await api.get('/progress/tutor/students');
    return data;
  },
};
