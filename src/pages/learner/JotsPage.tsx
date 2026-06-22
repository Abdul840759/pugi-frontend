import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StickyNote, Trash2, BookOpen } from 'lucide-react';

interface JotEntry {
  courseId: string;
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
  text: string;
  savedAt: string;
}

function getAllJots(): JotEntry[] {
  const jots: JotEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('pugi_notes_')) continue;
    const text = localStorage.getItem(key);
    if (!text?.trim()) continue;
    // key format: pugi_notes_{courseId}_{lessonId}
    const parts = key.replace('pugi_notes_', '').split('_');
    const courseId = parts[0];
    const lessonId = parts.slice(1).join('_');
    // Try to get course/lesson titles from meta storage
    const meta = localStorage.getItem(`pugi_meta_${courseId}_${lessonId}`);
    const parsed = meta ? JSON.parse(meta) : {};
    jots.push({
      courseId,
      lessonId,
      courseTitle: parsed.courseTitle || 'Unknown Course',
      lessonTitle: parsed.lessonTitle || 'Unknown Lesson',
      text,
      savedAt: parsed.savedAt || new Date().toISOString(),
    });
  }
  return jots.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

export function JotsPage() {
  const [jots, setJots] = useState<JotEntry[]>([]);

  useEffect(() => {
    setJots(getAllJots());
  }, []);

  const deleteJot = (courseId: string, lessonId: string) => {
    localStorage.removeItem(`pugi_notes_${courseId}_${lessonId}`);
    localStorage.removeItem(`pugi_meta_${courseId}_${lessonId}`);
    setJots(getAllJots());
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <StickyNote size={24} className="text-yellow-500" /> My Lesson Jots
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Notes you've saved while learning</p>
      </div>

      {jots.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-12 text-center">
          <StickyNote size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No jots yet.</p>
          <p className="text-sm text-gray-400">Open any lesson and write notes — they'll appear here.</p>
          <Link to="/learner/courses" className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Go to Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jots.map((jot, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-500 truncate">{jot.courseTitle}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 truncate">{jot.lessonTitle}</p>
                </div>
                <button
                  onClick={() => deleteJot(jot.courseId, jot.lessonId)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                  title="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-6">
                {jot.text}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">
                  {new Date(jot.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <Link
                  to={`/learner/courses/${jot.courseId}`}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  <BookOpen size={12} /> Go to lesson
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
