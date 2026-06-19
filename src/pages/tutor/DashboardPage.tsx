import { useEffect, useState } from 'react';
import { Users, BookOpen, Star } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { TutorAnalytics } from '@/types';

export function TutorDashboardPage() {
  const [analytics, setAnalytics] = useState<TutorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getTutorAnalytics().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!analytics) return null;

  const chartData = analytics.enrollmentTrend.map((d) => ({ name: d.month, value: d.students }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tutor Dashboard</h1>
        <p className="text-slate-500">Overview of your teaching performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={analytics.totalStudents.toLocaleString()} icon={Users} iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30" change="+12% this month" trend="up" />
        <StatCard title="Active Courses" value={analytics.activeCourses} icon={BookOpen} iconColor="bg-violet-100 text-violet-600 dark:bg-violet-900/30" />
        
        <StatCard title="Avg Rating" value={analytics.avgRating} icon={Star} iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Enrollment Trend</CardTitle></CardHeader>
          <LineChart data={chartData} color="#8b5cf6" />
        </Card>
        <Card>
          <CardHeader><CardTitle>Course Completion Rates</CardTitle></CardHeader>
          <div className="space-y-4">
            {analytics.coursePerformance.map((cp) => (
              <ProgressBar key={cp.course} value={cp.completion} label={cp.course} color="bg-violet-600" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
