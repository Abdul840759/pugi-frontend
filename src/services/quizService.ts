import { api } from './api';

export const quizService = {
  async getQuiz(courseId: string, moduleId: string, quizId: string) {
    const { data } = await api.get(`/quizzes/${courseId}/${moduleId}/${quizId}`);
    return data;
  },

  async submitQuiz(courseId: string, moduleId: string, quizId: string, answers: number[]) {
    const { data } = await api.post(`/quizzes/${courseId}/${moduleId}/${quizId}/submit`, { answers });
    return data;
  },

  async getMyQuizHistory() {
    const { data } = await api.get('/quizzes/history/me');
    return data;
  },
};
