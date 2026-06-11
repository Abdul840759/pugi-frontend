import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { AdminStats } from '@/types';

export function ReportsPage() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-500">Platform analytics and exportable reports</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Users', value: stats.totalUsers.toLocaleString() },
          { label: 'Active Courses', value: stats.totalCourses.toLocaleString() },
          { label: 'Pending Items', value: stats.pendingApprovals },
        ].map((item) => (
          <Card key={item.label} className="text-center">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>User Growth Report</CardTitle></CardHeader>
          <LineChart data={growthData} color="#ef4444" />
        </Card>
        <Card>
          <CardHeader><CardTitle>Platform Distribution</CardTitle></CardHeader>
          <PieChart data={stats.roleDistribution} />
        </Card>
      </div>
    </div>
  );
}
