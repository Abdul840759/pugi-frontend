import type {
  AdminStats,
  Conversation,
  Course,
  EnrolledCourse,
  LiveClass,
  Notification,
  ProgressData,
  StudentPerformance,
  TutorAnalytics,
  User,
} from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'learner@pugi.com',
    name: 'Alex Johnson',
    role: 'learner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    email: 'tutor@pugi.com',
    name: 'Dr. Sarah Chen',
    role: 'tutor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2024-11-20',
  },
  {
    id: '3',
    email: 'admin@pugi.com',
    name: 'Michael Admin',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    createdAt: '2024-06-01',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'React.js Masterclass',
    description: 'Master modern React with hooks, context, and advanced patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    instructor: 'Dr. Sarah Chen',
    instructorId: '2',
    category: 'Frontend',
    level: 'intermediate',
    duration: '24h',
    rating: 4.8,
    enrolledCount: 1240,
    status: 'published',
    createdAt: '2025-02-01',
    modules: [
      {
        id: 'm1',
        title: 'Getting Started',
        lessons: [
          { id: 'l1', title: 'Introduction to React', duration: '12:30', videoUrl: '#', completed: true },
          { id: 'l2', title: 'JSX & Components', duration: '18:45', videoUrl: '#', completed: true },
          { id: 'l3', title: 'Props & State', duration: '22:10', videoUrl: '#', completed: false },
        ],
        quiz: { id: 'q1', title: 'Module 1 Quiz', questions: 10, passingScore: 70 },
      },
      {
        id: 'm2',
        title: 'Advanced Hooks',
        lessons: [
          { id: 'l4', title: 'useEffect Deep Dive', duration: '25:00', videoUrl: '#', completed: false },
          { id: 'l5', title: 'Custom Hooks', duration: '20:15', videoUrl: '#', completed: false },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'TypeScript Fundamentals',
    description: 'Learn TypeScript from scratch and build type-safe applications.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
    instructor: 'Dr. Sarah Chen',
    instructorId: '2',
    category: 'Programming',
    level: 'beginner',
    duration: '18h',
    rating: 4.9,
    enrolledCount: 2100,
    status: 'published',
    createdAt: '2025-01-20',
    modules: [
      {
        id: 'm3',
        title: 'TypeScript Basics',
        lessons: [
          { id: 'l6', title: 'Types & Interfaces', duration: '15:00', videoUrl: '#', completed: true },
          { id: 'l7', title: 'Generics', duration: '20:00', videoUrl: '#', completed: false },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Node.js Backend Development',
    description: 'Build scalable REST APIs with Node.js and Express.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    instructor: 'Dr. Sarah Chen',
    instructorId: '2',
    category: 'Backend',
    level: 'advanced',
    duration: '30h',
    rating: 4.7,
    enrolledCount: 890,
    status: 'published',
    createdAt: '2025-03-01',
    modules: [],
  },
  {
    id: 'c4',
    title: 'UI/UX Design Principles',
    description: 'Create beautiful, user-centered digital experiences.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    instructor: 'James Wilson',
    instructorId: '4',
    category: 'Design',
    level: 'beginner',
    duration: '15h',
    rating: 4.6,
    enrolledCount: 650,
    status: 'pending',
    createdAt: '2025-04-01',
    modules: [],
  },
];

export const mockEnrolledCourses: EnrolledCourse[] = mockCourses.slice(0, 3).map((course, i) => ({
  ...course,
  progress: [72, 45, 15][i] ?? 0,
  lastAccessed: ['2025-06-10', '2025-06-08', '2025-06-01'][i] ?? '2025-06-01',
  streak: [12, 7, 3][i] ?? 0,
  xp: [2450, 1200, 350][i] ?? 0,
}));

export const mockProgress: ProgressData = {
  weeklyProgress: [
    { day: 'Mon', hours: 2.5, xp: 150 },
    { day: 'Tue', hours: 1.8, xp: 120 },
    { day: 'Wed', hours: 3.2, xp: 200 },
    { day: 'Thu', hours: 0.5, xp: 30 },
    { day: 'Fri', hours: 2.0, xp: 140 },
    { day: 'Sat', hours: 4.0, xp: 280 },
    { day: 'Sun', hours: 1.5, xp: 100 },
  ],
  skillTree: [
    { id: 's1', name: 'HTML/CSS', level: 5, maxLevel: 5, unlocked: true, children: ['s2', 's3'] },
    { id: 's2', name: 'JavaScript', level: 4, maxLevel: 5, unlocked: true, children: ['s4', 's5'] },
    { id: 's3', name: 'Design', level: 2, maxLevel: 5, unlocked: true },
    { id: 's4', name: 'React', level: 3, maxLevel: 5, unlocked: true, children: ['s6'] },
    { id: 's5', name: 'Node.js', level: 1, maxLevel: 5, unlocked: true },
    { id: 's6', name: 'TypeScript', level: 2, maxLevel: 5, unlocked: true },
    { id: 's7', name: 'GraphQL', level: 0, maxLevel: 5, unlocked: false },
    { id: 's8', name: 'DevOps', level: 0, maxLevel: 5, unlocked: false },
  ],
  totalXp: 4850,
  currentStreak: 12,
  longestStreak: 21,
  badges: [
    { id: 'b1', name: 'First Steps', icon: '🎯', earnedAt: '2025-01-20' },
    { id: 'b2', name: 'Week Warrior', icon: '🔥', earnedAt: '2025-02-15' },
    { id: 'b3', name: 'Quiz Master', icon: '🏆', earnedAt: '2025-03-10' },
    { id: 'b4', name: 'Code Ninja', icon: '⚡' },
    { id: 'b5', name: 'Team Player', icon: '🤝' },
  ],
  completionByCategory: [
    { name: 'Frontend', value: 65 },
    { name: 'Backend', value: 25 },
    { name: 'Design', value: 10 },
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantName: 'Dr. Sarah Chen',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: 'Great progress on the React module!',
    lastMessageTime: '2025-06-10T14:30:00',
    unreadCount: 2,
    messages: [
      { id: 'msg1', senderId: '2', senderName: 'Dr. Sarah Chen', content: 'Hi Alex! How is the React course going?', timestamp: '2025-06-09T10:00:00', read: true },
      { id: 'msg2', senderId: '1', senderName: 'Alex Johnson', content: 'Going well! Just finished the hooks section.', timestamp: '2025-06-09T10:15:00', read: true },
      { id: 'msg3', senderId: '2', senderName: 'Dr. Sarah Chen', content: 'Great progress on the React module!', timestamp: '2025-06-10T14:30:00', read: false },
    ],
  },
  {
    id: 'conv2',
    participantName: 'Study Group',
    lastMessage: 'Anyone want to pair program tonight?',
    lastMessageTime: '2025-06-09T18:00:00',
    unreadCount: 0,
    messages: [
      { id: 'msg4', senderId: '5', senderName: 'Jamie', content: 'Anyone want to pair program tonight?', timestamp: '2025-06-09T18:00:00', read: true },
    ],
  },
];

export const mockTutorAnalytics: TutorAnalytics = {
  totalStudents: 3420,
  activeCourses: 5,
  totalRevenue: 48500,
  avgRating: 4.8,
  enrollmentTrend: [
    { month: 'Jan', students: 120 },
    { month: 'Feb', students: 180 },
    { month: 'Mar', students: 250 },
    { month: 'Apr', students: 310 },
    { month: 'May', students: 420 },
    { month: 'Jun', students: 380 },
  ],
  coursePerformance: [
    { course: 'React.js Masterclass', completion: 78 },
    { course: 'TypeScript Fundamentals', completion: 65 },
    { course: 'Node.js Backend', completion: 52 },
  ],
};

export const mockAdminStats: AdminStats = {
  totalUsers: 15420,
  totalTutors: 342,
  totalCourses: 1280,
  pendingApprovals: 12,
  monthlyGrowth: [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1450 },
    { month: 'Mar', users: 1680 },
    { month: 'Apr', users: 1920 },
    { month: 'May', users: 2100 },
    { month: 'Jun', users: 2350 },
  ],
  roleDistribution: [
    { name: 'Learners', value: 14200 },
    { name: 'Tutors', value: 342 },
    { name: 'Admins', value: 15 },
  ],
};

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'New Course Available', message: 'Advanced GraphQL course is now live!', type: 'info', read: false, createdAt: '2025-06-10T09:00:00' },
  { id: 'n2', title: 'Quiz Reminder', message: 'Complete Module 1 Quiz by Friday', type: 'warning', read: false, createdAt: '2025-06-09T15:00:00' },
  { id: 'n3', title: 'Streak Milestone!', message: 'You reached a 12-day learning streak!', type: 'success', read: true, createdAt: '2025-06-08T08:00:00' },
];

export const mockLiveClasses: LiveClass[] = [
  { id: 'lc1', title: 'React Hooks Workshop', courseName: 'React.js Masterclass', date: '2025-06-12', time: '14:00', duration: '90 min', students: 45, status: 'scheduled' },
  { id: 'lc2', title: 'TypeScript Q&A', courseName: 'TypeScript Fundamentals', date: '2025-06-13', time: '10:00', duration: '60 min', students: 32, status: 'scheduled' },
  { id: 'lc3', title: 'API Design Patterns', courseName: 'Node.js Backend', date: '2025-06-10', time: '16:00', duration: '120 min', students: 28, status: 'completed' },
];

export const mockStudentPerformance: StudentPerformance[] = [
  { id: 'sp1', name: 'Alex Johnson', email: 'alex@email.com', course: 'React.js Masterclass', progress: 72, quizScore: 85, lastActive: '2025-06-10', status: 'active' },
  { id: 'sp2', name: 'Maria Garcia', email: 'maria@email.com', course: 'TypeScript Fundamentals', progress: 45, quizScore: 92, lastActive: '2025-06-09', status: 'active' },
  { id: 'sp3', name: 'John Smith', email: 'john@email.com', course: 'React.js Masterclass', progress: 20, quizScore: 55, lastActive: '2025-05-28', status: 'at-risk' },
  { id: 'sp4', name: 'Emma Wilson', email: 'emma@email.com', course: 'Node.js Backend', progress: 60, quizScore: 78, lastActive: '2025-06-08', status: 'active' },
];
