import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { courseService } from '@/services/courseService';
import type { EnrolledCourse } from '@/types';

export function LearnerCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getEnrolledCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>
        <p className="text-slate-500">Continue where you left off</p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/learner/courses/${course.id}`}>
                <Card hover className="overflow-hidden p-0">
                  <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
                  <div className="p-5">
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {course.category}
                    </span>
                    <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{course.instructor}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" />{course.rating}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.enrolledCount}</span>
                    </div>
                    <ProgressBar value={course.progress} label="Progress" className="mt-4" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
