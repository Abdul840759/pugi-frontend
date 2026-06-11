import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { TutorAnalytics } from '@/types';

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TutorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getTutorAnalytics().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!analytics) return null;

  const enrollmentData = analytics.enrollmentTrend.map((d) => ({ name: d.month, value: d.students }));
  const completionData = analytics.coursePerformance.map((d) => ({ name: d.course.split(' ')[0], value: d.completion }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500">Detailed insights into your teaching performance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Student Enrollment</CardTitle></CardHeader>
          <LineChart data={enrollmentData} color="#8b5cf6" />
        </Card>
        <Card>
          <CardHeader><CardTitle>Completion Distribution</CardTitle></CardHeader>
          <PieChart data={completionData} />
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Course Performance Breakdown</CardTitle></CardHeader>
        <div className="space-y-4">
          {analytics.coursePerformance.map((cp) => (
            <ProgressBar key={cp.course} value={cp.completion} label={cp.course} color="bg-violet-600" />
          ))}
        </div>
      </Card>
    </div>
  );
}
