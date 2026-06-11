export type UserRole = 'learner' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'learner' | 'tutor';
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  instructorId: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  enrolledCount: number;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  modules: CourseModule[];
  createdAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  passingScore: number;
}

export interface EnrolledCourse extends Course {
  progress: number;
  lastAccessed: string;
  streak: number;
  xp: number;
}

export interface ProgressData {
  weeklyProgress: { day: string; hours: number; xp: number }[];
  skillTree: SkillNode[];
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  completionByCategory: { name: string; value: number }[];
}

export interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  children?: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface TutorAnalytics {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  avgRating: number;
  enrollmentTrend: { month: string; students: number }[];
  coursePerformance: { course: string; completion: number }[];
}

export interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  totalCourses: number;
  pendingApprovals: number;
  monthlyGrowth: { month: string; users: number }[];
  roleDistribution: { name: string; value: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface LiveClass {
  id: string;
  title: string;
  courseName: string;
  date: string;
  time: string;
  duration: string;
  students: number;
  status: 'scheduled' | 'live' | 'completed';
}

export interface StudentPerformance {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  quizScore: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'at-risk';
}
