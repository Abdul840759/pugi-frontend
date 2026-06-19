import { useState } from 'react';
import { Search, Video, Calendar, Clock, ExternalLink, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

const statusStyles: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export function LiveClassesPage() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get('/progress/learner/live-classes/search', { params: { q: query } });
      setResults(data);
    } catch {
      showToast('Failed to search live classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find Live Classes</h1>
        <p className="text-slate-500">Search for live classes from tutors</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search by class title, course or tutor name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* Results */}
      {!searched && (
        <div className="text-center py-16 text-slate-400">
          <Video className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Search for live classes above</p>
          <p className="text-sm">Find scheduled or ongoing classes from your tutors</p>
        </div>
      )}

      {searched && results.length === 0 && !loading && (
        <div className="text-center py-16 text-slate-400">
          <Video className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No live classes found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      <div className="grid gap-4">
        {results.map((cls) => (
          <Card key={cls.id} className="flex flex-col gap-4 sm:flex-row sm:items-center p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 shrink-0">
              <Video className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-900 dark:text-white">{cls.title}</h3>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusStyles[cls.status] ?? '')}>
                  {cls.status}
                </span>
              </div>
              {cls.courseName && <p className="text-sm text-slate-500">{cls.courseName}</p>}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                {cls.tutorName && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{cls.tutorName}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{cls.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{cls.time} · {cls.duration}</span>
              </div>
            </div>
            <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                <ExternalLink className="h-4 w-4 mr-1" /> Join Class
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
