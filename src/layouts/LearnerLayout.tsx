import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, TrendingUp, Settings, StickyNote, Award,
  Map, Sparkles, ArrowUpCircle,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuthContext } from '@/context/AuthContext';
import { UpgradeLimitModal } from '@/components/courses/UpgradeLimitModal';

export function LearnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const { user, refreshPlan } = useAuthContext();
  const isPro = user?.plan === 'pro';

  const navItems = [
    { label: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/learner/courses', icon: BookOpen },
    { label: 'Progress', path: '/learner/progress', icon: TrendingUp },
    ...(isPro ? [{ label: 'Roadmaps', path: '/learner/roadmaps', icon: Map }] : []),
    { label: 'My Jots', path: '/learner/jots', icon: StickyNote },
    { label: 'Certificates', path: '/learner/certificates', icon: Award },
    { label: 'Settings', path: '/learner/settings', icon: Settings },
  ];

  const upgradeBanner = !isPro ? (
    <button
      onClick={() => setUpgradeModalOpen(true)}
      className="flex w-full flex-col gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-left text-white transition-transform hover:scale-[1.02]"
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles size={15} />
        Upgrade to Pro
      </span>
      <span className="text-xs text-blue-50">
        Unlimited courses, certificates &amp; roadmaps
      </span>
      <span className="flex items-center gap-1 text-xs font-medium">
        <ArrowUpCircle size={13} />
        Upgrade now
      </span>
    </button>
  ) : null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        items={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        footer={upgradeBanner}
      />
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <UpgradeLimitModal
        isOpen={upgradeModalOpen}
        reason={upgradeModalOpen ? 'UPGRADE_PROMPT' : null}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgraded={refreshPlan}
      />
    </div>
  );
}
