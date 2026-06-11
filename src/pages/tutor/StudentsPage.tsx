import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { StudentPerformance } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<StudentPerformance['status'], string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  'at-risk': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function StudentsPage() {
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getStudentPerformance().then(setStudents).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Student Performance</h1>
        <p className="text-sm text-slate-500 sm:text-base">Monitor and support your students</p>
      </div>

      {/* Mobile & tablet card view */}
      <div className="space-y-3 md:hidden">
        {students.map((student) => (
          <Card key={student.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900 dark:text-white">{student.name}</p>
                <p className="truncate text-xs text-slate-500">{student.email}</p>
              </div>
              <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusStyles[student.status])}>
                {student.status}
              </span>
            </div>
            <p className="mt-2 truncate text-sm text-slate-600 dark:text-slate-400">{student.course}</p>
            <div className="mt-3">
              <ProgressBar value={student.progress} label="Progress" size="sm" />
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Quiz: {student.quizScore}%</span>
              <span>Active: {student.lastActive}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="hidden overflow-x-auto p-0 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Student</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Course</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Progress</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Quiz Score</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Last Active</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-4 lg:px-6">
                  <p className="font-medium text-slate-900 dark:text-white">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.email}</p>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-400 lg:px-6">{student.course}</td>
                <td className="w-36 px-4 py-4 lg:w-40 lg:px-6">
                  <ProgressBar value={student.progress} size="sm" showValue={false} />
                </td>
                <td className="px-4 py-4 lg:px-6">{student.quizScore}%</td>
                <td className="px-4 py-4 text-slate-500 lg:px-6">{student.lastActive}</td>
                <td className="px-4 py-4 lg:px-6">
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusStyles[student.status])}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
