import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getQuizzes, getQuiz } from '../../services/quizService';
import { startAttempt, submitAttempt } from '../../services/attemptService';
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  ListChecks,
  Play,
  RotateCcw,
  Trophy,
} from 'lucide-react';

interface QuizOption {
  optionId: number;
  optionText: string;
}

interface QuizQuestion {
  questionId: number;
  topicId: number | null;
  topicName: string | null;
  questionText: string;
  questionOrder: number;
  options: QuizOption[];
}

interface QuizDetail {
  quizId: number;
  title: string;
  subjectName: string | null;
  durationMinutes: number | null;
  totalQuestions: number;
  questions: QuizQuestion[];
}

interface QuizListItem {
  quizId: number;
  title: string;
  subjectName: string | null;
  totalQuestions: number;
  durationMinutes: number | null;
}

interface GradedAnswer {
  questionId: number;
  selectedOptionId: number | null;
  isCorrect: boolean;
  correctOptionId: number | null;
  explanation: string | null;
}

interface AttemptResult {
  attemptId: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: GradedAnswer[];
  topicStats: { topicId: number; accuracy: number; correct: number; total: number }[];
}

type Stage = 'lobby' | 'taking' | 'result';

export const QuizPage: React.FC = () => {
  const { activeQuizId, setActiveQuizId, setCurrentPage } = useApp();
  const { lang } = useLanguage();

  const [stage, setStage] = useState<Stage>('lobby');
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A quiz id arriving from a course task (or the picker) opens that quiz
  // directly; otherwise the picker lists what's available.
  useEffect(() => {
    if (activeQuizId) {
      openQuiz(activeQuizId);
    } else {
      loadLobby();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuizId]);

  const loadLobby = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizzes();
      setQuizzes(res.quizzes || []);
      setStage('lobby');
    } catch (err: any) {
      setError(err?.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const openQuiz = async (quizId: number) => {
    setLoading(true);
    setError(null);
    try {
      const [quizRes, attempt] = await Promise.all([
        getQuiz(quizId),
        startAttempt({ attemptType: 'quiz', quizId }),
      ]);
      setQuiz(quizRes.quiz);
      setAttemptId(attempt.attempt.attemptId);
      setAnswers({});
      setCurrentIndex(0);
      setResult(null);
      setStage('taking');
    } catch (err: any) {
      setError(err?.message || 'Failed to start quiz');
      setStage('lobby');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !attemptId) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = quiz.questions.map((q) => ({
        questionId: q.questionId,
        selectedOptionId: answers[q.questionId] ?? null,
      }));
      const res = await submitAttempt(attemptId, payload);
      setResult(res.result);
      setStage('result');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const backToLobby = () => {
    setActiveQuizId(null);
    setQuiz(null);
    setAttemptId(null);
    setResult(null);
    loadLobby();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ---------- Lobby ---------- */}
      {stage === 'lobby' && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-indigo-600" />
              {lang === 'km' ? 'កម្រងសំណួរ' : 'Quizzes'}
            </h1>
            <p className="text-sm text-slate-500">
              {lang === 'km'
                ? 'លទ្ធផលរបស់អ្នកនឹងធ្វើបច្ចុប្បន្នភាពចំណេះដឹង និងចំណុចខ្សោយរបស់អ្នក។'
                : 'Your results update your topic mastery and weak areas.'}
            </p>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <p className="text-sm text-slate-500">
                {lang === 'km' ? 'មិនទាន់មានកម្រងសំណួរនៅឡើយទេ' : 'No quizzes are available yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map((q) => (
                <div
                  key={q.quizId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{q.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {q.subjectName} · {q.totalQuestions} {lang === 'km' ? 'សំណួរ' : 'questions'}
                      {q.durationMinutes ? ` · ${q.durationMinutes} ${lang === 'km' ? 'នាទី' : 'min'}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => openQuiz(q.quizId)}
                    disabled={q.totalQuestions === 0}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'km' ? 'ចាប់ផ្តើម' : 'Start quiz'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------- Taking ---------- */}
      {stage === 'taking' && quiz && (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{quiz.title}</h1>
              <p className="text-xs text-slate-500">
                {quiz.subjectName} · {Object.keys(answers).length}/{quiz.questions.length}{' '}
                {lang === 'km' ? 'បានឆ្លើយ' : 'answered'}
              </p>
            </div>
            <button onClick={backToLobby} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              {lang === 'km' ? 'ចាកចេញ' : 'Exit'}
            </button>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {quiz.questions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              {lang === 'km' ? 'កម្រងសំណួរនេះមិនទាន់មានសំណួរទេ' : 'This quiz has no questions yet'}
            </div>
          ) : (
            <>
              {(() => {
                const q = quiz.questions[currentIndex];
                return (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {lang === 'km' ? 'សំណួរ' : 'Question'} {currentIndex + 1}/{quiz.questions.length}
                        {q.topicName ? ` · ${q.topicName}` : ''}
                      </p>
                      <p className="text-base font-bold text-slate-900 mt-2">{q.questionText}</p>
                    </div>

                    <div className="space-y-2.5">
                      {q.options.map((opt) => {
                        const selected = answers[q.questionId] === opt.optionId;
                        return (
                          <button
                            key={opt.optionId}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.questionId]: opt.optionId }))}
                            className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition cursor-pointer ${
                              selected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            {opt.optionText}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ថយក្រោយ' : 'Back'}</span>
                </button>

                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((i) => Math.min(quiz.questions.length - 1, i + 1))}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                  >
                    <span>{lang === 'km' ? 'បន្ទាប់' : 'Next'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold transition"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{lang === 'km' ? 'ដាក់ស្នើចម្លើយ' : 'Submit answers'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ---------- Result ---------- */}
      {stage === 'result' && result && quiz && (
        <>
          <div className="bg-[#0a3263] rounded-3xl p-8 text-white text-center space-y-3">
            <Trophy className="w-10 h-10 mx-auto text-amber-400" />
            <p className="text-5xl font-extrabold">{result.score}%</p>
            <p className="text-sm text-blue-200">
              {result.correctCount}/{result.totalQuestions} {lang === 'km' ? 'ត្រឹមត្រូវ' : 'correct'}
            </p>
            <p className="text-xs text-blue-300">
              {lang === 'km'
                ? 'ចំណេះដឹង និងចំណុចខ្សោយរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាព។'
                : 'Your topic mastery and weak areas have been updated.'}
            </p>
          </div>

          <div className="space-y-3">
            {quiz.questions.map((q, idx) => {
              const graded = result.answers.find((a) => a.questionId === q.questionId);
              const correctOption = q.options.find((o) => o.optionId === graded?.correctOptionId);
              const chosenOption = q.options.find((o) => o.optionId === graded?.selectedOptionId);
              return (
                <div key={q.questionId} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                  <div className="flex items-start gap-2.5">
                    {graded?.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {q.questionText}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'km' ? 'ចម្លើយរបស់អ្នក' : 'Your answer'}:{' '}
                        <span className={graded?.isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {chosenOption?.optionText || (lang === 'km' ? 'មិនបានឆ្លើយ' : 'Not answered')}
                        </span>
                      </p>
                      {!graded?.isCorrect && correctOption && (
                        <p className="text-xs text-slate-500">
                          {lang === 'km' ? 'ចម្លើយត្រឹមត្រូវ' : 'Correct answer'}:{' '}
                          <span className="text-emerald-600 font-semibold">{correctOption.optionText}</span>
                        </p>
                      )}
                      {graded?.explanation && (
                        <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                          {graded.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openQuiz(quiz.quizId)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ធ្វើម្តងទៀត' : 'Retake'}</span>
            </button>
            <button
              onClick={() => {
                setActiveQuizId(null);
                setCurrentPage('study-plan');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
            >
              <span>{lang === 'km' ? 'ត្រឡប់ទៅវគ្គសិក្សា' : 'Back to my course'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
