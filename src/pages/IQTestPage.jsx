import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Hourglass,
  RotateCcw,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import SEO from '../components/SEO';
import chapterIndex from '../data/iqBook/chapters.json';

const LETTERS = ['A', 'B', 'C', 'D'];
const chapterModules = import.meta.glob('../data/iqBook/ch-*.json');
const RESULT_KEY = 'iq-test-result-v1';

const CHAPTER_META = {
  'ch-01': { accent: 'amber', blurb: 'Word relationships and verbal analogies.', slug: 'analogy-type-1' },
  'ch-02': { accent: 'orange', blurb: 'Paired analogies across purpose, cause, class, and more.', slug: 'analogy-type-2' },
  'ch-03': { accent: 'rose', blurb: 'Find what is common across a set of terms.', slug: 'analogy-type-3' },
  'ch-04': { accent: 'sky', blurb: 'Number and letter series completion.', slug: 'series-test' },
  'ch-05': { accent: 'teal', blurb: 'Unscramble letters into meaningful words.', slug: 'jumbled-spelling' },
  'ch-06': { accent: 'emerald', blurb: 'Letter and word coding patterns.', slug: 'coding-decoding' },
  'ch-07': { accent: 'violet', blurb: 'Letter positions, order, and alphabet reasoning.', slug: 'alphabetical-test' },
};

const ACCENT = {
  amber:   { badge: 'bg-amber-50 text-amber-800 border-amber-200', bar: 'from-amber-400 to-amber-600', soft: 'bg-amber-50/70', edge: 'border-l-amber-500', num: 'text-amber-700' },
  orange:  { badge: 'bg-orange-50 text-orange-800 border-orange-200', bar: 'from-orange-400 to-orange-600', soft: 'bg-orange-50/70', edge: 'border-l-orange-500', num: 'text-orange-700' },
  rose:    { badge: 'bg-rose-50 text-rose-800 border-rose-200', bar: 'from-rose-400 to-rose-600', soft: 'bg-rose-50/70', edge: 'border-l-rose-500', num: 'text-rose-700' },
  sky:     { badge: 'bg-sky-50 text-sky-800 border-sky-200', bar: 'from-sky-400 to-sky-600', soft: 'bg-sky-50/70', edge: 'border-l-sky-500', num: 'text-sky-700' },
  teal:    { badge: 'bg-teal-50 text-teal-800 border-teal-200', bar: 'from-teal-400 to-teal-600', soft: 'bg-teal-50/70', edge: 'border-l-teal-500', num: 'text-teal-700' },
  emerald: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', bar: 'from-emerald-400 to-emerald-600', soft: 'bg-emerald-50/70', edge: 'border-l-emerald-500', num: 'text-emerald-700' },
  violet:  { badge: 'bg-violet-50 text-violet-800 border-violet-200', bar: 'from-violet-400 to-violet-600', soft: 'bg-violet-50/70', edge: 'border-l-violet-500', num: 'text-violet-700' },
  gray:    { badge: 'bg-gray-50 text-gray-700 border-gray-200', bar: 'from-gray-300 to-gray-500', soft: 'bg-gray-50', edge: 'border-l-gray-400', num: 'text-gray-600' },
};

function durationForCount(count) {
  return Math.min(40 * 60, Math.max(5 * 60, count * 45));
}

