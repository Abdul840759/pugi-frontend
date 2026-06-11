import type { Course } from '@/types';
import { mockCourses, mockEnrolledCourses } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    await delay(500);
    return mockCourses;
  },

  async getEnrolledCourses() {
    await delay(500);
    return mockEnrolledCourses;
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    await delay(400);
    return mockCourses.find((c) => c.id === id);
  },

  async getTutorCourses(tutorId: string): Promise<Course[]> {
    await delay(500);
    return mockCourses.filter((c) => c.instructorId === tutorId);
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    await delay(800);
    const newCourse: Course = {
      id: `c${mockCourses.length + 1}`,
      title: course.title ?? 'Untitled Course',
      description: course.description ?? '',
      thumbnail: course.thumbnail ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      instructor: course.instructor ?? 'Unknown',
      instructorId: course.instructorId ?? '2',
      category: course.category ?? 'General',
      level: course.level ?? 'beginner',
      duration: course.duration ?? '0h',
      rating: 0,
      enrolledCount: 0,
      status: 'draft',
      modules: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockCourses.push(newCourse);
    return newCourse;
  },

  async updateCourseStatus(id: string, status: Course['status']): Promise<Course> {
    await delay(500);
    const course = mockCourses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    course.status = status;
    return course;
  },

  async getPendingCourses(): Promise<Course[]> {
    await delay(500);
    return mockCourses.filter((c) => c.status === 'pending');
  },
};
