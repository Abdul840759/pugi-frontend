import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, ChevronRight, Code, Server, Brain, Cloud } from 'lucide-react';
import { courseService } from '@/services/courseService';

const PATHS = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: Code,
    color: 'bg-blue-500',
    description: 'Master HTML, CSS, JavaScript and React to build beautiful UIs',
    steps: [
      { title: 'HTML & CSS Fundamentals',      category: 'Frontend',     level: 'beginner'     },
      { title: 'JavaScript Fundamentals',       category: 'Frontend',     level: 'beginner'     },
      { title: 'React Foundations',             category: 'Frontend',     level: 'beginner'     },
      { title: 'Git & Version Control',         category: 'Programming',  level: 'beginner'     },
      { title: 'UI/UX Design Fundamentals',     category: 'Design',       level: 'beginner'     },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: Server,
    color: 'bg-green-500',
    description: 'Build APIs, databases and server-side applications',
    steps: [
      { title: 'JavaScript Fundamentals',       category: 'Frontend',     level: 'beginner'     },
      { title: 'Git & Version Control',         category: 'Programming',  level: 'beginner'     },
      { title: 'Node.js & Express API Development', category: 'Backend', level: 'intermediate' },
      { title: 'SQL & Databases Fundamentals',  category: 'Data Science', level: 'beginner'     },
      { title: 'Cybersecurity Fundamentals',    category: 'Cybersecurity',level: 'intermediate' },
    ],
  },
  {
    id: 'aiml',
    title: 'AI/ML Engineer',
    icon: Brain,
    color: 'bg-purple-500',
    description: 'Learn machine learning, neural networks and AI development',
    steps: [
      { title: 'Python for Beginners',          category: 'Programming',  level: 'beginner'     },
      { title: 'SQL & Databases Fundamentals',  category: 'Data Science', level: 'beginner'     },
      { title: 'AI & Machine Learning Fundamentals', category: 'AI/ML',  level: 'intermediate' },
      { title: 'Cloud Computing with AWS',      category: 'Cloud',        level: 'intermediate' },
      { title: 'DevOps & CI/CD Fundamentals',   category: 'DevOps',       level: 'intermediate' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    icon: Cloud,
    color: 'bg-orange-500',
    description: 'Master deployment, CI/CD, containers and cloud infrastructure',
    steps: [
      { title: 'Git & Version Control',         category: 'Programming',  level: 'beginner'     },
      { title: 'Node.js & Express API Development', category: 'Backend', level: 'intermediate' },
      { title: 'DevOps & CI/CD Fundamentals',   category: 'DevOps',       level: 'intermediate' },
      { title: 'Cloud Computing with AWS',      category: 'Cloud',        level: 'intermediate' },
      { title: 'Cybersecurity Fundamentals',    category: 'Cybersecurity',level: 'intermediate' },
    ],
  },
];

export function RoadmapPage() {
  const [courses, setCourses]       = useState<any[]>([]);
  const [enrolled, setEnrolled]     = useState<any[]>([]);
  const [activePath, setActivePath] = useState('frontend');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      courseService.getAllCourses(),
      courseService.getEnrolledCourses(),
    ]).then(([all, enr]) => {
      setCourses(all);
      setEnrolled(enr);
    }).finally(() => setLoading(false));
  }, []);

  const currentPath = PATHS.find(p => p.id === activePath)!;

  const getStepStatus = (step: any, stepIndex: number, pathSteps: any[]) => {
    const course = courses.find(c =>
      c.title.toLowerCase().includes(step.title.toLowerCase().split(' ')[0].toLowerCase()) ||
      step.title.toLowerCase().includes(c.title.toLowerCase().split(' ')[0].toLowerCase())
    );
    const isEnrolled = course && enrolled.find(e =>
      (e._id || e.id) === (course._id || course.id)
    );
    const isDone = isEnrolled?.progress === 100 ||
      enrolled.some(e => e.progress === 100 &&
        courses.find(c => (c._id || c.id) === (e._id || e.id) &&
          c.title.toLowerCase().includes(step.title.split(' ')[0].toLowerCase())
        )
      );

    // First step always unlocked, rest unlock when previous is done
    const prevDone = stepIndex === 0 || (() => {
      const prev = pathSteps[stepIndex - 1];
      const prevCourse = courses.find(c =>
        c.title.toLowerCase().includes(prev.title.split(' ')[0].toLowerCase())
      );
      return prevCourse && enrolled.find(e =>
        (e._id || e.id) === (prevCourse._id || prevCourse.id) && e.progress === 100
      );
    })();

    return {
      course,
      done:     isDone,
      locked:   !prevDone && !isDone,
      enrolled: !!isEnrolled,
    };
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Roadmaps</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Follow a structured path to reach your career goal</p>
      </div>

      {/* Path selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PATHS.map(path => {
          const Icon = path.icon;
          return (
            <button
              key={path.id}
              onClick={() => setActivePath(path.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activePath === path.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${path.color} flex items-center justify-center mb-2`}>
                <Icon size={16} className="text-white" />
              </div>
              <p className={`text-sm font-semibold ${activePath === path.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                {path.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active path */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${currentPath.color} flex items-center justify-center`}>
            <currentPath.icon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">{currentPath.title} Path</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentPath.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentPath.steps.map((step, idx) => {
            const status = getStepStatus(step, idx, currentPath.steps);
            return (
              <div key={idx} className="flex items-center gap-4">
                {/* Step number / status icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                  ${status.done   ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                  : status.locked ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}
                >
                  {status.done ? <CheckCircle size={20} /> : status.locked ? <Lock size={16} /> : idx + 1}
                </div>

                {/* Connector line */}
                {idx < currentPath.steps.length - 1 && (
                  <div className="absolute ml-5 mt-10 w-0.5 h-3 bg-gray-200 dark:bg-gray-700" style={{ marginTop: '40px', marginLeft: '20px', position: 'absolute', height: '12px' }} />
                )}

                {/* Step content */}
                <div className={`flex-1 p-4 rounded-xl border transition-all ${
                  status.done   ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
                  : status.locked ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-60'
                  : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          status.done ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : status.locked ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          Step {idx + 1}
                        </span>
                        {status.done && <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Completed</span>}
                        {status.locked && <span className="text-xs text-gray-400">🔒 Locked</span>}
                      </div>
                      <p className={`font-semibold ${status.locked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.category} · {step.level}</p>
                    </div>
                    {!status.locked && status.course && (
                      <Link
                        to={`/learner/courses/${status.course._id || status.course.id}`}
                        className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          status.done
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {status.done ? 'Review' : status.enrolled ? 'Continue' : 'Start'}
                        <ChevronRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress summary */}
        {!loading && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Path Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {currentPath.steps.filter((s, i) => getStepStatus(s, i, currentPath.steps).done).length} / {currentPath.steps.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(currentPath.steps.filter((s, i) => getStepStatus(s, i, currentPath.steps).done).length / currentPath.steps.length) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
