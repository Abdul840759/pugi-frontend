import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/hooks/useToast';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export function CourseModerationPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    courseService.getPendingCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await courseService.updateCourseStatus(id, 'published');
    setCourses(courses.filter((c) => c.id !== id));
    addToast({ title: 'Course approved', type: 'success' });
  };

  const handleReject = async (id: string) => {
    await courseService.updateCourseStatus(id, 'rejected');
    setCourses(courses.filter((c) => c.id !== id));
    addToast({ title: 'Course rejected', type: 'warning' });
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Moderation</h1>
        <p className="text-slate-500">Review courses pending approval</p>
      </div>

      {courses.length === 0 ? (
        <Card className="py-12 text-center text-slate-500">No courses pending review</Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col gap-4 sm:flex-row">
              <img src={course.thumbnail} alt="" className="h-32 w-48 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{course.description}</p>
                <p className="mt-2 text-xs text-slate-400">
                  By {course.instructor} · {course.category} · {course.level}
                </p>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <Button size="sm" onClick={() => handleApprove(course.id)}>
                  <Check className="h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleReject(course.id)}>
                  <X className="h-4 w-4" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
