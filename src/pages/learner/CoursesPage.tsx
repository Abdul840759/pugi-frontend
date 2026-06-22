import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Play, Users, Star, Code, Server, Terminal, Palette,
  GitBranch, Database, Smartphone, Brain, Shield, Cloud, Link2, Gamepad2,
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { useToast } from '@/hooks/useToast';
import { Loader } from '@/components/ui/Loader';

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
const LEVELS = ['All', 'beginner', 'intermediate', 'advanced'];

export function LearnerCoursesPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;
      const data = await courseService.getAllCourses(params);
      setCourses(data);
    } catch {
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [category, level, search, showToast]);

  const fetchEnrolled = async () => {
    try {
      const data = await courseService.getEnrolledCourses();
      setEnrolled(new Set(data.map((c: any) => c._id)));
    } catch {
      // not critical
    }
  };

  useEffect(() => {
    fetchEnrolled();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeout);
  }, [fetchCourses]);

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await courseService.enrollInCourse(courseId);
      setEnrolled((prev) => new Set([...prev, courseId]));
      showToast('Enrolled successfully! 🎉', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Enrollment failed', 'error');
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
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
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
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-48"><Loader /></div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Search size={40} className="mx-auto mb-3 text-gray-300" />
          <p>No courses found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => {
            const isEnrolled = enrolled.has(course._id);
            return (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <Link to={`/learner/courses/${course._id}`}>
                  <img
                    src={course.thumbnail || 'https://placehold.co/400x200?text=Course'}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{course.level}</span>
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
                      ? '✓ Enrolled'
                      : enrolling === course._id
                      ? 'Enrolling...'
                      : 'Enroll Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
