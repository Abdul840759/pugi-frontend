import { useEffect, useState } from 'react';
import { Video, Calendar, Clock, Users, ExternalLink, Loader2, Radio } from 'lucide-react';
import { liveClassService } from '@/services/liveClassService';
import { useToast } from '@/hooks/useToast';

export function LiveClassesPage() {
  const { showToast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    liveClassService.getAll()
      .then(setClasses)
      .catch(() => showToast('Failed to load live classes', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const live = classes.filter(c => c.status === 'live');
  const upcoming = classes.filter(c => c.status === 'scheduled');

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Video size={24} className="text-blue-500" /> Live Classes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Join live sessions hosted by your tutors in real time.
        </p>
      </div>

      {/* Live now */}
      {live.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <Radio size={14} className="animate-pulse" /> Live Now
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map(cls => (
              <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 border-red-400">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                    <Radio size={10} className="animate-pulse" /> LIVE
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{cls.title}</h3>
                {cls.courseName && <p className="text-xs text-gray-500 mb-1">{cls.courseName}</p>}
                <p className="text-xs text-gray-400 mb-3">by {cls.tutorName}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={11} /> {cls.students || 0} joined
                  </span>
                  
                    href={cls.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium"
                  >
                    Join Now <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Video size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No upcoming live classes yet.</p>
            <p className="text-sm mt-1">Your tutors will schedule sessions here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(cls => (
              <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                    <Video size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{cls.title}</h3>
                    {cls.courseName && <p className="text-xs text-gray-500 truncate">{cls.courseName}</p>}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">by <span className="font-medium text-gray-600 dark:text-gray-300">{cls.tutorName}</span></p>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} /> {cls.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} /> {cls.time} {cls.duration && `· ${cls.duration}`}
                  </div>
                </div>
                
                  href={cls.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-medium transition-colors"
                >
                  <ExternalLink size={11} /> Add to Calendar / Join Link
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
