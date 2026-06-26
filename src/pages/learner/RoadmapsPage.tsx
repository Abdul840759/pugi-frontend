import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ChevronRight, Lock, CheckCircle, Circle, BookOpen, Loader2 } from 'lucide-react';
import { roadmapService } from '@/services/roadmapService';
import { useToast } from '@/hooks/useToast';

const CATEGORY_COLORS: Record<string, string> = {
  Frontend:     'from-blue-500 to-blue-700',
  Backend:      'from-green-500 to-green-700',
  Programming:  'from-purple-500 to-purple-700',
  Design:       'from-pink-500 to-pink-700',
  DevOps:       'from-orange-500 to-orange-700',
  'Data Science': 'from-cyan-500 to-cyan-700',
  Mobile:       'from-teal-500 to-teal-700',
  'AI/ML':      'from-indigo-500 to-indigo-700',
  Cybersecurity:'from-red-500 to-red-700',
  Cloud:        'from-sky-500 to-sky-700',
  Blockchain:   'from-violet-500 to-violet-700',
  'Game Dev':   'from-yellow-500 to-yellow-700',
};

const LEVEL_STYLE: Record<string, string> = {
  beginner:     'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  advanced:     'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export function RoadmapsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    roadmapService.getAllRoadmaps()
      .then(setRoadmaps)
      .catch(() => showToast('Failed to load roadmaps', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const openRoadmap = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await roadmapService.getRoadmapById(id);
      setSelected(data);
    } catch {
      showToast('Failed to load roadmap', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  // Detail view
  if (selected) {
    const gradient = CATEGORY_COLORS[selected.category] ?? 'from-gray-500 to-gray-700';
    return (
      <div className="space-y-4 p-3 sm:p-6 max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
        >
          ← Back to Roadmaps
        </button>

        {/* Header */}
        <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{selected.icon || '🗺️'}</span>
            <h1 className="text-2xl font-bold">{selected.title}</h1>
          </div>
          {selected.description && (
            <p className="text-white/80 text-sm">{selected.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${selected.overallProgress}%` }}
              />
            </div>
            <span className="text-sm font-semibold">{selected.overallProgress}%</span>
          </div>
          <p className="text-xs text-white/60 mt-1">{selected.courses.length} courses in this roadmap</p>
        </div>

        {/* Course list */}
        <div className="space-y-3">
          {selected.courses.map((entry: any, idx: number) => {
            const course = entry.course;
            const isLocked = entry.locked;
            const isCompleted = entry.completed;
            const progress = entry.progress;

            return (
              <div
                key={course?._id || idx}
                className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition-all
                  ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}
              >
                {/* Connector line */}
                {idx < selected.courses.length - 1 && (
                  <div className="absolute left-7 -bottom-3 w-0.5 h-3 bg-gray-200 dark:bg-gray-700 z-10" />
                )}

                <div className="flex items-center gap-4">
                  {/* Step indicator */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isLocked
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      : 'bg-blue-500 text-white'
                    }`}>
                    {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : idx + 1}
                  </div>

                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {course?.title || 'Course'}
                      </h3>
                      {course?.level && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_STYLE[course.level] || 'bg-gray-100 text-gray-500'}`}>
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen size={11} /> {course?.category}
                      </span>
                      {course?.duration && <span>{course.duration}</span>}
                    </div>
                    {!isLocked && progress > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{progress}% complete</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {isLocked ? (
                    <div className="flex-shrink-0 text-xs text-gray-400 flex items-center gap-1">
                      <Lock size={12} /> Locked
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/learner/courses/${course?._id}`)}
                      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${isCompleted
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                      {isCompleted ? (
                        <><CheckCircle size={12} /> Done</>
                      ) : progress > 0 ? (
                        <>Continue <ChevronRight size={12} /></>
                      ) : (
                        <>Start <ChevronRight size={12} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4 p-3 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Map size={24} className="text-blue-500" /> Learning Roadmaps
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Structured paths to master a skill from beginner to advanced.
        </p>
      </div>

      {detailLoading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-blue-500" size={28} />
        </div>
      )}

      {!detailLoading && roadmaps.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Map size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No roadmaps published yet.</p>
          <p className="text-sm mt-1">Check back soon — roadmaps are being added.</p>
        </div>
      )}

      {!detailLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmaps.map((roadmap) => {
            const gradient = CATEGORY_COLORS[roadmap.category] ?? 'from-gray-500 to-gray-700';
            const courseCount = roadmap.courses?.length || 0;
            return (
              <button
                key={roadmap._id}
                onClick={() => openRoadmap(roadmap._id)}
                className="text-left bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={`bg-gradient-to-br ${gradient} p-5 text-white`}>
                  <span className="text-3xl">{roadmap.icon || '🗺️'}</span>
                  <h2 className="mt-2 font-bold text-lg leading-tight">{roadmap.title}</h2>
                  {roadmap.category && (
                    <span className="text-xs text-white/70">{roadmap.category}</span>
                  )}
                </div>
                <div className="p-4">
                  {roadmap.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {roadmap.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} /> {courseCount} course{courseCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500 font-medium">
                      View path <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
