import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, BookOpen, FileText, Settings } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Tutor Approval', path: '/admin/tutors', icon: UserCheck },
  { label: 'Courses', path: '/admin/courses', icon: BookOpen },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-stretch bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <Sidebar items={navItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} accentColor="bg-red-600" />
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
