import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Trophy, Clock, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LineChart } from '@/components/charts/LineChart';
import { Loader } from '@/components/ui/Loader';
import { courseService } from '@/services/courseService';
import { progressService } from '@/services/progressService';
import type { EnrolledCourse, ProgressData } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function LearnerDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([courseService.getEnrolledCourses(), progressService.getLearnerProgress()])
      .then(([c, p]) => {
        setCourses(c);
        setProgress(p);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  const chartData = progress?.weeklyProgress.map((d) => ({ name: d.day, value: d.hours })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500">Keep up the great work on your learning journey.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Enrolled Courses" value={courses.length} icon={BookOpen} iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
        <StatCard title="Current Streak" value={`${progress?.currentStreak ?? 0} days`} icon={Flame} iconColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30" change="Keep it going!" trend="up" />
        <StatCard title="Total XP" value={progress?.totalXp ?? 0} icon={Trophy} iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30" change="+280 this week" trend="up" />
        <StatCard title="Hours This Week" value="15.5h" icon={Clock} iconColor="bg-green-100 text-green-600 dark:bg-green-900/30" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Learning Activity</CardTitle>
          </CardHeader>
          <LineChart data={chartData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <Link key={course.id} to={`/learner/courses/${course.id}`} className="block">
                <motion.div whileHover={{ x: 4 }} className="flex items-center gap-4 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
                  <img src={course.thumbnail} alt={course.title} className="h-12 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{course.title}</p>
                    <ProgressBar value={course.progress} size="sm" showValue={false} className="mt-2" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {progress && progress.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Badges</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-4">
            {progress.badges.filter((b) => b.earnedAt).map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 dark:bg-amber-900/20">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-xs text-slate-500">{badge.earnedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
