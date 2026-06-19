import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import { useToast } from '@/hooks/useToast';
import { api } from '@/services/api';
import type { LiveClass } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<LiveClass['status'], string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

export function SchedulePage() {
  const { showToast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', courseName: '', date: '', time: '', duration: '1 hour', meetLink: '' });

  const load = () => progressService.getLiveClasses().then(setClasses).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.meetLink) {
      showToast('Please fill in all required fields', 'error'); return;
    }
    setSaving(true);
    try {
      await api.post('/progress/tutor/live-classes', form);
      showToast('Live class scheduled!', 'success');
      setForm({ title: '', courseName: '', date: '', time: '', duration: '1 hour', meetLink: '' });
      setShowForm(false);
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to schedule class', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/progress/tutor/live-classes/${id}`);
      showToast('Class removed', 'success');
      setClasses((c) => c.filter((cls) => cls.id !== id));
    } catch {
      showToast('Failed to delete class', 'error');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Classes</h1>
          <p className="text-slate-500">Schedule and manage your live sessions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Schedule Class
        </Button>
      </div>

      {/* Add Class Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">New Live Class</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input label="Class Title *" name="title" value={form.title} onChange={handleChange} placeholder="e.g. React Hooks Deep Dive" />
            <Input label="Course Name" name="courseName" value={form.courseName} onChange={handleChange} placeholder="e.g. React Masterclass" />
            <Input label="Date *" name="date" type="date" value={form.date} onChange={handleChange} />
            <Input label="Time *" name="time" type="time" value={form.time} onChange={handleChange} />
            <Input label="Duration" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 1 hour" />
            <Input label="Meet Link *" name="meetLink" value={form.meetLink} onChange={handleChange} placeholder="https://meet.google.com/..." />
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? 'Scheduling...' : 'Schedule Class'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Class List */}
      <div className="grid gap-4">
        {classes.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Video className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No live classes scheduled yet. Click "Schedule Class" to add one.</p>
          </div>
        )}
        {classes.map((cls) => (
          <Card key={cls.id} className="flex flex-col gap-4 sm:flex-row sm:items-center p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{cls.title}</h3>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusStyles[cls.status as keyof typeof statusStyles])}>
                  {cls.status}
                </span>
              </div>
              {cls.courseName && <p className="text-sm text-slate-500">{cls.courseName}</p>}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{cls.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{cls.time} · {cls.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{cls.students} students</span>
              </div>
              {cls.meetLink && (
                <a href={cls.meetLink} target="_blank" rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-violet-600 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> {cls.meetLink}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              {cls.meetLink && (
                <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm"><Video className="h-4 w-4 mr-1" /> Start</Button>
                </a>
              )}
              <Button size="sm" variant="secondary" onClick={() => handleDelete(cls.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
