import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BookOpen, Users, BarChart3, Calendar, Settings } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

const navItems = [
  { label: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
  { label: 'Create Course', path: '/tutor/create-course', icon: PlusCircle },
  { label: 'My Courses', path: '/tutor/courses', icon: BookOpen },
  { label: 'Students', path: '/tutor/students', icon: Users },
  { label: 'Analytics', path: '/tutor/analytics', icon: BarChart3 },
  { label: 'Live Classes', path: '/tutor/schedule', icon: Calendar },
  { label: 'Settings', path: '/tutor/settings', icon: Settings },
];

export function TutorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar items={navItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} accentColor="bg-violet-600" />
      <div className="flex flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
