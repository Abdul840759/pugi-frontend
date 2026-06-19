import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Users, Send, FileText, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { courseService } from '@/services/courseService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { Course } from '@/types';
import { cn } from '@/utils/cn';

const statusColors: Record<Course['status'], string> = {
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function ManageCoursesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      courseService.getTutorCourses().then(setCourses).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Loader fullScreen />;

  const updateStatus = async (courseId: string, status: 'draft' | 'pending') => {
    setBusyId(courseId);
    try {
      const updated = await courseService.updateCourseStatus(courseId, status);
      setCourses((current) => current.map((course) => course.id === courseId ? updated : course));
      addToast({
        title: status === 'pending' ? 'Course submitted for review' : 'Course moved to draft',
        type: 'success',
      });
    } finally {
      setBusyId(null);
    }
  };

  const deleteCourse = async (courseId: string) => {
    const confirmed = window.confirm('Delete this course? This cannot be undone.');
    if (!confirmed) return;
    setBusyId(courseId);
    try {
      await courseService.deleteCourse(courseId);
      setCourses((current) => current.filter((course) => course.id !== courseId));
      addToast({ title: 'Course deleted', type: 'success' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>
          <p className="text-slate-500">Manage and edit your courses</p>
        </div>
        <Link to="/tutor/create-course">
          <Button><Plus className="h-4 w-4" /> New Course</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src={course.thumbnail} alt="" className="h-24 w-36 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusColors[course.status])}>
                  {course.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{course.category} · {course.level} · {course.duration}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.enrolledCount} students</span>
                <span>Rating: {course.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {course.status === 'draft' ? (
                <Button size="sm" onClick={() => updateStatus(course.id, 'pending')} disabled={busyId === course.id}>
                  <Send className="h-4 w-4" /> Publish
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => updateStatus(course.id, 'draft')} disabled={busyId === course.id}>
                  <FileText className="h-4 w-4" /> Draft
                </Button>
              )}
              <Button variant="outline" size="sm"><Edit className="h-4 w-4" /> Edit</Button>
              <Button variant="danger" size="sm" onClick={() => deleteCourse(course.id)} disabled={busyId === course.id}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
