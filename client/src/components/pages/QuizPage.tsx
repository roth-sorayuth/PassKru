import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getQuizzes, getQuiz } from '../../services/quizService';
import { startAttempt, submitAttempt } from '../../services/attemptService';
import { MathText } from '../ui/MathText';
import {
  isSubjectInSelection,
  withCoreSubjects,
  getExamCategoryTag,
} from '../../data/examSelectionData';
import { SEOHead } from '../common/SEOHead';
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  XCircle,
  Loader2,
  ListChecks,
  Play,
  RotateCcw,
  Clock,
  RefreshCw,
  Layers,
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
  rawQuizId?: string;
  title: string;
  subjectName: string | null;
  totalQuestions: number;
  durationMinutes: number | null;
  difficulty?: 'easy' | 'medium' | 'hard';
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

/** Label for the button that returns to the page which opened the quiz. */
const RETURN_LABELS: Record<string, { km: string; en: string }> = {
  'study-plan': { km: 'ត្រឡប់ទៅផែនការសិក្សា', en: 'Back to Study Plan' },
  dashboard: { km: 'ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង', en: 'Back to Dashboard' },
  weakness: { km: 'ត្រឡប់ទៅចំណុចខ្សោយ', en: 'Back to Weak Areas' },
};

export const QuizPage: React.FC = () => {
  const {
    activeQuizId,
    setActiveQuizId,
    activeQuiz,
    setActiveQuiz,
    activeMockExam,
    setActiveMockExam,
    activeMockSetNumber,
    selectedPracticeSubject,
    setSelectedPracticeSubject,
    selectedPracticeSubjectId,
    saveSubjectScore,
    subjectScores,
    setPracticeViewMode,
    currentPage,
    setCurrentPage,
    userProfile,
    openExamSelection,
    quizReturnPage,
  } = useApp();
  const { lang } = useLanguage();

  // Mock exams open on the 'mock-exam' page. Don't read the practice tab saved in
  // sessionStorage here: it outlives the mock exam and would turn a later quiz
  // (e.g. one started from the dashboard) into a mock exam.
  const isMockExam = currentPage === 'mock-exam' || Boolean(activeMockExam);

  const [stage, setStage] = useState<Stage>('lobby');
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [currentQuizKey, setCurrentQuizKey] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quizzes and mock exams are real DB quizzes: the practice page, a course task
  // or the picker sets activeQuizId. There is no local question or answer source.
  useEffect(() => {
    if (activeQuizId) {
      openQuiz(activeQuizId);
    } else if (currentPage === 'mock-exam') {
      returnToMockExamPage();
    } else if (!selectedPracticeSubject) {
      // No quiz and no subject (refresh, browser back): an all-subjects list isn't a page, so go to the subject list.
      returnToPracticeQuizList(true);
    } else {
      loadLobby();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeQuizId, selectedPracticeSubject]);

  const loadLobby = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizzes({
        targetExam: userProfile?.targetExam,
        subjectName: selectedPracticeSubject || undefined,
      });
      let list: QuizListItem[] = (res.quizzes || []).map((q: any) => ({
        quizId: q.quizId,
        rawQuizId: String(q.quizId),
        title: (q.title || '').replace(/ឈុត/g, 'វិញ្ញាសារ'),
        subjectName: q.subjectName,
        totalQuestions: q.totalQuestions,
        durationMinutes: q.durationMinutes,
        difficulty: q.difficultyLevel,
      }));

      if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
        const filtered = list.filter(q =>
          !q.subjectName ||
          isSubjectInSelection(q.subjectName, withCoreSubjects(userProfile.selectedSubjects)) ||
          isSubjectInSelection(q.title, withCoreSubjects(userProfile.selectedSubjects))
        );
        if (filtered.length > 0) list = filtered;
      }

      if (selectedPracticeSubject) {
        const subFiltered = list.filter(q =>
          q.subjectName && (
            isSubjectInSelection(q.subjectName, [selectedPracticeSubject]) ||
            q.subjectName.toLowerCase().includes(selectedPracticeSubject.toLowerCase()) ||
            selectedPracticeSubject.toLowerCase().includes(q.subjectName.toLowerCase()) ||
            isSubjectInSelection(q.title, [selectedPracticeSubject])
          )
        );
        if (subFiltered.length > 0) list = subFiltered;
      }

      setQuizzes(list);
    } catch (err: any) {
      setQuizzes([]);
      setError(err?.message || (lang === 'km' ? 'មិនអាចទាញយកកម្រងសំណួរបានទេ' : 'Failed to load quizzes'));
    } finally {
      setStage('lobby');
      setLoading(false);
    }
  };

  const openQuiz = async (quizId: number, rawQuizId?: string) => {
    setLoading(true);
    setError(null);
    setCurrentQuizKey(rawQuizId || String(quizId));
    try {
      const [quizRes, attempt] = await Promise.all([
        getQuiz(quizId),
        startAttempt({ attemptType: 'quiz', quizId }),
      ]);
      setQuiz({ ...quizRes.quiz, questions: quizRes.quiz?.questions || [] });
      setAttemptId(attempt.attempt.attemptId);
      setAnswers({});
      setCurrentIndex(0);
      setResult(null);
      setTimeLeft((quizRes.quiz.durationMinutes || 50) * 60);
      setStage('taking');
    } catch (err: any) {
      setError(err?.message || 'Failed to start quiz');
      setStage('lobby');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !attemptId || submitting) return;
    setSubmitting(true);
    setError(null);
    setTimeLeft(null);
    try {
      const payload = (quiz.questions || []).map((q) => ({
        questionId: q.questionId,
        selectedOptionId: answers[q.questionId] ?? null,
      }));
      const res = await submitAttempt(attemptId, payload);
      setResult(res.result);

      // Save percentage to the subject & specific quiz card
      saveSubjectScore({
        subjectId: selectedPracticeSubjectId || undefined,
        subjectName: selectedPracticeSubject || quiz?.subjectName || '',
        quizId: currentQuizKey || (quiz?.quizId ? String(quiz.quizId) : activeQuizId ? String(activeQuizId) : undefined),
        mockSetNumber: activeMockSetNumber || 1,
        targetExam: userProfile?.targetExam,
        category: isMockExam ? 'mock-exam' : 'quiz',
        round: isMockExam ? (activeMockExam?.round || 1) : undefined,
        score: res.result.score,
      });

      setStage('result');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const returnToMockExamPage = () => {
    try {
      sessionStorage.setItem('passkru_practice_category', 'mock-exam');
    } catch { }
    setTimeLeft(null);
    setActiveMockExam(null);
    setActiveQuizId(null);
    setActiveQuiz(null);
    setCurrentQuizKey(null);
    setQuiz(null);
    setAttemptId(null);
    setResult(null);
    setSelectedPracticeSubject(null);
    setPracticeViewMode('subject-select');
    setCurrentPage('practice');
  };

  const resetQuizState = () => {
    setTimeLeft(null);
    setActiveMockExam(null);
    setActiveQuizId(null);
    setActiveQuiz(null);
    setCurrentQuizKey(null);
    setQuiz(null);
    setAttemptId(null);
    setResult(null);
  };

  // The practice page's quiz subject list, for a quiz that has neither a subject nor an origin page.
  const returnToPracticeQuizList = (replace = false) => {
    try {
      sessionStorage.setItem('passkru_practice_category', 'quiz');
    } catch { }
    resetQuizState();
    setSelectedPracticeSubject(null);
    setPracticeViewMode('subject-select');
    setCurrentPage('practice', { replace });
  };

  // Exit / back: to the page that opened the quiz (study plan, dashboard …), else the subject's quiz list.
  const backToLobby = () => {
    if (quizReturnPage) {
      const origin = quizReturnPage;
      resetQuizState();
      setCurrentPage(origin);
      return;
    }
    if (isMockExam) {
      returnToMockExamPage();
      return;
    }
    if (!selectedPracticeSubject) {
      returnToPracticeQuizList();
      return;
    }
    resetQuizState();
    setStage('lobby');
    loadLobby();
  };

  const handleRetake = () => {
    if (quiz) openQuiz(quiz.quizId);
  };

  // Countdown Timer Effect for Mock Exam / Timed Quiz
  useEffect(() => {
    if (stage !== 'taking' || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timeLeft]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${stage === 'taking' ? 'max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px]' : stage === 'lobby' ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn`}>
      <SEOHead
        title={lang === 'km' ? 'កម្រងសំណួរប្រឡងសាកល្បង' : 'Quiz & Mock Exams'}
        description={
          lang === 'km'
            ? 'តេស្តសមត្ថភាពជាមួយកម្រងសំណួរឆ្លាតវៃ កំណត់ម៉ោងដូចការប្រឡងពិតប្រាកដ និងទទួលបានពិន្ទុភ្លាមៗ។'
            : 'Simulated timed quiz modules and mock exam scoring for Cambodian Teacher Examination preparation.'
        }
        path="/quiz"
      />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ---------- Lobby ---------- */}
      {stage === 'lobby' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedPracticeSubject(null);
                setPracticeViewMode('subject-select');
                setCurrentPage('practice');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ថយក្រោយ' : 'Back'}</span>
            </button>
          </div>


          {quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
              <p className="text-sm text-slate-500">
                {lang === 'km' ? 'មិនទាន់មានកម្រងសំណួរសម្រាប់មុខវិជ្ជាដែលបានជ្រើសនៅឡើយទេ' : 'No quizzes available for your selected subjects yet'}
              </p>
              <button
                type="button"
                onClick={() => openExamSelection()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌប្រឡង' : 'Change Exam Category'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {quizzes.map((q) => (
                <div
                  key={q.rawQuizId || q.quizId}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#0f3360]/40 hover:shadow-md transition p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                        {(q.title || '').replace(/ឈុត/g, 'វិញ្ញាសារ')}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          {q.totalQuestions} {lang === 'km' ? 'សំណួរ' : 'questions'}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {q.durationMinutes ? `${q.durationMinutes} ${lang === 'km' ? 'នាទី' : 'min'}` : '50 min'}
                        </span>
                      </div>
                    </div>
                    {(() => {
                      const currentTarget = userProfile?.targetExam || 'nie';
                      const cardQuizId = q.rawQuizId;
                      if (!cardQuizId) return null;

                      // Strictly show percentage ONLY on this exact card in the active category
                      const qScore = subjectScores[`${currentTarget}::${cardQuizId}`]?.quizScore;
                      if (qScore === undefined) return null;

                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs shrink-0 ${qScore >= 50
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                          }`}>
                          <span>{qScore}%</span>
                        </span>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => openQuiz(q.quizId, q.rawQuizId)}
                    disabled={q.totalQuestions === 0}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3360] hover:bg-[#12427d] disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'km' ? 'ចាប់ផ្តើមធ្វើ Quiz នេះ' : 'Start This Quiz'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---------- Taking ---------- */}
      {stage === 'taking' && quiz && (() => {
        const cleanQuizTitle = (quiz.title || '').replace(/ឈុត/g, 'វិញ្ញាសារ');
        const levelTag = getExamCategoryTag(userProfile?.targetExam || 'nie', lang);
        const formatLevel = (tag: string) => {
          if (tag.includes('ឧត្តម')) return 'ថ្នាក់ឧត្តម';
          if (tag.includes('មូលដ្ឋាន')) return 'ថ្នាក់មូលដ្ឋាន';
          if (tag.includes('បឋម')) return 'ថ្នាក់បឋម';
          return tag;
        };
        const levelText = formatLevel(levelTag);
        const fullExamTitle = cleanQuizTitle.includes(quiz.subjectName || '')
          ? cleanQuizTitle
          : quiz.subjectName
            ? `${quiz.subjectName}${levelText ? ` (${levelText})` : ''} - ${cleanQuizTitle}`
            : cleanQuizTitle;
        const answeredCount = Object.keys(answers).length;
        const totalQuestions = quiz.questions.length;
        const toKhmerNumeral = (num: number | string) =>
          String(num).replace(/[0-9]/g, (d) => '០១២៣៤៥៦៧៨៩'[Number(d)]);

        const currentQ = quiz.questions[currentIndex];
        const hasCurrentAnswer = currentQ ? answers[currentQ.questionId] !== undefined : false;

        return (
          <>
            {/* Exam Header */}
            <div className="flex items-start justify-between gap-4 pb-2">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {fullExamTitle}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {quiz.subjectName ? `${quiz.subjectName} • ` : ''}{answeredCount}/{totalQuestions} {lang === 'km' ? 'បានឆ្លើយ' : 'answered'}
                </p>
                {/* Accent Purple Indicator Line */}
                <div className="w-12 h-1 bg-indigo-600 rounded-full mt-2.5" />
              </div>
              <div className="flex items-center gap-4 pt-1">
                {/* Active Countdown Timer Display */}
                {timeLeft !== null && (
                  <div
                    id="mock-exam-timer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50/90 text-indigo-700 text-xs sm:text-sm font-mono font-bold shadow-2xs transition-all"
                    title={lang === 'km' ? 'ពេលវេលានៅសល់' : 'Time remaining'}
                  >
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={backToLobby}
                  className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  {lang === 'km' ? 'ចាកចេញ' : 'Exit'}
                </button>
              </div>
            </div>

            {totalQuestions === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                {lang === 'km' ? 'កម្រងសំណួរនេះមិនទាន់មានសំណួរទេ' : 'This quiz has no questions yet'}
              </div>
            ) : (
              <>
                {/* ========================================================= */}
                {/* MOBILE SCREEN LAYOUT (< lg) - Unchanged Single-Column     */}
                {/* ========================================================= */}
                <div className="block lg:hidden space-y-5">
                  {/* Progress bar on mobile */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>

                  {/* Question Quick-Jump Palette for mobile */}
                  {totalQuestions > 5 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <div className="flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-[#0f3360]" />
                          <span>
                            {lang === 'km'
                              ? `ផ្ទាំងរុករកសំណួរ (${toKhmerNumeral(totalQuestions)} សំណួរ)`
                              : `Question navigation (${totalQuestions} questions)`}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-[#0f3360]">
                          {answeredCount} / {totalQuestions} {lang === 'km' ? 'បានឆ្លើយ' : 'answered'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                        {quiz.questions.map((qItem, qIdx) => {
                          const isAnswered = answers[qItem.questionId] !== undefined || answers[qIdx + 1] !== undefined;
                          const isCurrent = currentIndex === qIdx;
                          return (
                            <button
                              key={qItem.questionId || qIdx}
                              type="button"
                              onClick={() => setCurrentIndex(qIdx)}
                              className={`w-7 h-7 rounded-lg text-[11px] font-black transition flex items-center justify-center cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#0f3360] text-white ring-2 ring-[#0f3360]/30 shadow-xs'
                                  : isAnswered
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {qIdx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {currentQ && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f3360]">
                            {lang === 'km' ? 'សំណួរ' : 'Question'} {currentIndex + 1}/{totalQuestions}
                          </p>
                          <MathText as="p" className="text-base font-bold text-slate-900 mt-2" text={currentQ.questionText} />
                        </div>
                        {hasCurrentAnswer && (
                          <button
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => {
                                const next = { ...prev };
                                delete next[currentQ.questionId];
                                return next;
                              });
                            }}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                            title={lang === 'km' ? 'ដកការជ្រើសរើសចម្លើយ' : 'Undo / Clear chosen answer'}
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{lang === 'km' ? 'ដកចម្លើយ' : 'Undo'}</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {(currentQ.options || []).map((opt) => {
                          const selected = answers[currentQ.questionId] === opt.optionId;
                          return (
                            <button
                              key={opt.optionId}
                              type="button"
                              onClick={() => {
                                setAnswers((prev) => {
                                  if (prev[currentQ.questionId] === opt.optionId) {
                                    const next = { ...prev };
                                    delete next[currentQ.questionId];
                                    return next;
                                  }
                                  return { ...prev, [currentQ.questionId]: opt.optionId };
                                });
                              }}
                              className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition cursor-pointer ${
                                selected
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                              }`}
                            >
                              <MathText text={opt.optionText} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Prev / Next */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      disabled={currentIndex === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'ថយក្រោយ' : 'Back'}</span>
                    </button>

                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        <span>{lang === 'km' ? 'បន្ទាប់' : 'Next'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold transition cursor-pointer"
                      >
                        {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{lang === 'km' ? 'ដាក់ស្នើចម្លើយ' : 'Submit answers'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* DESKTOP SCREEN LAYOUT (>= lg) - Extended Responsive View   */}
                {/* ========================================================= */}
                <div className="hidden lg:flex gap-5 items-start">
                  {/* Left Column (flex-1): Question Card extends to fill available space */}
                  <div className="flex-1 min-w-0">
                    {currentQ && (
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs flex flex-col justify-between min-h-[480px]">
                        <div className="space-y-6">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-base font-bold text-indigo-600">
                              {lang === 'km' ? 'សំណួរ' : 'Question'} {currentIndex + 1}/{totalQuestions}
                            </p>
                            {hasCurrentAnswer && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAnswers((prev) => {
                                    const next = { ...prev };
                                    delete next[currentQ.questionId];
                                    return next;
                                  });
                                }}
                                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                                title={lang === 'km' ? 'ដកការជ្រើសរើសចម្លើយ' : 'Undo / Clear chosen answer'}
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{lang === 'km' ? 'ដកចម្លើយ' : 'Undo'}</span>
                              </button>
                            )}
                          </div>

                          {/* Question Stem */}
                          <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                            <MathText text={currentQ.questionText} />
                          </div>

                          {/* Options list with circular radio indicators */}
                          <div className="space-y-3 pt-2">
                            {(currentQ.options || []).map((opt) => {
                              const selected = answers[currentQ.questionId] === opt.optionId;
                              return (
                                <button
                                  key={opt.optionId}
                                  type="button"
                                  onClick={() => {
                                    setAnswers((prev) => {
                                      if (prev[currentQ.questionId] === opt.optionId) {
                                        const next = { ...prev };
                                        delete next[currentQ.questionId];
                                        return next;
                                      }
                                      return { ...prev, [currentQ.questionId]: opt.optionId };
                                    });
                                  }}
                                  className={`w-full text-left py-3.5 px-5 rounded-xl border transition-all cursor-pointer flex items-center gap-4 group ${
                                    selected
                                      ? 'bg-indigo-50/70 border-indigo-500 text-indigo-950 font-semibold ring-2 ring-indigo-500/20 shadow-xs'
                                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50/50'
                                  }`}
                                >
                                  {/* Radio Circle */}
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                      selected
                                        ? 'border-indigo-600 bg-white'
                                        : 'border-slate-300 group-hover:border-indigo-400 bg-white'
                                    }`}
                                  >
                                    {selected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                  </div>
                                  <div className="flex-1 text-sm font-medium leading-relaxed">
                                    <MathText text={opt.optionText} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Buttons inside the Left Card */}
                        <div className="flex items-center justify-between pt-8 mt-6">
                          <button
                            type="button"
                            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                            disabled={currentIndex === 0}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {lang === 'km' ? 'ថយក្រោយ' : 'Back'}
                          </button>

                          {currentIndex < totalQuestions - 1 ? (
                            <button
                              type="button"
                              onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
                            >
                              {lang === 'km' ? 'បន្ទាប់' : 'Next'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSubmit}
                              disabled={submitting}
                              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
                            >
                              {submitting && <Loader2 className="w-4 h-4 animate-spin inline mr-1" />}
                              {lang === 'km' ? 'បញ្ចប់ការប្រឡង' : 'Submit'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Compact Sticky Question Navigation Palette */}
                  <div className="w-[280px] shrink-0">
                    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 sticky top-24">
                      {/* Palette Header */}
                      <div className="flex items-center justify-between pb-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                          <h3 className="font-bold text-slate-900 text-xs">
                            {lang === 'km'
                              ? `ផ្ទាំងរុករកសំណួរ (${toKhmerNumeral(totalQuestions)} សំណួរ)`
                              : `Question Navigation (${totalQuestions})`}
                          </h3>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 shrink-0">
                          {answeredCount} / {totalQuestions} {lang === 'km' ? 'បានឆ្លើយ' : 'answered'}
                        </span>
                      </div>

                      {/* 5-Column Question Grid */}
                      <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto p-0.5">
                        {quiz.questions.map((qItem, qIdx) => {
                          const isAnswered = answers[qItem.questionId] !== undefined || answers[qIdx + 1] !== undefined;
                          const isCurrent = currentIndex === qIdx;
                          return (
                            <button
                              key={qItem.questionId || qIdx}
                              type="button"
                              onClick={() => setCurrentIndex(qIdx)}
                              className={`h-9 w-full rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs ${
                                isCurrent
                                  ? 'bg-[#0f172a] text-white shadow-xs'
                                  : isAnswered
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                    : 'bg-[#f8fafc] text-slate-700 hover:bg-slate-100 border border-slate-100/80'
                              }`}
                              title={`Question ${qIdx + 1}`}
                            >
                              {qIdx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Horizontal Status Legend */}
                      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0f172a]" />
                          <span>{lang === 'km' ? 'កំពុងធ្វើ' : 'Current'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                          <span>{lang === 'km' ? 'បានឆ្លើយ' : 'Answered'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#cbd5e1]" />
                          <span>{lang === 'km' ? 'មិនទាន់ឆ្លើយ' : 'Unanswered'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Centered Desktop Footer */}
                <div className="hidden lg:block text-center text-xs text-slate-400 pt-8 pb-2">
                  © វិទ្យាស្ថានអប់រំ - ប្រព័ន្ធប្រឡងអនឡាញ
                </div>
              </>
            )}
          </>
        );
      })()}

      {/* ---------- Result ---------- */}
      {stage === 'result' && result && quiz && (
        <>
          <div className="bg-[#0a3263] rounded-3xl p-8 text-white text-center space-y-3">
            <p className="text-5xl font-extrabold">{result.score}%</p>
            <p className="text-sm text-blue-200">
              {result.correctCount}/{result.totalQuestions} {lang === 'km' ? 'ត្រឹមត្រូវ' : 'correct'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {lang === 'km'
                  ? isMockExam
                    ? `បានរក្សាទុកពិន្ទុ ${result.score}% ក្នុងវិញ្ញាសាប្រឡងសាកល្បង ជុំទី ${activeMockExam?.round || 1} លើមុខវិជ្ជា «${selectedPracticeSubject || quiz.subjectName}» រួចរាល់`
                    : `បានរក្សាទុកពិន្ទុ ${result.score}% ក្នុងកម្រងសំណួរ Quiz លើមុខវិជ្ជា «${selectedPracticeSubject || quiz.subjectName}» រួចរាល់`
                  : isMockExam
                    ? `Score ${result.score}% saved to Mock Exam Round ${activeMockExam?.round || 1} for "${selectedPracticeSubject || quiz.subjectName}"`
                    : `Score ${result.score}% saved to Quiz for "${selectedPracticeSubject || quiz.subjectName}"`}
              </span>
            </div>
            <p className="text-xs text-blue-300">
              {lang === 'km'
                ? 'ចំណេះដឹង និងចំណុចខ្សោយរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាព។'
                : 'Your topic mastery and weak areas have been updated.'}
            </p>
          </div>

          <div className="space-y-3">
            {(quiz.questions || []).map((q, idx) => {
              const graded = result.answers?.find((a) => a.questionId === q.questionId);
              const correctOption = (q.options || []).find((o) => o.optionId === graded?.correctOptionId);
              const chosenOption = (q.options || []).find((o) => o.optionId === graded?.selectedOptionId);
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
                        {idx + 1}. <MathText text={q.questionText} />
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'km' ? 'ចម្លើយរបស់អ្នក' : 'Your answer'}:{' '}
                        <span className={graded?.isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {chosenOption?.optionText ? <MathText text={chosenOption.optionText} /> : lang === 'km' ? 'មិនបានឆ្លើយ' : 'Not answered'}
                        </span>
                      </p>
                      {!graded?.isCorrect && correctOption && (
                        <p className="text-xs text-slate-500">
                          {lang === 'km' ? 'ចម្លើយត្រឹមត្រូវ' : 'Correct answer'}:{' '}
                          <span className="text-emerald-600 font-semibold"><MathText text={correctOption.optionText} /></span>
                        </p>
                      )}
                      {graded?.explanation && (
                        <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                          <MathText text={graded.explanation} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isMockExam ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ធ្វើម្តងទៀត' : 'Retake'}</span>
                </button>
                <button
                  type="button"
                  onClick={backToLobby}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <span>
                    {quizReturnPage
                      ? RETURN_LABELS[quizReturnPage]?.[lang] || (lang === 'km' ? 'ត្រឡប់ទៅទំព័រមុន' : 'Back')
                      : lang === 'km' ? 'ត្រឡប់ទៅវិញ្ញាសាប្រឡងសាកល្បង' : 'Back to Mock Exam Page'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              // Quiz Result: Quiz has only 1 round
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ធ្វើម្តងទៀត' : 'Retake'}</span>
                </button>
                {quizReturnPage ? (
                  // Opened from the study plan, dashboard or weak areas: go straight back there.
                  <button
                    type="button"
                    onClick={backToLobby}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0f3360] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{RETURN_LABELS[quizReturnPage]?.[lang] || (lang === 'km' ? 'ត្រឡប់ទៅទំព័រមុន' : 'Back')}</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={backToLobby}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0f3360] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <ListChecks className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'បញ្ជី Quiz ផ្សេងទៀត' : 'All Quizzes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => returnToPracticeQuizList()}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                    >
                      <span>{lang === 'km' ? 'ត្រឡប់ទៅអនុវត្ត' : 'Back to Practice'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
