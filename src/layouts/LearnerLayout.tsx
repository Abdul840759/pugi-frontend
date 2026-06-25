import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, TrendingUp, Settings, StickyNote, Award } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

const navItems = [
  { label: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
  { label: 'Courses', path: '/learner/courses', icon: BookOpen },
  { label: 'Progress', path: '/learner/progress', icon: TrendingUp },
  { label: 'My Jots', path: '/learner/jots', icon: StickyNote },
  { label: 'Certificates', path: '/learner/certificates', icon: Award },
  { label: 'Settings', path: '/learner/settings', icon: Settings },
];

export function LearnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar items={navItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
