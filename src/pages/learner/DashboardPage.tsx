import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flame, Star, Trophy, TrendingUp, Play, Sparkles, ArrowUpCircle } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { progressService } from '@/services/progressService';
import { courseService } from '@/services/courseService';
import { StatCard } from '@/components/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader } from '@/components/ui/Loader';
import { UpgradeLimitModal } from '@/components/courses/UpgradeLimitModal';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface EnrollmentEntry {
  course: any;
  progress: number;
  completedLessons: string[];
  lastAccessed: string;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Game Dev': '#22c55e',
    'Blockchain': '#6366f1',
    'Cloud': '#f59e0b',
    'Web Dev': '#3b82f6',
    'Mobile': '#ec4899',
    'AI/ML': '#8b5cf6',
    'DevOps': '#14b8a6',
    'Data Science': '#f97316',
  };
  return colors[category] ?? '#6366f1';
};

const SKILL_LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function LearnerDashboardPage() {
  const { user, refreshPlan } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentEntry[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const isPro = user?.plan === 'pro';

  const MESSAGES = [
    'Keep up the momentum, you are doing great!',
    'Every lesson brings you one step closer to your goals.',
    'Consistency beats talent. Keep showing up!',
    'You are building something amazing, one lesson at a time.',
    'Great things take time. Stay focused and keep learning!',
    'The best investment you can make is in yourself.',
    'Progress, not perfection. You are on the right track!',
    'Small steps every day lead to big results.',
    'Your future self will thank you for learning today.',
    'Keep going — the hardest part is showing up, and you did!',
  ];

  const isFirstVisit = !localStorage.getItem('pugi_visited');
  const msgIndexRef = useRef(Math.floor(Math.random() * MESSAGES.length));
  const [motivMsg, setMotivMsg] = useState(MESSAGES[msgIndexRef.current]);

  useEffect(() => {
    localStorage.setItem('pugi_visited', 'true');
    const interval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % MESSAGES.length;
      setMotivMsg(MESSAGES[msgIndexRef.current]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  const skillLabel = user?.skillLevel ? SKILL_LEVEL_LABEL[user.skillLevel] : (user?.techLevel ? SKILL_LEVEL_LABEL[user.techLevel] : null);

  useEffect(() => {
    const load = async () => {
      try {
        const [progress, courses] = await Promise.all([
          progressService.getLearnerProgress(),
          courseService.getAllCourses(),
        ]);
        setXp(progress.xp);
        setStreak(progress.streak);
        setBadges(progress.badges);
        setEnrollments(progress.enrollments || []);
        setAllCourses(courses);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;

  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100);
  const completed = enrollments.filter((e) => e.progress === 100);

  return (
    <div className="space-y-4 p-3 sm:p-6">
      {/* Header + plan badge */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Keep up the momentum, you are doing great!
          </p>
        </div>

        {/* Plan + skill level badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {skillLabel && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {skillLabel}
            </span>
          )}
          {isPro ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm">
              <Sparkles size={12} />
              PUGI Pro
            </span>
          ) : (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              <ArrowUpCircle size={12} />
              Free Plan — Upgrade
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Enrolled" value={enrollments.length} icon={BookOpen} />
        <StatCard title="Streak" value={`${streak}d`} icon={Flame} />
        <StatCard title="XP" value={xp} icon={Star} />
        <StatCard title="Badges" value={badges.length} icon={Trophy} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Continue Learning</h2>
          <Link to="/learner/courses" className="text-sm text-blue-500 hover:underline">View all</Link>
        </div>
        {inProgress.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <TrendingUp className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 dark:text-gray-400">No courses in progress yet.</p>
            <Link to="/learner/courses" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {inProgress.slice(0, 4).map((e) => (
              <Link
                key={e.course?._id}
                to={`/learner/courses/${e.course?._id}`}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={e.course?.thumbnail || 'https://placehold.co/80x60?text=Course'}
                  alt={e.course?.title}
                  className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {e.course?.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {e.course?.instructor}
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{e.progress}% complete</span>
                    </div>
                    <ProgressBar value={e.progress} max={100} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Explore Courses</h2>
          <Link to="/learner/courses" className="text-sm text-blue-500 hover:underline">See all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {allCourses.slice(0, 3).map((course) => (
            <Link
              key={course._id}
              to={`/learner/courses/${course._id}`}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
              ) : (
                <div
                  className="w-full h-36 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: getCategoryColor(course.category) }}
                >
                  {course.category}
                </div>
              )}
              <div className="p-4">
                <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                  {course.category}
                </span>
                <h3 className="font-medium text-gray-900 dark:text-white mt-2 text-sm line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Play size={12} />
                  <span>{course.level}</span>
                  <span>.</span>
                  <span>{course.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {badges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completed ({completed.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {completed.map((e) => (
              <div
                key={e.course?._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex gap-4 items-center"
              >
                <img
                  src={e.course?.thumbnail || 'https://placehold.co/80x60?text=Course'}
                  alt={e.course?.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{e.course?.title}</h3>
                  <span className="text-xs text-green-500 font-medium">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <UpgradeLimitModal
        isOpen={upgradeModalOpen}
        reason={upgradeModalOpen ? 'UPGRADE_PROMPT' : null}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgraded={() => { void refreshPlan(); }}
      />
    </div>
  );
}
