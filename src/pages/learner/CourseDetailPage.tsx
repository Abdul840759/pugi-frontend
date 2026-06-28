import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle, Volume2, VolumeX, BookOpen,
  Award, Download, Bookmark, BookmarkCheck, Trophy, XCircle, StickyNote,
  Copy, Check, Play, Terminal, Menu, X, Brain, PlayCircle, Lock,
} from 'lucide-react';
import { courseService } from '@/services/courseService';
import { progressService } from '@/services/progressService';
import { certificateService } from '@/services/certificateService';
import { quizService } from '@/services/quizService';
import { useToast } from '@/hooks/useToast';
import { useAuthContext } from '@/context/AuthContext';
import { UpgradeLimitModal, type UpgradeLimitReason } from '@/components/courses/UpgradeLimitModal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader } from '@/components/ui/Loader';
interface QuizState {
  quiz: any;
  questionIndex: number;
  answers: number[];
  result: any;
  submitting: boolean;
}
// ── Diagram Block (Mermaid) ─────────────────────────────────────────────────
function DiagramBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const id = 'mermaid-' + Math.random().toString(36).slice(2);
    import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs' as any)
      .then((m: any) => {
        m.default.initialize({ startOnLoad: false, theme: 'dark' });
        m.default.render(id, code.trim()).then(({ svg }: any) => {
          if (ref.current) ref.current.innerHTML = svg;
        });
      })
      .catch(() => {
        if (ref.current) ref.current.innerHTML = '<p class="text-red-400 p-4">Failed to render diagram</p>';
      });
  }, [code]);
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-700 shadow-lg max-w-full">
      <div className="flex items-center gap-2 bg-gray-800 px-4 py-2">
        <span className="text-xs text-blue-400 font-semibold">Diagram</span>
      </div>
      <div ref={ref} className="bg-gray-900 p-6 flex justify-center overflow-x-auto" />


    </div>
  );
}
// ── Browser Preview Block ─────────────────────────────────────────────────
function BrowserPreview({ code }: { code: string }) {
  const [expanded, setExpanded] = useState(false);
  const html = code.includes('<html') ? code : `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: system-ui, sans-serif; padding: 16px; margin: 0; }
</style>
</head>
<body>${code}</body>
</html>`;
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-blue-300 dark:border-blue-700 shadow-lg">
      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 px-4 py-2 border-b border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-300 font-semibold ml-2">Browser Preview</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <iframe
        srcDoc={html}
        title="browser-preview"
        sandbox="allow-scripts"
        className={`w-full bg-white transition-all duration-300 ${expanded ? 'h-96' : 'h-48'}`}
      />
    </div>
  );
}
// ── Code Block with Copy + Try It Yourself ──────────────────────────────────
const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';
const LANG_MAP: Record<string, { language: string; version: string }> = {
  js: { language: 'javascript', version: '18.15.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  ts: { language: 'typescript', version: '5.0.3' },
  typescript: { language: 'typescript', version: '5.0.3' },
  py: { language: 'python', version: '3.10.0' },
  python: { language: 'python', version: '3.10.0' },
  sql: { language: 'sqlite3', version: '3.36.0' },
  bash: { language: 'bash', version: '5.2.0' },
  sh: { language: 'bash', version: '5.2.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.50.0' },
  php: { language: 'php', version: '8.0.2' },
  ruby: { language: 'ruby', version: '3.0.1' },
};
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const [tryCode, setTryCode] = useState(code);
  const [output, setOutput] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [running, setRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const normalLang = (lang || 'js').toLowerCase().trim();
  const isJS = normalLang === 'js' || normalLang === 'javascript';
  const pistonLang = LANG_MAP[normalLang];
  const canRun = isJS || !!pistonLang;
  const runWithPiston = async () => {
    if (!pistonLang) return;
    setRunning(true);
    setHasRun(true);
    setOutput(['⏳ Running...']);
    try {
      const res = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: pistonLang.language,
          version: pistonLang.version,
          files: [{ content: tryCode }],
        }),
      });
      const data = await res.json();
      const out = data.run?.output || data.run?.stderr || 'No output';
      setOutput(out.split('\n').filter(Boolean));
    } catch (err: any) {
      setOutput(['❌ Failed to run: ' + err.message]);
    } finally {
      setRunning(false);
    }
  };
  const runWithIframe = () => {
    setRunning(true);
    setHasRun(true);
    setOutput([]);
    const iframe = iframeRef.current;
    if (!iframe) { setRunning(false); return; }
    const logs: string[] = [];
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.source !== 'pugi-runner') return;
      if (e.data.type === 'log')   logs.push(e.data.value);
      if (e.data.type === 'error') logs.push('❌ ' + e.data.value);
      if (e.data.type === 'warn')  logs.push('⚠️ ' + e.data.value);
      if (e.data.type === 'done') {
        window.removeEventListener('message', handleMessage);
        setOutput(logs.length ? [...logs] : ['✅ Code ran successfully (no output)']);
        setRunning(false);
      }
    };
    window.addEventListener('message', handleMessage);
    const safeCode = tryCode.replace(/<\/script>/gi, '<\/script>');
    const html = `<!DOCTYPE html><html><body><script>
const p = window.parent; const src = 'pugi-runner';
console.log = (...a) => p.postMessage({source:src,type:'log',value:a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ')},'*');
console.error = (...a) => p.postMessage({source:src,type:'error',value:a.join(' ')},'*');
console.warn  = (...a) => p.postMessage({source:src,type:'warn',value:a.join(' ')},'*');
try { ${safeCode} } catch(e){ p.postMessage({source:src,type:'error',value:e.message},'*'); }
p.postMessage({source:src,type:'done'},'*');
<\/script></body></html>`;
    iframe.srcdoc = html;
  };
  const runCode = () => {
    if (isJS) runWithIframe();
    else runWithPiston();
  };
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const langLabel = normalLang || 'code';
  return (
    <div data-code-block="true" className="my-6 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-xs text-gray-400 font-mono">{langLabel}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded">
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 text-green-400 p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed max-w-full">
        <code>{code}</code>
      </pre>
      {canRun && (
        <div className="bg-gray-850 border-t border-gray-700">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 border-t border-gray-600">
            <Terminal size={13} className="text-blue-400" />
            <span className="text-xs text-blue-400 font-semibold">Try It Yourself</span>
            <span className="text-xs text-gray-500 ml-1">— edit and run</span>
            {!isJS && <span className="text-xs text-violet-400 ml-auto">runs on Piston ({pistonLang?.language})</span>}
          </div>
          <textarea
            value={tryCode}
            onChange={(e) => setTryCode(e.target.value)}
            rows={Math.min(Math.max(tryCode.split('\n').length, 4), 16)}
            className="w-full bg-gray-900 text-yellow-300 font-mono text-xs sm:text-sm p-3 sm:p-4 outline-none resize-y border-none"
            spellCheck={false}
          />
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-t border-gray-700">
            <button onClick={() => { setTryCode(code); setOutput([]); setHasRun(false); }} className="text-xs text-gray-400 hover:text-white transition-colors">
              Reset
            </button>
            <iframe ref={iframeRef} style={{ display: 'none' }} title="code-runner" sandbox="allow-scripts" />
            <button onClick={runCode} disabled={running} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              <Play size={12} /> {running ? 'Running...' : 'Run Code'}
            </button>
          </div>
          {hasRun && (
            <div className="border-t border-gray-700">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-1.5">
                <span className="text-xs text-gray-400 font-semibold">Output</span>
              </div>
              <div className="bg-black p-4 min-h-[48px] font-mono text-sm">
                {output.length === 0
                  ? <span className="text-gray-500">No output</span>
                  : output.map((line, i) => (
                    <div key={i} className={`mb-1 ${line.startsWith('❌') ? 'text-red-400' : line.startsWith('⚠️') ? 'text-yellow-400' : 'text-green-400'}`}>
                      {line}
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// ── Main Component ───────────────────────────────────────────────────────────
export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, refreshPlan } = useAuthContext();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [marking, setMarking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [nextCourseId, setNextCourseId] = useState<string | null>(null);
  const [nextCourse, setNextCourse] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [lessonSearch, setLessonSearch] = useState('');
  const [noteText, setNoteText] = useState('');
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [aiQuiz, setAiQuiz] = useState<any>(null);
  const [aiQuizLoading, setAiQuizLoading] = useState(false);
  const [aiQuizAnswers, setAiQuizAnswers] = useState<Record<number,number>>({});
  const [aiQuizCount, setAiQuizCount] = useState(5);
  const [aiQuizIndex, setAiQuizIndex] = useState(0);
  const [aiQuizOpen, setAiQuizOpen] = useState(false);
  const [completionQuiz, setCompletionQuiz] = useState<any>(null);
  const [completionQuizOpen, setCompletionQuizOpen] = useState(false);
  const [completionQuizIndex, setCompletionQuizIndex] = useState(0);
  const [completionQuizAnswers, setCompletionQuizAnswers] = useState<Record<number,number>>({});
  const [_completionQuizLoading, setCompletionQuizLoading] = useState(false);
    const [ytVideo, setYtVideo] = useState<any>(null);
  const [ytLoading, setYtLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [upgradeModalReason, setUpgradeModalReason] = useState<UpgradeLimitReason | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const [courseData, progressData] = await Promise.all([
          courseService.getCourseById(id!),
          progressService.getCourseProgress(id!),
        ]);
        setCourse(courseData);
        setCompletedLessons(new Set(progressData.completedLessons || []));
        setProgress(progressData.progress || 0);
        // Check enrollment
        try {
          const enrolledCourses = await courseService.getEnrolledCourses();
          const enrolled = enrolledCourses.some((c: any) => c._id === id);
          setIsEnrolled(enrolled);
        } catch {
          setIsEnrolled(false);
        }
      } catch {
        showToast('Failed to load course', 'error');
        navigate('/learner/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate, showToast]);
  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(`pugi_bookmarks_${id}`);
      setBookmarks(new Set(raw ? JSON.parse(raw) : []));
    } catch { setBookmarks(new Set()); }
  }, [id]);
  const currentModule = course?.modules?.[activeModule];
  const currentLesson = currentModule?.lessons?.[activeLesson];
  const allLessons = course?.modules?.flatMap((m: any) =>
    m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title }))
  ) || [];
  const currentLessonIndex = (course?.modules
    ?.slice(0, activeModule)
    .reduce((acc: number, m: any) => acc + m.lessons.length, 0) || 0) + activeLesson;
  const lessonId = currentLesson?._id || String(currentLessonIndex);
  const isDone = completedLessons.has(lessonId);
  const isBookmarked = bookmarks.has(lessonId);
  useEffect(() => {
    if (!id || !lessonId) return;
    try {
      setNoteText(localStorage.getItem(`pugi_notes_${id}_${lessonId}`) || '');
    } catch { setNoteText(''); }
  }, [id, lessonId]);
  const stopSpeech = useCallback(() => {
    if ((window as any).__pugiTTSStop) {
      (window as any).__pugiTTSStop();
    }
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);
  const goToLesson = (modIdx: number, lesIdx: number) => {
    // Free plan gate: only first lesson of the course is accessible
    const isPro = user?.plan === 'pro';
    const globalIdx = (course?.modules
      ?.slice(0, modIdx)
      .reduce((acc: number, m: any) => acc + m.lessons.length, 0) || 0) + lesIdx;
    if (!isPro && globalIdx > 0) {
      setUpgradeModalReason('FREE_PLAN_LIMIT');
      return;
    }
    stopSpeech();
    setActiveModule(modIdx);
    setActiveLesson(lesIdx);
    setNewBadges([]);
    setMobileNavOpen(false);
  };
  const goNext = () => {
    if (!course) return;
    const isPro = user?.plan === 'pro';
    const mod = course.modules[activeModule];
    const nextModIdx = activeLesson < mod.lessons.length - 1 ? activeModule : activeModule + 1;
    const nextLesIdx = activeLesson < mod.lessons.length - 1 ? activeLesson + 1 : 0;
    const globalIdx = (course?.modules
      ?.slice(0, nextModIdx)
      .reduce((acc: number, m: any) => acc + m.lessons.length, 0) || 0) + nextLesIdx;
    if (!isPro && globalIdx > 0) {
      setUpgradeModalReason('FREE_PLAN_LIMIT');
      return;
    }
    if (activeLesson < mod.lessons.length - 1) goToLesson(activeModule, activeLesson + 1);
    else if (activeModule < course.modules.length - 1) goToLesson(activeModule + 1, 0);
  };
  const goPrev = () => {
    if (activeLesson > 0) goToLesson(activeModule, activeLesson - 1);
    else if (activeModule > 0) {
      const prevMod = course.modules[activeModule - 1];
      goToLesson(activeModule - 1, prevMod.lessons.length - 1);
    }
  };
  const toggleBookmark = () => {
    if (!id || !lessonId) return;
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      localStorage.setItem(`pugi_bookmarks_${id}`, JSON.stringify([...next]));
      return next;
    });
  };
  const saveNote = (text: string) => {
    setNoteText(text);
    if (!id || !lessonId) return;
    localStorage.setItem(`pugi_notes_${id}_${lessonId}`, text);
    // Save meta so JotsPage can show course/lesson titles
    const metaKey = `pugi_meta_${id}_${lessonId}`;
    const existing = localStorage.getItem(metaKey);
    const meta = existing ? JSON.parse(existing) : {};
    localStorage.setItem(metaKey, JSON.stringify({
      ...meta,
      courseTitle: course?.title || 'Unknown Course',
      lessonTitle: currentLesson?.title || 'Unknown Lesson',
      savedAt: new Date().toISOString(),
    }));
  };
  const startQuiz = async (moduleQuiz: any) => {
    try {
      const fullQuiz = await quizService.getQuiz(id!, currentModule._id, moduleQuiz._id);
      setQuizState({ quiz: fullQuiz, questionIndex: 0, answers: [], result: null, submitting: false });
    } catch {
      showToast('Failed to load quiz', 'error');
      goNext();
    }
  };
  const answerQuizQuestion = (optionIndex: number) => {
    if (!quizState) return;
    const answers = [...quizState.answers];
    answers[quizState.questionIndex] = optionIndex;
    setQuizState({ ...quizState, answers });
  };
  const nextQuizQuestion = async () => {
    if (!quizState) return;
    const isLast = quizState.questionIndex === quizState.quiz.questions.length - 1;
    if (!isLast) { setQuizState({ ...quizState, questionIndex: quizState.questionIndex + 1 }); return; }
    setQuizState({ ...quizState, submitting: true });
    try {
      const res = await quizService.submitQuiz(id!, currentModule._id, quizState.quiz.id, quizState.answers);
      setQuizState({ ...quizState, submitting: false, result: res });
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to submit quiz', 'error');
      setQuizState({ ...quizState, submitting: false });
    }
  };
  const closeQuiz = () => { setQuizState(null); goNext(); };
  const fetchPlayCircleVideo = async () => {
    if (!currentLesson) return;
    setYtLoading(true);
    setYtVideo(null);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(currentLesson.title || 'programming tutorial')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await res.json();
      setYtVideo(data);
    } catch {
      showToast('Could not find a video', 'error');
    } finally {
      setYtLoading(false);
    }
  };
  const generateAIQuiz = async () => {
    if (!currentLesson) return;
    setAiQuizLoading(true);
    setAiQuiz(null);
    setAiQuizAnswers({});
    try {
      const result = await quizService.generateAIQuiz(
        currentLesson.title || 'Lesson',
        currentLesson.content || currentLesson.title || 'Programming concepts',
        aiQuizCount
      );
      setAiQuiz(result);
      setAiQuizIndex(0);
      setAiQuizOpen(true);
    } catch {
      showToast('Failed to generate quiz', 'error');
    } finally {
      setAiQuizLoading(false);
    }
  };
  const doMarkComplete = async () => {
    if (!currentLesson || marking) return;
    setMarking(true);
    try {
      const result = await progressService.completeLesson(id!, lessonId);
      setCompletedLessons(prev => new Set([...prev, lessonId]));
      setProgress(result.progress);
      if (result.nextCourseId) {
        setNextCourseId(result.nextCourseId);
        try {
          const nc = await courseService.getCourseById(result.nextCourseId);
          setNextCourse(nc);
        } catch { /* non-critical */ }
      }
      if (result.newBadges?.length > 0) {
        setNewBadges(result.newBadges);
        showToast('Badge earned: ' + result.newBadges.join(', ') + '!', 'success');
      } else {
        showToast('+50 XP! Progress: ' + result.progress + '%', 'success');
      }
      const isLastLessonInModule = activeLesson === currentModule.lessons.length - 1;
      const moduleQuiz = currentModule?.quiz;
      const hasQuiz = moduleQuiz?.questions?.length > 0;
      setTimeout(() => {
        if (isLastLessonInModule && hasQuiz) startQuiz(moduleQuiz);
        else goNext();
      }, 800);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to mark complete', 'error');
    } finally {
      setMarking(false);
    }
  };
  const markComplete = async () => {
    if (!currentLesson || marking) return;
    // After completing lesson 0, free users hit the gate
    const isPro = user?.plan === 'pro';
    if (!isPro && currentLessonIndex === 0) {
      // Let them complete lesson 0 but after completion show upgrade wall
      // doMarkComplete handles the actual save; we just block goNext after
    }
    setCompletionQuizLoading(true);
    setCompletionQuiz(null);
    setCompletionQuizAnswers({});
    setCompletionQuizIndex(0);
    try {
      const result = await quizService.generateAIQuiz(
        currentLesson.title || 'Lesson',
        currentLesson.content || currentLesson.title || 'Programming concepts',
        15
      );
      setCompletionQuiz(result);
      setCompletionQuizOpen(true);
    } catch {
      showToast('Could not generate quiz, marking complete anyway', 'error');
      await doMarkComplete();
    } finally {
      setCompletionQuizLoading(false);
    }
  };
  const togglePause = useCallback(() => {
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [paused]);

  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const toggleReadAloud = () => {
    if (speaking) { stopSpeech(); return; }
    if (!contentRef.current) return;
    window.speechSynthesis.cancel();
    if ((window as any).__pugiTTSTimer) clearTimeout((window as any).__pugiTTSTimer);

    const isInsideCode = (el: Element): boolean => {
      let p = el.parentElement;
      while (p) {
        if (['PRE','CODE'].includes(p.tagName) || p.classList.contains('bg-gray-900')) return true;
        if (p.getAttribute('data-no-read') === 'true') return true;
        p = p.parentElement;
      }
      return false;
    };

    // Build ordered list: text nodes + code block markers
    type Item = { type: 'text'; el: HTMLElement; text: string } | { type: 'code'; el: HTMLElement };
    const items: Item[] = [];
    const nodes = Array.from(contentRef.current.querySelectorAll('p, h1, h2, h3, h4, li, pre'));
    nodes.forEach(node => {
      if (node.tagName === 'PRE') {
        items.push({ type: 'code', el: node as HTMLElement });
      } else if (!isInsideCode(node)) {
        const text = (node.textContent || '').trim();
        if (text.length > 2) items.push({ type: 'text', el: node as HTMLElement, text });
      }
    });

    if (!items.length) return;
    let stopped = false;

    const clearHighlight = () => {
      items.forEach(item => {
        item.el.style.background = '';
        item.el.style.borderRadius = '';
        item.el.style.boxShadow = '';
      });
    };

    const scrollTo = (el: HTMLElement) => {
      if (!mainRef.current) return;
      const rect = el.getBoundingClientRect();
      const mainRect = mainRef.current.getBoundingClientRect();
      mainRef.current.scrollTo({
        top: mainRef.current.scrollTop + rect.top - mainRect.top - 120,
        behavior: 'smooth'
      });
    };

    const speak = (idx: number) => {
      if (stopped || idx >= items.length) {
        clearHighlight();
        setSpeaking(false);
        setPaused(false);
        if (!stopped) {
          showToast('Read aloud complete! Great job studying this lesson.', 'success');
        }
        return;
      }
      const item = items[idx];
      clearHighlight();

      if (item.type === 'code') {
        // Highlight code block
        item.el.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.6)';
        item.el.style.borderRadius = '8px';
        scrollTo(item.el);

        // Announce code block
        const utt = new SpeechSynthesisUtterance(
          "Code block. Let's study this code block carefully. I'll give you 20 seconds."
        );
        utt.rate = 0.88;
        utt.pitch = 1.0;
        utt.onend = () => {
          if (stopped) return;
          // 20 second pause
          (window as any).__pugiTTSTimer = setTimeout(() => {
            if (stopped) return;
            const utt2 = new SpeechSynthesisUtterance("Alright, let's move on.");
            utt2.rate = 0.88;
            utt2.onend = () => { if (!stopped) speak(idx + 1); };
            utt2.onerror = () => { if (!stopped) speak(idx + 1); };
            window.speechSynthesis.speak(utt2);
          }, 20000);
        };
        utt.onerror = () => { if (!stopped) speak(idx + 1); };
        window.speechSynthesis.speak(utt);
        return;
      }

      // Text element
      item.el.style.background = 'rgba(59,130,246,0.15)';
      item.el.style.borderRadius = '6px';
      item.el.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.3)';
      scrollTo(item.el);

      const utt = new SpeechSynthesisUtterance(item.text);
      utt.rate = 0.92;
      utt.pitch = 1.0;
      utt.onend = () => { if (!stopped) speak(idx + 1); };
      utt.onerror = () => { if (!stopped) speak(idx + 1); };
      window.speechSynthesis.speak(utt);
    };

    (window as any).__pugiTTSStop = () => {
      stopped = true;
      window.speechSynthesis.cancel();
      if ((window as any).__pugiTTSTimer) clearTimeout((window as any).__pugiTTSTimer);
      clearHighlight();
    };

    // Detect iOS for premium experience
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Select best available voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v =>
      v.name.includes('Samantha') ||    // iOS premium
      v.name.includes('Karen') ||        // iOS AU
      v.name.includes('Daniel') ||       // iOS UK
      v.name.includes('Google UK') ||    // Android premium
      v.name.includes('Google US')
    ) || voices.find(v => v.lang.startsWith('en')) || null;

    // Haptic feedback for iOS
    const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
      if (isIOS && 'vibrate' in navigator) {
        const patterns = { light: [10], medium: [20], heavy: [30, 10, 30] };
        navigator.vibrate(patterns[style]);
      }
    };
    haptic('medium');

    // Override speak to use premium voice

    const premiumSpeak = (idx: number) => {
      if (premiumVoice) {
        const origSpeechSynth = window.speechSynthesis.speak.bind(window.speechSynthesis);
        window.speechSynthesis.speak = (utt: SpeechSynthesisUtterance) => {
          utt.voice = premiumVoice;
          utt.rate = isIOS ? 0.9 : 0.92;
          utt.pitch = isIOS ? 1.05 : 1.0;
          origSpeechSynth(utt);
        };
      }
      speak(idx);
    };

    setSpeaking(true);
    premiumSpeak(0);
  };

    const issueCertificate = async () => {
    if (!id || issuingCertificate) return;
    setIssuingCertificate(true);
    try {
      const certificate = await certificateService.issueCertificate(id);
      showToast(`Certificate ready: ${certificate.verificationCode}`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Unable to issue certificate', 'error');
    } finally {
      setIssuingCertificate(false);
    }
  };
  // ── Content Renderer ──────────────────────────────────────────────────────
  const renderContent = (rawContent: string) => {
    if (!rawContent) return <p className="text-gray-500 italic">No content yet.</p>;
    const parts = rawContent.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const firstLine = part.split("\n")[0].replace(/```/, "").trim().toLowerCase();
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
        if (firstLine === "mermaid") {
          return <DiagramBlock key={i} code={code} />;
        }
        if (firstLine === "html" || firstLine === "preview") {
          return (
            <div key={i}>
              <CodeBlock code={code} lang={firstLine} />
              <BrowserPreview code={code} />
            </div>
          );
        }
        return <CodeBlock key={i} code={code} lang={firstLine} />;
      }
      // Check for callout blocks
      if (part.includes('__CALLOUT_')) {
        const calloutMatch = part.match(/__CALLOUT_(\w+)__([\s\S]*?)__ENDCALLOUT__/);
        if (calloutMatch) {
          const type = calloutMatch[1].toLowerCase();
          const body = calloutMatch[2].trim();
          const styles: Record<string, { bg: string; border: string; icon: string; label: string }> = {
            tip:     { bg: 'bg-green-50 dark:bg-green-900/20',  border: 'border-green-400', icon: '💡', label: 'Tip' },
            warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-400', icon: '⚠️', label: 'Warning' },
            note:    { bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-400',   icon: '📝', label: 'Note' },
            example: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-400', icon: '📌', label: 'Example' },
            danger:  { bg: 'bg-red-50 dark:bg-red-900/20',      border: 'border-red-400',    icon: '🚫', label: 'Danger' },
          };
          const s = styles[type] || styles.note;
          return (
            <div key={i} className={`my-4 rounded-xl border-l-4 ${s.border} ${s.bg} p-4`}>
              <p className="font-semibold text-sm mb-1">{s.icon} {s.label}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{body}</p>
            </div>
          );
        }
      }
      return (
        <div key={i}>
          {part.split("\n").map((line, j) => {
            if (line.startsWith("# "))   return <h1 key={j} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">{line.slice(2)}</h1>;
            if (line.startsWith("## "))  return <h2 key={j} className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-5 mb-2">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={j} className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("- "))   return <li key={j} className="text-gray-700 dark:text-gray-300 ml-4 list-disc">{line.slice(2)}</li>;
            if (line.trim() === "")      return <br key={j} />;
            return <p key={j} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{line}</p>;
          })}
        </div>
      );
    });
  };
  if (loading || isEnrolled === null) return <div className="flex justify-center items-center h-64"><Loader /></div>;
  if (!course) return <div className="p-6 text-gray-500">Course not found.</div>;

  // Gate: not enrolled
  if (!isEnrolled) {
    const isPro = user?.plan === 'pro';
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500">
          <Lock size={36} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {isPro
              ? 'You are not enrolled in this course yet. Go back and enroll to access the content.'
              : 'You need to enroll in this course to access its content. Free plan users can enroll in 1 course.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/learner/courses')}
            className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Browse Courses
          </button>
          {!isPro && (
            <button
              onClick={() => setUpgradeModalReason('FREE_PLAN_LIMIT')}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
        <UpgradeLimitModal
          isOpen={!!upgradeModalReason}
          reason={upgradeModalReason}
          onClose={() => setUpgradeModalReason(null)}
          onUpgraded={() => { void refreshPlan(); navigate('/learner/courses'); }}
        />
      </div>
    );
  }
  return (
    <div className="relative flex h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile drawer backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-transform duration-300
          lg:static lg:translate-x-0
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{course.title}</h2>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden flex-shrink-0 rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close lessons"
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span><span>{progress}%</span>
            </div>
            <ProgressBar value={progress} max={100} />
          </div>
        </div>
        {/* Lesson Search */}
        <div className="px-3 pb-2 pt-1 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={lessonSearch}
              onChange={e => setLessonSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {course.modules.map((mod: any, modIdx: number) => {
            const filteredLessons = mod.lessons.filter((l: any) =>
              !lessonSearch || l.title.toLowerCase().includes(lessonSearch.toLowerCase())
            );
            if (lessonSearch && filteredLessons.length === 0) return null;
            return (
            <div key={modIdx} className="mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 py-1">
                {mod.title}
              </p>
              {mod.lessons.map((lesson: any, lesIdx: number) => {
                const lId = lesson._id || String(lesIdx);
                const done = completedLessons.has(lId);
                const active = activeModule === modIdx && activeLesson === lesIdx;
                const bookmarked = bookmarks.has(lId);
                return (
                  <button
                    key={lesIdx}
                    onClick={() => goToLesson(modIdx, lesIdx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors mb-0.5
                      ${active
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {done
                      ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      : <Circle size={14} className="text-gray-300 flex-shrink-0" />
                    }
                    <span className="truncate flex-1">{lesson.title}</span>
                    {bookmarked && <BookmarkCheck size={13} className="text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          );
          })}
        </div>
      </aside>
      {/* Main content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div ref={contentRef} className="max-w-3xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Show lessons"
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentModule?.title}</p>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{currentLesson?.title}</h1>
                  {course?.level && (
                    <span className={{
                      beginner: 'text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 shrink-0',
                      intermediate: 'text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 shrink-0',
                      advanced: 'text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 shrink-0',
                    }[course.level as string] || 'text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0'}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors
                  ${isBookmarked
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
              >
                {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
              <button
                onClick={toggleReadAloud}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors
                  ${speaking
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
              >
                {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className="hidden sm:inline">{speaking ? 'Stop' : 'Read Aloud'}</span>
              </button>
            </div>
          </div>
          {/* Badge earned */}
          {newBadges.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Trophy className="text-yellow-500" size={24} />
              <div>
                <p className="font-semibold text-yellow-800 dark:text-yellow-300">Badge Earned!</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">{newBadges.join(', ')}</p>
              </div>
            </div>
          )}
          {/* Lesson content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
            {progress === 100 && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                {nextCourseId && nextCourse ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="text-yellow-500" size={24} />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">Course complete! Next level unlocked</p>
                        <p className="text-sm text-green-700 dark:text-green-400">{nextCourse.title} · {nextCourse.level}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/learner/courses/${nextCourseId}`)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Start Next Course →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="text-green-600" size={24} />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">Course complete</p>
                        <p className="text-sm text-green-700 dark:text-green-400">Generate your verified PUGI certificate.</p>
                      </div>
                    </div>
                    <button
                      onClick={issueCertificate}
                      disabled={issuingCertificate}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <Award size={16} /> {issuingCertificate ? 'Generating...' : 'Generate Certificate'}
                    </button>
                  </div>
                )}
              </div>
            )}
            {currentLesson?.content ? renderContent(currentLesson.content) : (
              <div className="text-center py-12 text-gray-400">
                <BookOpen size={40} className="mx-auto mb-3" />
                <p>Lesson content coming soon.</p>
              </div>
            )}
          </div>
          {/* Code Example section */}
          {currentLesson?.codeExample && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Terminal size={16} className="text-blue-500" /> Code Example
              </h3>
              <CodeBlock code={currentLesson.codeExample} lang="js" />
            </div>
          )}
          {/* Video */}
          {currentLesson?.videoUrl && (
            <div className="mb-6 overflow-hidden rounded-xl bg-black">
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {/* YouTube Video Suggestion */}
          <div data-no-read="true" className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle size={16} className="text-red-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Prefer watching?</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Get a YouTube video for this lesson.</span>
              </div>
              <button
                onClick={fetchPlayCircleVideo}
                disabled={ytLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                <PlayCircle size={12} />
                {ytLoading ? 'Searching...' : 'Get Video'}
              </button>
            </div>
            {ytVideo?.videoId && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{ytVideo.title} · {ytVideo.channel}</p>
                  <button onClick={() => setYtVideo(null)} className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl bg-black aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytVideo.videoId}?autoplay=1`}
                    title={ytVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
          {/* AI Quiz Generator */}
          <div data-no-read="true" className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Brain size={16} className="text-purple-500" /> AI Quiz
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Questions:</label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={aiQuizCount}
                    onChange={e => setAiQuizCount(Math.max(5, Math.min(20, Number(e.target.value))))}
                    className="w-14 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent px-2 py-1 text-xs text-center text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={generateAIQuiz}
                  disabled={aiQuizLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {aiQuizLoading ? 'Generating...' : 'Generate Quiz'}
                </button>
              </div>
            </div>
            {!aiQuiz && !aiQuizLoading && (
              <p className="text-sm text-gray-400">Click generate to get AI-powered questions based on this lesson.</p>
            )}
            {aiQuizLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-4 justify-center">
                <Loader /> Generating questions...
              </div>
            )}
            {aiQuiz && !aiQuizLoading && (
              <button
                onClick={() => { setAiQuizIndex(0); setAiQuizAnswers({}); setAiQuizOpen(true); }}
                className="text-xs text-purple-500 hover:underline"
              >
                Retake quiz ({aiQuiz.questions.length} questions)
              </button>
            )}
          </div>
          {/* Completion Quiz Modal */}
          {completionQuizOpen && completionQuiz?.questions && (() => {
            const questions = completionQuiz.questions;
            const total = questions.length;
            const isDone = completionQuizIndex >= total;
            const passed = Object.values(completionQuizAnswers).filter((ans, qi) => ans === questions[qi]?.correctOptionIndex).length;
            const score = isDone ? Math.round((passed / total) * 100) : 0;
            const passingScore = 70;
            const didPass = score >= passingScore;
            const q = !isDone ? questions[completionQuizIndex] : null;
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                  {!isDone ? (
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-500">Lesson Quiz · {completionQuizIndex + 1} of {total}</span>
                        <span className="text-xs text-gray-400">Pass {passingScore}% to complete</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{width: `${(completionQuizIndex / total) * 100}%`}} />
                      </div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mb-4">{q.prompt}</p>
                      <div className="space-y-2">
                        {q.options.map((opt: string, oi: number) => {
                          const answered = completionQuizAnswers[completionQuizIndex] !== undefined;
                          const isSelected = completionQuizAnswers[completionQuizIndex] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => {
                                if (answered) return;
                                setCompletionQuizAnswers(a => ({...a, [completionQuizIndex]: oi}));
                                setTimeout(() => setCompletionQuizIndex(i => i + 1), 900);
                              }}
                              className={`w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all
                                ${!answered ? 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : isSelected ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-200 dark:border-gray-700 opacity-40'}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold
                        ${didPass ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                        {score}%
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {didPass ? 'Lesson Complete!' : 'Not quite there yet'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        You got <span className="font-semibold text-gray-900 dark:text-white">{passed}</span> out of <span className="font-semibold text-gray-900 dark:text-white">{total}</span> correct
                      </p>
                      {!didPass && (
                        <p className="text-sm text-red-500 mb-4">
                          You need <span className="font-bold">{passingScore}%</span> to pass. You scored <span className="font-bold">{score}%</span> — just {passingScore - score}% more needed.
                        </p>
                      )}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Score</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{score}%</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Correct</p>
                          <p className="text-lg font-bold text-green-600">{passed}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Wrong</p>
                          <p className="text-lg font-bold text-red-500">{total - passed}</p>
                        </div>
                      </div>
                      {didPass ? (
                        <button
                          onClick={() => { setCompletionQuizOpen(false); doMarkComplete(); }}
                          className="w-full rounded-xl bg-green-600 py-3 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Continue to next lesson
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setCompletionQuizIndex(0); setCompletionQuizAnswers({}); }}
                            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Try Again
                          </button>
                          <button
                            onClick={async () => {
                              setCompletionQuizOpen(false);
                              // Unmark lesson as complete
                              try {
                                const result = await progressService.uncompleteLesson(id!, lessonId);
                                setCompletedLessons(new Set());
                                setProgress(result.progress ?? 0);
                              } catch {
                                showToast('Failed to reset progress', 'error');
                              }
                              goToLesson(0, 0);
                            }}
                            className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600"
                          >
                            Restart Module 1
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          {/* AI Quiz Modal */}
          {aiQuizOpen && aiQuiz?.questions && (() => {
            const questions = aiQuiz.questions;
            const total = questions.length;
            const isDone = aiQuizIndex >= total;
            const passed = Object.values(aiQuizAnswers).filter((ans, qi) => ans === questions[qi]?.correctOptionIndex).length;
            const score = isDone ? Math.round((passed / total) * 100) : 0;
            const q = !isDone ? questions[aiQuizIndex] : null;
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                  {!isDone ? (
                    <>
                      <div className="px-6 pt-6 pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-purple-500">Question {aiQuizIndex + 1} of {total}</span>
                          <button onClick={() => setAiQuizOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{width: `${((aiQuizIndex) / total) * 100}%`}} />
                        </div>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mb-4">{q.prompt}</p>
                        <div className="space-y-2">
                          {q.options.map((opt: string, oi: number) => {
                            const answered = aiQuizAnswers[aiQuizIndex] !== undefined;
                            const isSelected = aiQuizAnswers[aiQuizIndex] === oi;
                            const isCorrect = oi === q.correctOptionIndex;
                            return (
                              <button
                                key={oi}
                                onClick={() => {
                                  if (answered) return;
                                  setAiQuizAnswers(a => ({...a, [aiQuizIndex]: oi}));
                                  setTimeout(() => setAiQuizIndex(i => i + 1), 900);
                                }}
                                className={`w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all
                                  ${!answered ? 'border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                  : isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                  : isSelected ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                  : 'border-gray-200 dark:border-gray-700 opacity-40'}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {aiQuizAnswers[aiQuizIndex] !== undefined && q.explanation && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">{q.explanation}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold
                        ${score >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                        {score}%
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {score >= 70 ? 'Great job!' : 'Keep practicing!'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        You got <span className="font-semibold text-gray-900 dark:text-white">{passed}</span> out of <span className="font-semibold text-gray-900 dark:text-white">{total}</span> correct
                      </p>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Score</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{score}%</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Correct</p>
                          <p className="text-lg font-bold text-green-600">{passed}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Wrong</p>
                          <p className="text-lg font-bold text-red-500">{total - passed}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setAiQuizIndex(0); setAiQuizAnswers({}); }}
                          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Retry
                        </button>
                        <button
                          onClick={() => setAiQuizOpen(false)}
                          className="flex-1 rounded-xl bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          {/* Downloads */}
          {currentLesson?.downloads?.length > 0 && (
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Downloads</h3>
              <div data-no-read="true" className="space-y-2">
                {currentLesson.downloads.map((download: any) => (
                  
                    <a
                    key={download.url}
                    href={download.url}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    download
                  >
                    <Download size={16} /> {download.title || download.url}
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* Notes - excluded from read aloud */}
          <div data-no-read="true" className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
              <StickyNote size={16} /> My Notes
            </h3>
            <textarea
              value={noteText}
              onChange={e => saveNote(e.target.value)}
              placeholder="Jot down anything you want to remember about this lesson..."
              rows={4}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                         text-sm text-gray-900 dark:text-white p-3 resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Saved automatically on this device.</p>
          </div>
          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={goPrev}
              disabled={currentLessonIndex === 0}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={markComplete}
              disabled={isDone || marking}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-colors
                ${isDone
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 cursor-default'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                }`}
            >
              <CheckCircle size={16} />
              {isDone ? 'Completed' : marking ? 'Saving...' : 'Mark Complete'}
            </button>
            <button
              onClick={goNext}
              disabled={currentLessonIndex === allLessons.length - 1}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
            </button>
          </div>
        </div>
      {/* Floating Read Aloud Button */}
      {speaking && (
        <>
          {/* Desktop/tablet — top center pill */}
          <div className="hidden sm:flex fixed top-4 left-1/2 -translate-x-1/2 z-[200] items-center gap-3 bg-blue-600/90 backdrop-blur-md text-white pl-4 pr-2 py-2 rounded-full shadow-2xl border border-blue-400/50 ring-1 ring-white/20">
            <Volume2 size={15} className={paused ? 'opacity-50' : 'animate-pulse'} />
            <span className="text-sm font-medium">{paused ? 'Paused' : 'Reading aloud...'}</span>
            <button onClick={togglePause}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors text-base">
              {paused ? '▶' : '⏸'}
            </button>
            <button onClick={stopSpeech}
              className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors">
              <VolumeX size={14} />
            </button>
          </div>

          {/* Mobile — right side stack (premium iOS glass effect) */}
          <div className="sm:hidden fixed right-3 top-1/2 -translate-y-1/2 z-[200] flex flex-col items-center gap-2">
            {/* Status badge */}
            <div className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-blue-400/50 ring-1 ring-white/20">
              {paused ? 'Paused' : 'Reading'}
            </div>
            {/* Pause/Resume button */}
            <button onClick={togglePause}
              className="bg-blue-600/90 backdrop-blur-md text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl border-2 border-white/30 ring-1 ring-blue-400/30 text-2xl active:scale-95 transition-transform">
              {paused ? '▶' : '⏸'}
            </button>
            {/* Stop button */}
            <button onClick={stopSpeech}
              className="bg-slate-700/80 backdrop-blur-md text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg border border-white/20 active:scale-95 transition-transform">
              <VolumeX size={16} />
            </button>
          </div>
        </>
      )}
      </main>
      {/* Upgrade modal for lesson gate */}
      <UpgradeLimitModal
        isOpen={!!upgradeModalReason}
        reason={upgradeModalReason}
        onClose={() => setUpgradeModalReason(null)}
        onUpgraded={() => { void refreshPlan(); }}
      />
      {/* Quiz modal */}
      {quizState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6">
            {!quizState.result ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">{quizState.quiz.title || 'Module Quiz'}</h2>
                  <span className="text-xs text-gray-500">
                    Question {quizState.questionIndex + 1} of {quizState.quiz.questions.length}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-4">
                  {quizState.quiz.questions[quizState.questionIndex].prompt}
                </p>
                <div className="space-y-2 mb-6">
                  {quizState.quiz.questions[quizState.questionIndex].options.map((opt: string, idx: number) => {
                    const selected = quizState.answers[quizState.questionIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => answerQuizQuestion(idx)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors
                          ${selected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={nextQuizQuestion}
                  disabled={quizState.answers[quizState.questionIndex] === undefined || quizState.submitting}
                  className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
                >
                  {quizState.submitting ? 'Submitting...'
                    : quizState.questionIndex === quizState.quiz.questions.length - 1
                    ? 'Submit Quiz' : 'Next Question'}
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                {quizState.result.passed
                  ? <Trophy size={48} className="mx-auto text-yellow-500 mb-3" />
                  : <XCircle size={48} className="mx-auto text-red-400 mb-3" />
                }
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {quizState.result.passed ? 'Quiz Passed!' : 'Not Quite There'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Score: {quizState.result.score}%
                  {quizState.result.passed && quizState.result.xp != null ? ' · +100 XP' : ''}
                </p>
                {!quizState.result.passed && (
                  <p className="text-sm text-gray-400 mb-4">
                    You need {quizState.quiz.passingScore || 70}% to pass. You can retry this quiz later.
                  </p>
                )}
                <button
                  onClick={closeQuiz}
                  className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
