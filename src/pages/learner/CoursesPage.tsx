import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Play, Users, Star, Code, Server, Terminal, Palette,
  GitBranch, Database, Smartphone, Brain, Shield, Cloud, Link2, Gamepad2, Lock,
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { useToast } from '@/hooks/useToast';
import { useAuthContext } from '@/context/AuthContext';
import { Loader } from '@/components/ui/Loader';
import { UpgradeLimitModal, type UpgradeLimitReason } from '@/components/courses/UpgradeLimitModal';

const CATEGORY_META: Record<string, { icon: any; color: string }> = {
  Frontend: { icon: Code, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  Backend: { icon: Server, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  Programming: { icon: Terminal, color: 'text-gray-600 bg-gray-100 dark:bg-gray-700/40' },
  Design: { icon: Palette, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
  DevOps: { icon: GitBranch, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  'Data Science': { icon: Database, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  Mobile: { icon: Smartphone, color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
  'AI/ML': { icon: Brain, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
  Cybersecurity: { icon: Shield, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  Cloud: { icon: Cloud, color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/20' },
  Blockchain: { icon: Link2, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  'Game Dev': { icon: Gamepad2, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
};

const CATEGORIES = Object.keys(CATEGORY_META);

const getCategoryGradient = (category: string): string => {
  const gradients: Record<string, string> = {
    'Frontend':     'bg-gradient-to-br from-blue-500 to-blue-700',
    'Backend':      'bg-gradient-to-br from-green-500 to-green-700',
    'Programming':  'bg-gradient-to-br from-purple-500 to-purple-700',
    'Design':       'bg-gradient-to-br from-pink-500 to-pink-700',
    'DevOps':       'bg-gradient-to-br from-orange-500 to-orange-700',
    'Data Science': 'bg-gradient-to-br from-cyan-500 to-cyan-700',
    'Mobile':       'bg-gradient-to-br from-teal-500 to-teal-700',
    'AI/ML':        'bg-gradient-to-br from-indigo-500 to-indigo-700',
    'Cybersecurity':'bg-gradient-to-br from-red-500 to-red-700',
    'Cloud':        'bg-gradient-to-br from-sky-500 to-sky-700',
    'Blockchain':   'bg-gradient-to-br from-violet-500 to-violet-700',
    'Game Dev':     'bg-gradient-to-br from-yellow-500 to-yellow-700',
  };
  return gradients[category] ?? 'bg-gradient-to-br from-gray-500 to-gray-700';
};

export function LearnerCoursesPage() {
  const { showToast } = useToast();
  const { user, refreshPlan } = useAuthContext();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [upgradeModalReason, setUpgradeModalReason] = useState<UpgradeLimitReason | null>(null);

  const isPro = user?.plan === 'pro';
  const hasEnrollment = enrolled.size > 0;

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (user?.techLevel) params.minLevel = user.techLevel;
      const data = await courseService.getAllCourses(params);
      setCourses(data);
    } catch {
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [category, search, showToast, user?.techLevel]);

  const fetchEnrolled = async () => {
    try {
      const data = await courseService.getEnrolledCourses();
      setEnrolled(new Set(data.map((c: any) => c._id)));
    } catch {
      // not critical
    }
  };

  useEffect(() => { fetchEnrolled(); }, []);
  useEffect(() => {
    const timeout = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeout);
  }, [fetchCourses]);

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await courseService.enrollInCourse(courseId);
      setEnrolled((prev) => new Set([...prev, courseId]));
      showToast('Enrolled successfully!', 'success');
    } catch (err: any) {
      const code = err?.response?.data?.code;
      if (code === 'FREE_PLAN_LIMIT' || code === 'LEVEL_MISMATCH') {
        setUpgradeModalReason(code);
      } else {
        showToast(err?.response?.data?.message || 'Enrollment failed', 'error');
      }
    } finally {
      setEnrolling(null);
    }
  };

  const selectCategory = (cat: string) => {
    setCategory((prev) => (prev === cat ? 'All' : cat));
  };

  return (
    <div className="space-y-4 p-3 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Discover and enroll in courses to start learning
        </p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {CATEGORIES.map((cat: string) => {
          const meta = CATEGORY_META[cat] || { icon: Terminal, color: 'bg-gray-100' };
          const Icon = meta.icon;
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-2 sm:p-3 text-center transition-all
                ${active
                  ? 'bg-blue-500 text-white shadow-md scale-[1.03]'
                  : 'bg-white dark:bg-gray-800 hover:shadow-md hover:-translate-y-0.5'
                }`}
            >
              <span className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${active ? 'bg-white/20' : meta.color}`}>
                <Icon size={18} className={active ? 'text-white' : ''} />
              </span>
              <span className={`text-xs font-medium leading-tight ${active ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex gap-6">
        {/* Level Sidebar */}
        <div className="hidden md:flex flex-col gap-2 w-44 shrink-0">
          {[
            { key: 'all', emoji: '📚', label: 'All Levels' },
            { key: 'beginner', emoji: '🌱', label: 'Beginner' },
            { key: 'intermediate', emoji: '⚡', label: 'Intermediate' },
            { key: 'advanced', emoji: '🚀', label: 'Advanced' },
          ]
            .filter(l => {
              if (l.key === 'all') return true;
              const levelOrder = ['beginner', 'intermediate', 'advanced'];
              const userIdx = user?.techLevel ? levelOrder.indexOf(user.techLevel) : 0;
              const lvlIdx = levelOrder.indexOf(l.key);
              return lvlIdx >= userIdx;
            })
            .map(l => (
              <button
                key={l.key}
                onClick={() => setSelectedLevel(l.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${selectedLevel === l.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <span>{l.emoji}</span>
                <span>{l.label}</span>
              </button>
            ))}
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-48"><Loader /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <Search size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No courses found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Object.entries(
                (selectedLevel === 'all' ? courses : courses.filter((c: any) => c.level === selectedLevel)).reduce((acc: any, course: any) => {
                  const key = course.category;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(course);
                  return acc;
                }, {})
              ).map(([_cat, catCourses]: [string, any]) => {
                const levelOrder = ['beginner', 'intermediate', 'advanced'];
                const sorted = [...catCourses].sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level));
                const topCourse = sorted[0];
                const levels = sorted.map((c: any) => c.level);
                const isEnrolled = sorted.some((c: any) => enrolled.has(c._id));
                const course = topCourse;

                // Free plan lock: not enrolled, not pro, and already has an enrollment elsewhere
                const isLocked = !isPro && !isEnrolled && hasEnrollment;

                return (
                  <div
                    key={course._id}
                    className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative
                      ${isLocked ? 'opacity-75' : ''}`}
                  >
                    {/* Lock overlay badge */}
                    {isLocked && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gray-900/80 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                        <Lock size={11} />
                        Pro required
                      </div>
                    )}

                    <Link to={`/learner/courses/${course._id}`}>
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                      ) : (
                        <div className={`w-full h-40 flex items-center justify-center text-white font-bold text-lg text-center px-4 ${getCategoryGradient(course.category)}`}>
                          {course.category}
                        </div>
                      )}
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                          {course.category}
                        </span>
                        {levels.map((lvl: string) => (
                          <span key={lvl} className={{
                            beginner: 'text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                            intermediate: 'text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                            advanced: 'text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                          }[lvl] || 'text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500'}>
                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                          </span>
                        ))}
                      </div>

                      <Link to={`/learner/courses/${course._id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-blue-500 transition-colors">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400" />
                          {course.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {course.enrolledCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play size={12} />
                          {course.duration}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">by {course.instructor}</p>

                      {isLocked ? (
                        <button
                          onClick={() => setUpgradeModalReason('FREE_PLAN_LIMIT')}
                          className="mt-4 w-full py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors"
                        >
                          <Lock size={13} />
                          Upgrade to Enroll
                        </button>
                      ) : (
                        <button
                          onClick={() => !isEnrolled && handleEnroll(course._id)}
                          disabled={isEnrolled || enrolling === course._id}
                          className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors
                            ${isEnrolled
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 cursor-default'
                              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                            }`}
                        >
                          {isEnrolled
                            ? 'Enrolled'
                            : enrolling === course._id
                            ? 'Enrolling...'
                            : 'Enroll Now'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <UpgradeLimitModal
        isOpen={!!upgradeModalReason}
        reason={upgradeModalReason}
        onClose={() => setUpgradeModalReason(null)}
        onUpgraded={() => {
          void refreshPlan();
          void fetchCourses();
        }}
      />
    </div>
  );
}
