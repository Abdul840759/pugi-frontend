import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { LiveClass } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<LiveClass['status'], string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

export function SchedulePage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getLiveClasses().then(setClasses).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Class Schedule</h1>
          <p className="text-slate-500">Manage your upcoming and past live sessions</p>
        </div>
        <Button><Video className="h-4 w-4" /> Schedule Class</Button>
      </div>

      <div className="grid gap-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{cls.title}</h3>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusStyles[cls.status])}>
                  {cls.status}
                </span>
              </div>
              <p className="text-sm text-slate-500">{cls.courseName}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{cls.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{cls.time} · {cls.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{cls.students} students</span>
              </div>
            </div>
            {cls.status === 'scheduled' && (
              <Button size="sm">Start Class</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
