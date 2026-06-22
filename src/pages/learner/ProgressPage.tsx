import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, BookOpen, CheckCircle, Clock, Star } from 'lucide-react';
import { progressService } from '@/services/progressService';
import { Loader } from '@/components/ui/Loader';

export function LearnerProgressPage() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getLearnerProgress()
      .then(setProgress)
      .catch(() => setProgress(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;
  if (!progress) return (
    <div className="p-6 text-center text-gray-500">
      <Trophy size={40} className="mx-auto mb-3 text-gray-300" />
      <p>No progress data yet. Start learning!</p>
      <Link to="/learner/courses" className="text-blue-500 hover:underline text-sm mt-2 inline-block">Browse courses</Link>
    </div>
  );

  const completedCourses = progress.enrollments?.filter((e: any) => e.progress === 100) || [];
  const inProgress = progress.enrollments?.filter((e: any) => e.progress > 0 && e.progress < 100) || [];
  const notStarted = progress.enrollments?.filter((e: any) => e.progress === 0) || [];
  const totalLessons = progress.enrollments?.reduce((acc: number, e: any) => acc + (e.completedLessons?.length || 0), 0) || 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your learning journey</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Flame,        label: 'Current Streak',    value: `${progress.streak || 0} days`,              color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20'  },
          { icon: Trophy,       label: 'Total XP',          value: (progress.xp || 0).toLocaleString(),          color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20'   },
          { icon: BookOpen,     label: 'Courses Enrolled',  value: progress.enrollments?.length || 0,            color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20'     },
          { icon: CheckCircle,  label: 'Lessons Completed', value: totalLessons,                                  color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20'   },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 flex items-center gap-4 ${stat.bg} border border-gray-100 dark:border-gray-700`}>
            <stat.icon className={`h-8 w-8 flex-shrink-0 ${stat.color}`} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-blue-500" /> In Progress ({inProgress.length})
          </h2>
          <div className="space-y-4">
            {inProgress.map((e: any, i: number) => (
              <Link key={i} to={`/learner/courses/${e.course?._id}`} className="block hover:opacity-80 transition-opacity">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{e.course?.title || 'Unknown Course'}</span>
                  <span className="text-gray-500 flex-shrink-0 ml-2">{e.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${e.progress}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {e.completedLessons?.length || 0} lessons done
                  {e.lastAccessed && ` · ${new Date(e.lastAccessed).toLocaleDateString()}`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedCourses.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" /> Completed ({completedCourses.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {completedCourses.map((e: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{e.course?.title}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">100% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not started */}
      {notStarted.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" /> Not Started ({notStarted.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {notStarted.map((e: any, i: number) => (
              <Link key={i} to={`/learner/courses/${e.course?._id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <BookOpen size={20} className="text-gray-400 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{e.course?.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {progress.badges?.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star size={16} className="text-amber-500" /> Badges Earned ({progress.badges.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {progress.badges.map((badge: any) => (
              <div key={badge.id} className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 text-center">
                <span className="text-3xl">{badge.icon}</span>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
                {badge.earnedAt && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!progress.enrollments?.length && (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-3">You haven't enrolled in any courses yet.</p>
          <Link to="/learner/courses" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
