import { api } from './api';

const normalizeCourse = (course: any) => ({ ...course, id: course.id ?? course._id });
const normalizeCourses = (courses: any[]) => courses.map(normalizeCourse);

export const courseService = {
  // All published courses (explore page)
  async getAllCourses(params?: { search?: string; category?: string; level?: string }) {
    const { data } = await api.get('/courses', { params });
    return normalizeCourses(data); // Course[]
  },

  // Courses the logged-in learner is enrolled in
  async getEnrolledCourses() {
    const { data } = await api.get('/courses/enrolled');
    return normalizeCourses(data); // Course[]
  },

  // Courses created by the logged-in tutor
  async getTutorCourses() {
    const { data } = await api.get('/courses/tutor');
    return normalizeCourses(data); // Course[]
  },

  // Pending courses (admin moderation)
  async getPendingCourses() {
    const { data } = await api.get('/courses/pending');
    return normalizeCourses(data); // Course[]
  },

  // Single course by ID
  async getCourseById(id: string) {
    const { data } = await api.get(`/courses/${id}`);
    return normalizeCourse(data); // Course
  },

  // Create a new course (tutor)
  async createCourse(payload: {
    title: string;
    description: string;
    category: string;
    level: string;
    thumbnail?: string;
    instructor?: string;
    instructorId?: string;
    duration?: string;
    modules?: unknown[];
    status?: 'draft' | 'pending';
  }) {
    const { data } = await api.post('/courses', payload);
    return normalizeCourse(data);
  },

  // Update a course (tutor)
  async updateCourse(id: string, payload: Partial<{
    title: string;
    description: string;
    category: string;
    level: string;
    thumbnail: string;
    duration: string;
    modules: unknown[];
  }>) {
    const { data } = await api.patch(`/courses/${id}`, payload);
    return normalizeCourse(data);
  },

  async updateCourseStatus(id: string, status: 'draft' | 'pending') {
    const { data } = await api.patch(`/courses/${id}/status`, { status });
    return normalizeCourse(data);
  },

  // Delete a course (tutor/admin)
  async deleteCourse(id: string) {
    const { data } = await api.delete(`/courses/${id}`);
    return data;
  },

  // Enroll in a course (learner)
  async enrollInCourse(courseId: string) {
    const { data } = await api.post(`/courses/${courseId}/enroll`);
    return data;
  },

  // Approve or reject a course (admin)
  async moderateCourse(id: string, action: 'approve' | 'reject') {
    const { data } = await api.patch(`/courses/${id}/moderate`, { action });
    return data;
  },
};
