import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { courseService } from '@/services/courseService';

export function CreateCoursePage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [modules, setModules] = useState([{ title: 'Module 1', lessons: ['Introduction'] }]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await courseService.createCourse({
        title,
        description,
        category,
        level,
        instructor: user?.name ?? 'Unknown',
        instructorId: user?.id ?? '2',
        duration: `${modules.length * 4}h`,
      });
      addToast({ title: 'Course created!', message: 'Your course has been saved as a draft', type: 'success' });
      navigate('/tutor/courses');
    } catch {
      addToast({ title: 'Error', message: 'Failed to create course', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const addModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}`, lessons: ['New Lesson'] }]);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Course</h1>
        <p className="text-slate-500">Build a new course for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <div className="space-y-4">
            <Input id="title" label="Course Title" placeholder="e.g. React.js Masterclass" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                rows={4}
                placeholder="Describe your course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {['Frontend', 'Backend', 'Programming', 'Design', 'DevOps'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Level</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as typeof level)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Course Modules</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addModule}>
                <Plus className="h-4 w-4" /> Add Module
              </Button>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Input
                    value={mod.title}
                    onChange={(e) => {
                      const updated = [...modules];
                      updated[i].title = e.target.value;
                      setModules(updated);
                    }}
                    className="flex-1"
                  />
                  {modules.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setModules(modules.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading}>Create Course</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/tutor/courses')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
