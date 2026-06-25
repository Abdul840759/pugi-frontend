import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { api } from '@/services/api';
import { useToast } from '@/hooks/useToast';

const questions = [
  {
    question: 'Have you written code before?',
    options: [
      { label: 'Never written a line of code', points: 0 },
      { label: 'A little — tutorials and small projects', points: 1 },
      { label: 'Yes — I build things regularly', points: 2 },
    ],
  },
  {
    question: 'Which of these do you understand?',
    options: [
      { label: 'None of these yet', points: 0 },
      { label: 'Variables, loops, and functions', points: 1 },
      { label: 'APIs, databases, and system design', points: 2 },
    ],
  },
  {
    question: 'Pick the option that best describes you:',
    options: [
      { label: 'I want to learn programming from scratch', points: 0 },
      { label: 'I know the basics but want to go deeper', points: 1 },
      { label: 'I am building real projects and want advanced skills', points: 2 },
    ],
  },
  {
    question: 'Have you built anything on your own?',
    options: [
      { label: 'Not yet', points: 0 },
      { label: 'Yes — small apps or scripts', points: 1 },
      { label: 'Yes — full projects with real users', points: 2 },
    ],
  },
  {
    question: 'How comfortable are you with problem solving?',
    options: [
      { label: 'I struggle with logic problems', points: 0 },
      { label: 'I can solve basic problems with some help', points: 1 },
      { label: 'I tackle complex problems independently', points: 2 },
    ],
  },
];

const getLevel = (score: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (score <= 3) return 'beginner';
  if (score <= 6) return 'intermediate';
  return 'advanced';
};

const levelInfo = {
  beginner: {
    emoji: '🌱',
    title: 'Beginner',
    desc: 'You are just getting started — perfect! We will guide you from the ground up.',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
  },
  intermediate: {
    emoji: '⚡',
    title: 'Intermediate',
    desc: 'You know the basics — time to level up with deeper concepts and real projects.',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  advanced: {
    emoji: '🚀',
    title: 'Advanced',
    desc: 'You are already building things — we will sharpen your skills to the next level.',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { updateUser, user: _user } = useAuthContext();
  const { showToast } = useToast();

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setSelected(null);
      setStep(step + 1);
    } else {
      const score = newAnswers.reduce((a, b) => a + b, 0);
      setResult(getLevel(score));
    }
  };

  const handleConfirm = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await api.post('/auth/onboarding', { techLevel: result });
      updateUser({ techLevel: result, onboardingComplete: true });
      navigate('/learner/dashboard', { replace: true });
    } catch {
      showToast('Failed to save your level, please try again', 'error');
    } finally {
      setSaving(false);
    }
  };

  const q = questions[step];
  const progress = ((step) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Let's find your level</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Answer {questions.length} quick questions so we can personalise your learning path.
          </p>
        </div>

        {!result ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div
                  className="h-1.5 bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{q.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(opt.points)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all
                    ${selected === opt.points
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {step < questions.length - 1 ? 'Next →' : 'See my result'}
            </button>
          </div>
        ) : (
          <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border ${levelInfo[result].border} p-8 text-center`}>
            <div className="text-6xl mb-4">{levelInfo[result].emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You are <span className={levelInfo[result].color}>{levelInfo[result].title}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{levelInfo[result].desc}</p>

            <div className={`rounded-xl p-4 ${levelInfo[result].bg} mb-6`}>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your personalised course feed will be ready on your dashboard.</p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {saving ? 'Saving...' : 'Go to Dashboard →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