function formatTime(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function formatDurationLabel(sec) {
  const m = Math.round(sec / 60);
  return m === 1 ? '1 min' : `${m} min`;
}

function slugFor(ch) {
  return ch.slug || CHAPTER_META[ch.id]?.slug || ch.id;
}

function blurbFor(ch) {
  return ch.blurb || CHAPTER_META[ch.id]?.blurb || 'Practice set.';
}

function accentFor(ch) {
  return ch.accent || CHAPTER_META[ch.id]?.accent || 'amber';
}

function performanceMessage(pct) {
  if (pct >= 90) return { title: 'Outstanding', body: 'Excellent accuracy under pressure.' };
  if (pct >= 75) return { title: 'Strong result', body: 'Solid reasoning — keep pushing for mastery.' };
  if (pct >= 55) return { title: 'Good effort', body: 'A fair score. Review misses and retry.' };
  if (pct >= 35) return { title: 'Keep practicing', body: 'Focus on patterns and timing next round.' };
  return { title: 'Fresh start', body: 'Study the review board, then attempt again.' };
}

function ScoreRing({ value }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  const tone = value >= 75 ? '#059669' : value >= 55 ? '#d97706' : '#dc2626';
  return (
    <motion.div
      className="relative w-36 h-36"
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">{value}%</span>
      </div>
    </motion.div>
  );
}

function TheoryPanel({ theory, accent }) {
  if (!theory || (!theory.intro && !theory.sections?.length)) return null;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-500">Theory</h2>
        <span className={`h-px flex-1 bg-gradient-to-r ${accent.bar} opacity-40`} />
      </div>
      {theory.intro && (
        <p className="text-[15px] text-gray-700 leading-relaxed">{theory.intro}</p>
      )}
      {theory.sections?.map((sec) => (
        <div key={sec.title} className={`rounded-xl border border-gray-200 ${accent.soft} p-4 sm:p-5 space-y-3`}>
          <h3 className="text-sm font-bold text-gray-900">{sec.title}</h3>
          {sec.paragraphs?.map((para) => (
            <p key={para.slice(0, 48)} className="text-sm text-gray-600 leading-relaxed">{para}</p>
          ))}
          {sec.examples?.map((ex) => (
            <div key={ex.stem} className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">{ex.stem}</p>
              {ex.options?.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-gray-600">
                  {ex.options.map((opt, i) => (
                    <li
                      key={opt}
                      className={ex.answer === LETTERS[i] ? 'font-semibold text-emerald-700' : ''}
                    >
                      {LETTERS[i]}. {opt}
                      {ex.answer === LETTERS[i] ? ' ✓' : ''}
                    </li>
                  ))}
                </ul>
              )}
              {ex.hint && (
                <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-2">
                  <span className="font-semibold text-gray-700">Hint: </span>{ex.hint}
                </p>
              )}
              {ex.explanation && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Explanation: </span>{ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function QuestionPalette({ questions, answers, index, onJump, cols = 5 }) {
  return (
    <div
      className="grid gap-2 p-0.5"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {questions.map((q, i) => {
        const chosen = answers[q.id];
        const isCurrent = i === index;
        const isCorrect = chosen && chosen === q.answer;
        const isWrong = chosen && chosen !== q.answer;

        let cls = 'bg-white border-gray-200 text-gray-600 hover:border-gray-800';
        if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-900';
        if (isWrong) cls = 'bg-red-50 border-red-500 text-red-900';
        if (isCurrent) {
          cls = [
            isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
              : isWrong ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-white border-gray-900 text-gray-900',
            'ring-2 ring-amber-400 ring-offset-1',
          ].join(' ');
        }

        return (
          <button
            key={q.id}
            type="button"
            onPointerUp={() => onJump(i)}
            aria-current={isCurrent ? 'true' : undefined}
            title={`Question ${i + 1}${chosen ? ` · ${chosen}` : ' · unanswered'}`}
            className={`relative h-10 w-full rounded-lg border text-sm font-bold tabular-nums transition-colors ${cls}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function ExamTimer({ remainingSec, durationSec, urgent, critical }) {
  const pct = durationSec ? Math.max(0, Math.min(100, (remainingSec / durationSec) * 100)) : 0;
  return (
    <div
      className={[
        'rounded-xl border px-4 py-2.5 min-w-[10rem] sm:min-w-[13rem]',
        critical
          ? 'border-red-500 bg-red-50'
          : urgent
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-900 bg-gray-900 text-white',
      ].join(' ')}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${critical || urgent ? 'opacity-70' : 'text-gray-400'}`}>
          Time left
        </span>
        <Timer size={14} className={critical ? 'text-red-600' : urgent ? 'text-amber-700' : 'text-amber-400'} />
      </div>
      <p className={[
        'text-3xl sm:text-[2.35rem] font-black tabular-nums leading-none tracking-tight',
        critical ? 'text-red-700 animate-pulse' : urgent ? 'text-amber-900' : 'text-white',
      ].join(' ')}>
        {formatTime(remainingSec)}
      </p>
      <div className={`mt-2 h-1 rounded-full overflow-hidden ${critical || urgent ? 'bg-black/10' : 'bg-white/20'}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            critical ? 'bg-red-600' : urgent ? 'bg-amber-500' : 'bg-amber-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function IQTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const phase = useMemo(() => {
    if (location.pathname.endsWith('/take')) return 'take';
    if (location.pathname.endsWith('/results')) return 'results';
    if (slug) return 'briefing';
    return 'hub';
  }, [location.pathname, slug]);

  const practiceChapters = useMemo(
    () => (chapterIndex.chapters || []).filter((c) => !c.keysOnly && c.questionCount > 0),
    [],
  );

  const totalHubQuestions = useMemo(
    () => practiceChapters.reduce((s, c) => s + c.questionCount, 0),
    [practiceChapters],
  );

  const chapterMeta = useMemo(() => {
    if (!slug) return null;
    return practiceChapters.find((c) => slugFor(c) === slug) || null;
  }, [slug, practiceChapters]);

  const [questions, setQuestions] = useState([]);
  const [chapterTheory, setChapterTheory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [durationSec, setDurationSec] = useState(0);
  const [remainingSec, setRemainingSec] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [resultBundle, setResultBundle] = useState(null);
  const endAtRef = useRef(null);
  const answersRef = useRef({});

  const total = questions.length;
  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const progress = total ? (answeredCount / total) * 100 : 0;
  const accentKey = accentFor(chapterMeta || {});
  const accent = ACCENT[accentKey];

  // Load chapter questions when slug is present
  useEffect(() => {
    if (!chapterMeta) {
      setQuestions([]);
      setChapterTheory(null);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const key = Object.keys(chapterModules).find((k) => k.endsWith(`/${chapterMeta.file}`));
        if (!key) throw new Error('Chapter file missing.');
        const mod = await chapterModules[key]();
        const payload = mod.default || mod;
        const list = (payload.questions || []).map((q) => ({
          ...q,
          category: chapterMeta.title,
        }));
        if (!list.length) throw new Error('No questions in this chapter yet.');
        if (cancelled) return;
        const dur = durationForCount(list.length);
        setQuestions(list);
        setChapterTheory(payload.theory || null);
        setDurationSec(dur);
        if (phase === 'briefing') {
          setRemainingSec(dur);
          setIndex(0);
          setSelected(null);
          setAnswers({});
          answersRef.current = {};
          setTimedOut(false);
          endAtRef.current = null;
        }
      } catch (err) {
        if (!cancelled) setLoadError(err?.message || 'Failed to load chapter');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [chapterMeta?.id, chapterMeta?.file, chapterMeta?.title, phase]);

  // Restore results page payload
  useEffect(() => {
    if (phase !== 'results' || !slug) return;
    try {
      const raw = sessionStorage.getItem(RESULT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.slug !== slug) return;
      setResultBundle(data);
      setQuestions(data.questions || []);
      setAnswers(data.answers || {});
      answersRef.current = data.answers || {};
      setDurationSec(data.durationSec || 0);
      setRemainingSec(data.remainingSec || 0);
      setTimedOut(Boolean(data.timedOut));
    } catch {
      /* ignore */
    }
  }, [phase, slug]);

  const persistAndGoResults = useCallback((fromTimeout, finalAnswers, rem) => {
    const payload = {
      slug,
      chapterId: chapterMeta?.id,
      title: chapterMeta?.title,
      questions,
      answers: finalAnswers,
      durationSec,
      remainingSec: rem,
      timedOut: fromTimeout,
      finishedAt: Date.now(),
    };
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(payload));
    setResultBundle(payload);
    endAtRef.current = null;
    navigate(`/iq-test/${slug}/results`, { replace: true });
  }, [slug, chapterMeta, questions, durationSec, navigate]);

  const finishTest = useCallback((fromTimeout = false) => {
    const rem = fromTimeout ? 0 : Math.max(0, endAtRef.current ? Math.ceil((endAtRef.current - Date.now()) / 1000) : remainingSec);
    persistAndGoResults(fromTimeout, answersRef.current, rem);
  }, [persistAndGoResults, remainingSec]);

  // Fresh attempt whenever we enter /take for a chapter with loaded data
  useEffect(() => {
    if (phase !== 'take' || !durationSec || !questions.length) return;
    setIndex(0);
    setSelected(null);
    setAnswers({});
    answersRef.current = {};
    setTimedOut(false);
    endAtRef.current = Date.now() + durationSec * 1000;
    setRemainingSec(durationSec);
  }, [phase, slug, durationSec, questions.length]);

  // Timer only on take
  useEffect(() => {
    if (phase !== 'take' || !endAtRef.current) return undefined;
    const tick = () => {
      if (!endAtRef.current) return;
      const left = Math.ceil((endAtRef.current - Date.now()) / 1000);
      if (left <= 0) {
        setRemainingSec(0);
        setTimedOut(true);
        persistAndGoResults(true, answersRef.current, 0);
        return;
      }
      setRemainingSec(left);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase, slug, durationSec, questions.length, persistAndGoResults]);

  const goTo = (i) => {
    if (i < 0 || i >= total) return;
    setIndex(i);
    setSelected(answers[questions[i].id] ?? null);
  };

  const pick = (letter) => {
    if (!current || phase !== 'take') return;
    if (answers[current.id]) return;
    setSelected(letter);
    setAnswers((prev) => {
      const next = { ...prev, [current.id]: letter };
      answersRef.current = next;
      return next;
    });
  };

  const usedSec = durationSec ? Math.max(0, durationSec - remainingSec) : 0;
  const timerUrgent = remainingSec > 0 && remainingSec <= 60;
  const timerCritical = remainingSec > 0 && remainingSec <= 30;

  const resultAnswers = resultBundle?.answers || answers;
  const resultQuestions = resultBundle?.questions || questions;
  const resultScore = resultQuestions.reduce((s, q) => s + (resultAnswers[q.id] === q.answer ? 1 : 0), 0);
  const resultWrong = resultQuestions.reduce((s, q) => {
    const chosen = resultAnswers[q.id];
    return s + (chosen && chosen !== q.answer ? 1 : 0);
  }, 0);
  const resultBlank = resultQuestions.reduce((s, q) => s + (resultAnswers[q.id] ? 0 : 1), 0);
  const resultTotal = resultQuestions.length;
  const resultAccuracy = resultTotal ? Math.round((resultScore / resultTotal) * 100) : 0;
  const vibe = performanceMessage(resultAccuracy);
  const resultUsed = (resultBundle?.durationSec || durationSec) - (resultBundle?.remainingSec ?? remainingSec);

  if (slug && !chapterMeta && !loading) {
    return <Navigate to="/iq-test" replace />;
  }

  const optionClass = (letter) => {
    if (!selected) return 'border-gray-200 bg-white hover:border-gray-900 hover:bg-gray-50';
    if (letter === current.answer) return 'border-emerald-500 bg-emerald-50 text-emerald-950';
    if (letter === selected) return 'border-red-500 bg-red-50 text-red-950';
    return 'border-gray-100 bg-gray-50/70 text-gray-400';
  };

  /* ───────────── HUB ───────────── */
  if (phase === 'hub') {
    return (
      <div className="bg-canvas min-h-screen">
        <SEO title="IQ Practice Tests" description="Timed intelligence practice by chapter." url="/iq-test" />
        <div className="relative overflow-hidden border-b border-gray-200/80 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,_rgba(245,158,11,0.14),_transparent_55%),radial-gradient(ellipse_50%_40%_at_0%_100%,_rgba(14,165,233,0.08),_transparent_50%)] pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-16 md:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl"
            >
              <h1
                className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                IQ Practice
              </h1>
              <p className="mt-3 text-gray-600 text-lg leading-relaxed">
                Timed chapter attempts with a live question map and locked answers.
              </p>
              <p className="mt-4 text-sm text-gray-500 tabular-nums">
                {practiceChapters.length} chapters · {totalHubQuestions} questions
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {loadError && (
            <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{loadError}</p>
          )}
          <div className="space-y-3">
            {practiceChapters.map((ch, i) => {
              const tone = ACCENT[accentFor(ch)] || ACCENT.amber;
              const dur = durationForCount(ch.questionCount);
              const s = slugFor(ch);
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.045 }}
                >
                  <Link
                    to={`/iq-test/${s}`}
                    className="group flex items-stretch gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card hover:border-gray-300 hover:shadow-lift transition-all"
                  >
                    <div className={`w-1.5 shrink-0 bg-gradient-to-b ${tone.bar}`} />
                    <div className="flex-1 min-w-0 flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5">
                      <span className={`text-2xl sm:text-3xl font-bold tabular-nums tracking-tight ${tone.num}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug group-hover:text-gray-700">
                          {ch.title}
                        </h2>
                        <p className="mt-0.5 text-sm text-gray-500 leading-relaxed line-clamp-1 sm:line-clamp-2">
                          {blurbFor(ch)}
                        </p>
                        <p className="mt-2 text-xs text-gray-400 tabular-nums">
                          {ch.questionCount} questions · {formatDurationLabel(dur)}
                        </p>
                      </div>
                      <span className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ───────────── BRIEFING ───────────── */
  if (phase === 'briefing') {
    const qCount = total || chapterMeta?.questionCount || 0;
    const dur = durationSec || durationForCount(qCount);
    const pace = Math.round(dur / Math.max(qCount, 1));

    return (
      <div className="relative min-h-screen bg-canvas overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_0%,_rgba(245,158,11,0.1),_transparent_50%),radial-gradient(ellipse_50%_40%_at_90%_20%,_rgba(14,165,233,0.08),_transparent_45%)]" />
        <SEO title={`${chapterMeta?.title || 'Chapter'} · IQ Test`} description="Briefing and timed rules for this chapter." url={`/iq-test/${slug}`} />

        <div className="relative border-b border-gray-200/80 bg-white/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <Link to="/iq-test" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
              <ChevronLeft size={16} /> All chapters
            </Link>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 text-sm">{loadError}</div>
          ) : (
            <>
              {chapterTheory && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden"
                >
                  <div className={`h-1 bg-gradient-to-r ${accent.bar}`} />
                  <div className="p-6 sm:p-8 max-h-[min(70vh,42rem)] overflow-y-auto">
                    <TheoryPanel theory={chapterTheory} accent={accent} />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden"
              >
                <div className={`h-1.5 bg-gradient-to-r ${accent.bar}`} />
                <div className="p-6 sm:p-8 md:p-10">
                  <p className={`inline-flex text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded border ${accent.badge}`}>
                    Exercise · timed test
                  </p>
                <h1
                  className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {chapterMeta.title}
                </h1>
                <p className="mt-3 text-gray-600 text-base md:text-lg leading-relaxed">
                  {blurbFor(chapterMeta)}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8 border-y border-gray-100 py-5">
                  {[
                    { label: 'Questions', value: String(qCount) },
                    { label: 'Duration', value: formatDurationLabel(dur) },
                    { label: 'Pace', value: `~${pace}s` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center sm:text-left">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums tracking-tight">{value}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-400 font-semibold">{label}</p>
                    </div>
                  ))}
                </div>

                <ol className="mt-8 space-y-3 text-sm text-gray-600">
                  {[
                    'Fullscreen exam — navbar and footer hide while you work.',
                    'Jump any question from the map; first pick locks the answer.',
                    'Submit anytime, or the timer finishes the attempt for you.',
                  ].map((rule, i) => (
                    <li key={rule} className="flex gap-3">
                      <span className={`shrink-0 w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center border ${accent.badge}`}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{rule}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Button
                    variant="accent"
                    size="lg"
                    className="gap-2 min-w-[11rem]"
                    disabled={!total}
                    onPointerUp={() => navigate(`/iq-test/${slug}/take`)}
                  >
                    Start test <ArrowRight size={17} />
                  </Button>
                  <button
                    type="button"
                    onPointerUp={() => navigate('/iq-test')}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-2 py-2"
                  >
                    Back to chapters
                  </button>
                </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ───────────── TAKE ───────────── */
  if (phase === 'take') {
    if (loading || !current) {
      return (
        <div className="h-dvh flex items-center justify-center bg-canvas">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="h-dvh max-h-dvh overflow-hidden bg-canvas flex flex-col">
        <SEO title={`Taking · ${chapterMeta?.title || 'IQ Test'}`} url={`/iq-test/${slug}/take`} />

        <header className="shrink-0 border-b border-gray-200 bg-white z-20">
          <div className="px-3 sm:px-5 py-2.5 flex items-center gap-3 sm:gap-4 justify-between">
            <div className="min-w-0 hidden sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 truncate">{chapterMeta?.title}</p>
              <p className="text-base font-bold text-gray-900 tabular-nums leading-tight mt-0.5">
                Question {index + 1}
                <span className="text-gray-400 font-medium"> of {total}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5 tabular-nums">{answeredCount} answered · {total - answeredCount} blank</p>
            </div>
            <div className="sm:hidden min-w-0">
              <p className="text-sm font-bold text-gray-900 tabular-nums">Q{index + 1}/{total}</p>
              <p className="text-xs text-gray-500 tabular-nums">{answeredCount} done</p>
            </div>

            <ExamTimer
              remainingSec={remainingSec}
              durationSec={durationSec}
              urgent={timerUrgent}
              critical={timerCritical}
            />

            <Button variant="accent" size="lg" className="gap-2 shrink-0" onPointerUp={() => finishTest(false)}>
              <Flag size={16} />
              <span className="hidden sm:inline">Submit</span>
            </Button>
          </div>
          <div className="h-2 bg-gray-100">
            <div className={`h-full bg-gradient-to-r ${accent.bar} transition-all duration-300`} style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-h-0 min-w-0 flex flex-col p-3 sm:p-4 lg:p-5">
            <div className="lg:hidden shrink-0 mb-3 rounded-xl border border-gray-200 bg-white p-3 overflow-y-auto max-h-[7rem]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">Map</p>
                <p className="text-xs font-semibold text-gray-500 tabular-nums">{answeredCount}/{total}</p>
              </div>
              <QuestionPalette questions={questions} answers={answers} index={index} onJump={goTo} cols={6} />
            </div>

            <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white shadow-card flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded border ${accent.badge}`}>
                        Question {index + 1}
                      </span>
                      {selected && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                          selected === current.answer
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {selected === current.answer ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-[1.7rem] font-semibold text-gray-900 leading-snug mb-7">
                      {current.question}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {current.options.map((opt, i) => {
                        const letter = LETTERS[i];
                        const locked = Boolean(answers[current.id]);
                        const isCorrect = locked && letter === current.answer;
                        const isWrongPick = locked && letter === selected && letter !== current.answer;
                        return (
                          <button
                            key={letter}
                            type="button"
                            disabled={locked}
                            onPointerUp={() => pick(letter)}
                            className={[
                              'w-full text-left rounded-xl border-2 px-4 py-4 md:py-5 flex items-start gap-3.5 transition-all min-h-[4.75rem]',
                              optionClass(letter),
                              locked ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]',
                            ].join(' ')}
                          >
                            <span className={[
                              'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border',
                              isCorrect ? 'bg-emerald-600 text-white border-emerald-600'
                                : isWrongPick ? 'bg-red-600 text-white border-red-600'
                                  : locked ? 'bg-gray-200 text-gray-500 border-gray-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200',
                            ].join(' ')}>
                              {letter}
                            </span>
                            <span className="flex-1 text-[15px] sm:text-base font-medium leading-snug pt-2">{opt}</span>
                            {isCorrect && <Check size={18} className="text-emerald-600 mt-2 shrink-0" strokeWidth={2.5} />}
                            {isWrongPick && <X size={18} className="text-red-600 mt-2 shrink-0" strokeWidth={2.5} />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="shrink-0 border-t border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 bg-gray-50/90">
                <Button variant="secondary" size="md" disabled={index === 0} onPointerUp={() => goTo(index - 1)} className="gap-1.5">
                  <ChevronLeft size={17} /> Previous
                </Button>
                {index < total - 1 ? (
                  <Button variant="primary" size="md" onPointerUp={() => goTo(index + 1)} className="gap-1.5">
                    Next <ChevronRight size={17} />
                  </Button>
                ) : (
                  <Button variant="accent" size="md" onPointerUp={() => finishTest(false)} className="gap-1.5">
                    <Flag size={15} /> Finish
                  </Button>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:flex min-h-0 flex-col border-l border-gray-200 bg-white">
            <div className="p-4 flex flex-col min-h-0 flex-1">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-sm font-bold text-gray-900">Question map</h3>
                <span className="text-sm font-bold tabular-nums text-gray-500">{answeredCount}/{total}</span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
                <QuestionPalette questions={questions} answers={answers} index={index} onJump={goTo} cols={4} />
              </div>

              <div className="shrink-0 pt-4 mt-3 border-t border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border border-gray-900 ring-1 ring-amber-400" /> Current</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border border-emerald-500 bg-emerald-50" /> Correct</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border border-red-500 bg-red-50" /> Wrong</div>
                  <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border border-gray-200 bg-white" /> Blank</div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Blank left</span>
                    <span className="font-bold tabular-nums text-gray-900">{total - answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time used</span>
                    <span className="font-bold tabular-nums text-gray-900">{formatTime(usedSec)}</span>
                  </div>
                </div>

                <Button variant="accent" size="lg" className="w-full gap-2" onPointerUp={() => finishTest(false)}>
                  <Flag size={16} /> Submit test
                </Button>
                <button type="button" onPointerUp={() => navigate(`/iq-test/${slug}`)} className="w-full text-sm font-medium text-gray-400 hover:text-gray-700 py-1">
                  Abort to briefing
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  /* ───────────── RESULTS ───────────── */
  if (phase === 'results') {
    if (!resultTotal) {
      return <Navigate to={slug ? `/iq-test/${slug}` : '/iq-test'} replace />;
    }
    return (
      <div className="h-dvh max-h-dvh overflow-y-auto bg-canvas">
        <SEO title={`Results · ${chapterMeta?.title || 'IQ Test'}`} url={`/iq-test/${slug}/results`} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-5 pb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${accent.bar}`} />
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center">
              <div className="flex flex-col items-center md:items-start gap-3">
                {(resultBundle?.timedOut || timedOut) && (
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                    <Hourglass size={12} /> Time expired
                  </p>
                )}
                <ScoreRing value={resultAccuracy} />
              </div>

              <div className="text-center md:text-left space-y-5">
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-gray-900 tabular-nums tracking-tight">
                    {resultScore}
                    <span className="text-gray-300 text-2xl font-semibold"> / {resultTotal}</span>
                  </p>
                  <h2
                    className="mt-2 text-2xl md:text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {vibe.title}
                  </h2>
                  <p className="mt-1.5 text-gray-600">{vibe.body}</p>
                  {chapterMeta?.title && (
                    <p className="mt-2 text-sm text-gray-400">{chapterMeta.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Correct', value: resultScore, tone: 'text-emerald-700' },
                    { label: 'Wrong', value: resultWrong, tone: 'text-red-700' },
                    { label: 'Blank', value: resultBlank, tone: 'text-amber-700' },
                    { label: 'Time', value: formatTime(Math.max(0, resultUsed)), tone: 'text-gray-900' },
                  ].map(({ label, value, tone }) => (
                    <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-center sm:text-left">
                      <p className={`text-lg font-bold tabular-nums ${tone}`}>{value}</p>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 font-semibold mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button variant="accent" size="lg" className="gap-2" onPointerUp={() => navigate(`/iq-test/${slug}/take`)}>
                    <RotateCcw size={15} /> Retry
                  </Button>
                  <Button variant="secondary" size="lg" onPointerUp={() => navigate('/iq-test')}>All chapters</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Review</h3>
              <span className="text-xs text-gray-400 tabular-nums">{resultTotal} questions</span>
            </div>
            <ul className="divide-y divide-gray-100">
              {resultQuestions.map((q, qi) => {
                const chosen = resultAnswers[q.id];
                const unanswered = !chosen;
                const correct = chosen === q.answer;
                const correctIdx = LETTERS.indexOf(q.answer);
                const chosenIdx = LETTERS.indexOf(chosen);
                const edge = unanswered
                  ? 'border-l-amber-400'
                  : correct
                    ? 'border-l-emerald-500'
                    : 'border-l-red-500';
                return (
                  <li key={q.id} className={`border-l-4 ${edge} px-4 sm:px-5 py-3.5`}>
                    <div className="flex items-start gap-3">
                      {unanswered ? <Hourglass size={16} className="text-amber-500 mt-1 shrink-0" />
                        : correct ? <CheckCircle2 size={16} className="text-emerald-600 mt-1 shrink-0" />
                          : <XCircle size={16} className="text-red-500 mt-1 shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          <span className="text-gray-400 mr-1.5 tabular-nums">Q{qi + 1}.</span>
                          {q.question}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          <span className="text-emerald-700">
                            <span className="font-semibold">Correct</span>
                            {' '}{q.answer}{correctIdx >= 0 ? ` — ${q.options[correctIdx]}` : ''}
                          </span>
                          {!unanswered && !correct && (
                            <span className="text-red-700">
                              <span className="font-semibold">Yours</span>
                              {' '}{chosen}{chosenIdx >= 0 ? ` — ${q.options[chosenIdx]}` : ''}
                            </span>
                          )}
                          {unanswered && (
                            <span className="text-amber-700 font-semibold">Not answered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
