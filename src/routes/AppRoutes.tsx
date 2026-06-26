import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicLayout } from '@/layouts/PublicLayout';
import { LearnerLayout } from '@/layouts/LearnerLayout';
import { TutorLayout } from '@/layouts/TutorLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

import { LandingPage } from '@/pages/public/LandingPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { GoogleSuccessPage } from '@/pages/auth/GoogleSuccessPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { LearnerDashboardPage } from '@/pages/learner/DashboardPage';
import { LearnerCoursesPage } from '@/pages/learner/CoursesPage';
import { CourseDetailPage } from '@/pages/learner/CourseDetailPage';
import { LearnerProgressPage } from '@/pages/learner/ProgressPage';
import { LearnerMessagesPage } from '@/pages/learner/MessagesPage';
import { LearnerSettingsPage } from '@/pages/learner/SettingsPage';
import { JotsPage } from '@/pages/learner/JotsPage';
import { CertificatesPage } from '@/pages/learner/CertificatesPage';
import { RoadmapsPage } from '@/pages/learner/RoadmapsPage';
import { RoadmapsPage } from '@/pages/learner/RoadmapsPage';

import { TutorDashboardPage } from '@/pages/tutor/DashboardPage';
import { CreateCoursePage } from '@/pages/tutor/CreateCoursePage';
import { ManageCoursesPage } from '@/pages/tutor/ManageCoursesPage';
import { StudentsPage } from '@/pages/tutor/StudentsPage';
import { SchedulePage } from '@/pages/tutor/SchedulePage';
import { AnalyticsPage } from '@/pages/tutor/AnalyticsPage';
import { TutorSettingsPage } from '@/pages/tutor/SettingsPage';

import { AdminDashboardPage } from '@/pages/admin/DashboardPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { TutorApprovalPage } from '@/pages/admin/TutorApprovalPage';
import { CourseModerationPage } from '@/pages/admin/CourseModerationPage';
import { ReportsPage } from '@/pages/admin/ReportsPage';
import { AdminSettingsPage } from '@/pages/admin/SettingsPage';

import { useAuth } from '@/hooks/useAuth';
import { ROLE_DASHBOARD_PATH } from '@/utils/constants';
import { Loader } from '@/components/ui/Loader';

function RootRedirect() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loader fullScreen />;
  if (isAuthenticated && user) return <Navigate to={ROLE_DASHBOARD_PATH[user.role]} replace />;
  return <LandingPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/google/success" element={<GoogleSuccessPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['learner']} />}>
        <Route element={<LearnerLayout />}>
          <Route path="/learner/dashboard" element={<LearnerDashboardPage />} />
          <Route path="/learner/courses" element={<LearnerCoursesPage />} />
          <Route path="/learner/courses/:id" element={<CourseDetailPage />} />
          <Route path="/learner/progress" element={<LearnerProgressPage />} />
          <Route path="/learner/messages" element={<LearnerMessagesPage />} />
          <Route path="/learner/settings" element={<LearnerSettingsPage />} />
          <Route path="/learner/jots" element={<JotsPage />} />
          <Route path="/learner/certificates" element={<CertificatesPage />} />
          <Route path="/learner/roadmaps" element={<RoadmapsPage />} />
          <Route path="/learner/roadmaps" element={<RoadmapsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
        <Route element={<TutorLayout />}>
          <Route path="/tutor/dashboard" element={<TutorDashboardPage />} />
          <Route path="/tutor/create-course" element={<CreateCoursePage />} />
          <Route path="/tutor/courses" element={<ManageCoursesPage />} />
          <Route path="/tutor/students" element={<StudentsPage />} />
          <Route path="/tutor/analytics" element={<AnalyticsPage />} />
          <Route path="/tutor/schedule" element={<SchedulePage />} />
          <Route path="/tutor/settings" element={<TutorSettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/tutors" element={<TutorApprovalPage />} />
          <Route path="/admin/courses" element={<CourseModerationPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
