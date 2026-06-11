import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, Circle, FileQuestion, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';
import { cn } from '@/utils/cn';

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      courseService.getCourseById(id).then((c) => {
        setCourse(c ?? null);
        if (c?.modules[0]?.lessons[0]) {
          setActiveLesson(c.modules[0].lessons[0].id);
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!course) return <div className="text-center text-slate-500">Course not found</div>;

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0,
  );
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link to="/learner/courses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ChevronLeft className="h-4 w-4" /> Back to Courses
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden p-0">
            <div className="relative flex aspect-video items-center justify-center bg-slate-900">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/20">
                  <Play className="h-8 w-8 text-primary-400" />
                </div>
                <p className="text-sm text-slate-400">Video player placeholder</p>
                <p className="mt-1 text-xs text-slate-500">Connect to backend for streaming</p>
              </div>
            </div>
          </Card>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
            <p className="mt-2 text-slate-500">{course.description}</p>
            <ProgressBar value={progress} label="Course Progress" className="mt-4" />
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {course.modules.map((module) => (
                <div key={module.id}>
                  <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{module.title}</h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                          activeLesson === lesson.id
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800',
                        )}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-slate-400">{lesson.duration}</span>
                      </button>
                    ))}
                    {module.quiz && (
                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-amber-600">
                        <FileQuestion className="h-4 w-4" />
                        <span>{module.quiz.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full">Mark as Complete</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
