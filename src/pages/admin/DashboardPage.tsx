import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { AdminStats } from '@/types';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getAdminStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!stats) return null;

  const growthData = stats.monthlyGrowth.map((d) => ({ name: d.month, value: d.users }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500">Platform overview and key metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30" change="+15% this month" trend="up" />
        <StatCard title="Tutors" value={stats.totalTutors} icon={GraduationCap} iconColor="bg-violet-100 text-violet-600 dark:bg-violet-900/30" />
        <StatCard title="Courses" value={stats.totalCourses.toLocaleString()} icon={BookOpen} iconColor="bg-green-100 text-green-600 dark:bg-green-900/30" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={AlertCircle} iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30" change="Needs attention" trend="neutral" />
      </div>

      <div className="grid gap-3 sm:p-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly User Growth</CardTitle></CardHeader>
          <LineChart data={growthData} color="#ef4444" />
        </Card>
        <Card>
          <CardHeader><CardTitle>User Role Distribution</CardTitle></CardHeader>
          <PieChart data={stats.roleDistribution} />
        </Card>
      </div>
    </div>
  );
}
