import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getQuizzes, getQuiz } from '../../services/quizService';
import { startAttempt, submitAttempt } from '../../services/attemptService';
import { Quiz, MockExam } from '../../types';
import { mockQuizzes, mockExams } from '../../data/mockData';
import {
  isSubjectInSelection,
  expandSubjectSelection,
  getExamCategoryLabel,
  getExamCategoryTag,
} from '../../data/examSelectionData';
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
  BookMarked,
  Flame,
  Clock,
  RefreshCw,
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
  const {
    activeQuizId,
    setActiveQuizId,
    activeQuiz,
    setActiveQuiz,
    activeMockExam,
    setActiveMockExam,
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
  } = useApp();
  const { lang } = useLanguage();

  const isMockExam = currentPage === 'mock-exam' || (Boolean(activeMockExam) && !activeQuiz && !activeQuizId);

  const [stage, setStage] = useState<Stage>('lobby');
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
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

  const openMockQuiz = (mq: Quiz) => {
    const duration = mq.durationMinutes || 15;
    const qDetail: QuizDetail = {
      quizId: 999999,
      title: lang === 'km' ? mq.title.km : mq.title.en,
      subjectName: lang === 'km' ? (mq.subjectKm || mq.subject) : mq.subject,
      durationMinutes: duration,
      totalQuestions: mq.questions.length,
      questions: mq.questions.map((q, idx) => ({
        questionId: idx + 1,
        topicId: null,
        topicName: lang === 'km' ? q.topicKm : q.topic,
        questionText: lang === 'km' ? q.question.km : q.question.en,
        questionOrder: idx + 1,
        options: q.options.map((opt, oIdx) => ({
          optionId: oIdx + 1,
          optionText: lang === 'km' ? opt.text.km : opt.text.en,
        })),
      })),
    };
    setQuiz(qDetail);
    setAttemptId(999999);
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setTimeLeft(duration * 60);
    setStage('taking');
  };

  const openMockExam = (me: MockExam) => {
    const duration = me.durationMinutes || (me.round === 2 ? 60 : 45);
    const qDetail: QuizDetail = {
      quizId: 888888,
      title: lang === 'km' ? me.title.km : me.title.en,
      subjectName: lang === 'km' ? (me.subjectKm || me.subject) : me.subject,
      durationMinutes: duration,
      totalQuestions: me.questions.length,
      questions: me.questions.map((q, idx) => ({
        questionId: idx + 1,
        topicId: null,
        topicName: lang === 'km' ? q.topicKm : q.topic,
        questionText: lang === 'km' ? q.question.km : q.question.en,
        questionOrder: idx + 1,
        options: q.options.map((opt, oIdx) => ({
          optionId: oIdx + 1,
          optionText: lang === 'km' ? opt.text.km : opt.text.en,
        })),
      })),
    };
    setQuiz(qDetail);
    setAttemptId(888888);
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setTimeLeft(duration * 60);
    setStage('taking');
  };

  // A mock exam arriving from practice, or quiz id from a course task (or picker),
  // or activeQuiz opens directly; otherwise load lobby.
  useEffect(() => {
    if (currentPage === 'mock-exam') {
      if (activeMockExam) {
        openMockExam(activeMockExam);
      } else {
        let filteredMocks = mockExams;
        if (userProfile?.targetExam) {
          const matchTarget = filteredMocks.filter(e => e.targetExam === userProfile.targetExam);
          if (matchTarget.length > 0) filteredMocks = matchTarget;
        }
        if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
          const matchSubj = filteredMocks.filter(e =>
            isSubjectInSelection(e.subjectKm || e.subject, userProfile.selectedSubjects!) ||
            isSubjectInSelection(e.title.km, userProfile.selectedSubjects!)
          );
          if (matchSubj.length > 0) filteredMocks = matchSubj;
        }
        const defaultExam = filteredMocks.find(e => e.round === 1) || filteredMocks[0] || mockExams[0];
        setActiveMockExam(defaultExam);
        openMockExam(defaultExam);
      }
    } else {
      // Quiz mode (currentPage === 'quiz')
      if (activeMockExam) {
        setActiveMockExam(null);
      }
      if (activeQuizId) {
        openQuiz(activeQuizId);
      } else if (activeQuiz) {
        openMockQuiz(activeQuiz);
      } else {
        loadLobby();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeMockExam, activeQuizId, activeQuiz]);

  const loadLobby = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizzes();
      let list = res.quizzes || [];
      if (list.length === 0) {
        let sourceMocks = mockQuizzes;
        if (userProfile?.targetExam) {
          const matchTarget = sourceMocks.filter(m => !m.targetExam || m.targetExam.includes(userProfile.targetExam as any));
          if (matchTarget.length > 0) sourceMocks = matchTarget;
        }
        list = sourceMocks.map((mq, idx) => ({
          quizId: 1000 + idx,
          title: lang === 'km' ? mq.title.km : mq.title.en,
          subjectName: lang === 'km' ? (mq.subjectKm || mq.subject) : mq.subject,
          totalQuestions: mq.questions.length,
          durationMinutes: mq.durationMinutes || 15,
        }));
      }

      if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
        const filtered = list.filter(q =>
          !q.subjectName ||
          isSubjectInSelection(q.subjectName, userProfile.selectedSubjects!) ||
          isSubjectInSelection(q.title, userProfile.selectedSubjects!)
        );
        if (filtered.length > 0) list = filtered;
      }

      setQuizzes(list);
      setStage('lobby');
    } catch {
      let sourceMocks = mockQuizzes;
      if (userProfile?.targetExam) {
        const matchTarget = sourceMocks.filter(m => !m.targetExam || m.targetExam.includes(userProfile.targetExam as any));
        if (matchTarget.length > 0) sourceMocks = matchTarget;
      }
      let list = sourceMocks.map((mq, idx) => ({
        quizId: 1000 + idx,
        title: lang === 'km' ? mq.title.km : mq.title.en,
        subjectName: lang === 'km' ? (mq.subjectKm || mq.subject) : mq.subject,
        totalQuestions: mq.questions.length,
        durationMinutes: mq.durationMinutes || 15,
      }));

      if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
        const filtered = list.filter(q =>
          !q.subjectName ||
          isSubjectInSelection(q.subjectName, userProfile.selectedSubjects!) ||
          isSubjectInSelection(q.title, userProfile.selectedSubjects!)
        );
        if (filtered.length > 0) list = filtered;
      }

      setQuizzes(list);
      setStage('lobby');
    } finally {
      setLoading(false);
    }
  };

  const openQuiz = async (quizId: number) => {
    // If it's one of the mock fallback quizzes:
    if (quizId >= 1000) {
      const mq = mockQuizzes[quizId - 1000] || mockQuizzes[0];
      openMockQuiz(mq);
      return;
    }

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
      setTimeLeft((quizRes.quiz.durationMinutes || 15) * 60);
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
      if ((attemptId === 999999 && activeQuiz) || (attemptId === 888888 && activeMockExam)) {
        const sourceQuestions = (attemptId === 888888 && activeMockExam)
          ? activeMockExam.questions
          : activeQuiz!.questions;
        let correctCount = 0;
        const gradedAnswers: GradedAnswer[] = sourceQuestions.map((q, idx) => {
          const selectedOptIdx = answers[idx + 1];
          const correctOptIdx = q.options.findIndex((o) => o.id === q.correctAnswerId) + 1;
          const isCorrect = selectedOptIdx === correctOptIdx;
          if (isCorrect) correctCount++;
          return {
            questionId: idx + 1,
            selectedOptionId: selectedOptIdx ?? null,
            isCorrect,
            correctOptionId: correctOptIdx,
            explanation: lang === 'km' ? q.explanation.km : q.explanation.en,
          };
        });
        const computedScore = Math.round((correctCount / sourceQuestions.length) * 100);
        setResult({
          attemptId,
          score: computedScore,
          correctCount,
          totalQuestions: sourceQuestions.length,
          answers: gradedAnswers,
          topicStats: [],
        });

        // Save percentage to the subject
        saveSubjectScore({
          subjectId: selectedPracticeSubjectId || undefined,
          subjectName: selectedPracticeSubject || (isMockExam ? activeMockExam?.subjectKm : activeQuiz?.subjectKm || quiz.subjectName),
          category: isMockExam ? 'mock-exam' : 'quiz',
          round: isMockExam ? (activeMockExam?.round || 1) : undefined,
          score: computedScore,
        });

        setStage('result');
        return;
      }
      const payload = quiz.questions.map((q) => ({
        questionId: q.questionId,
        selectedOptionId: answers[q.questionId] ?? null,
      }));
      const res = await submitAttempt(attemptId, payload);
      setResult(res.result);

      // Save percentage to the subject
      saveSubjectScore({
        subjectId: selectedPracticeSubjectId || undefined,
        subjectName: selectedPracticeSubject || quiz.subjectName,
        category: 'quiz',
        score: res.result.score,
      });

      setStage('result');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const backToLobby = () => {
    setTimeLeft(null);
    setActiveMockExam(null);
    setActiveQuizId(null);
    setActiveQuiz(null);
    setQuiz(null);
    setAttemptId(null);
    setResult(null);
    setPracticeViewMode('hub');
    setCurrentPage('practice');
  };

  const handleRetake = () => {
    if (isMockExam && activeMockExam) {
      openMockExam(activeMockExam);
    } else if (activeQuiz) {
      openMockQuiz(activeQuiz);
    } else if (quiz) {
      openQuiz(quiz.quizId);
    }
  };

  const handleGoToRound2 = () => {
    const r2Exam =
      mockExams.find((e) => e.targetExam === activeMockExam?.targetExam && e.round === 2) ||
      mockExams.find((e) => e.round === 2) ||
      mockExams[1];
    setActiveQuiz(null);
    setActiveQuizId(null);
    setActiveMockExam(r2Exam);
    setCurrentPage('mock-exam');
    openMockExam(r2Exam);
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setPracticeViewMode('hub');
                setCurrentPage('practice');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to Practice'}</span>
            </button>

            {selectedPracticeSubject && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
                <span>{selectedPracticeSubject}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPracticeSubject(null)}
                  className="ml-1 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Active Exam Target Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {lang === 'km' ? 'ក្របខណ្ឌ និងមុខវិជ្ជារបស់អ្នក' : 'Your track & subjects'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {getExamCategoryTag(userProfile.examCategory || userProfile.targetExam, lang)}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mt-0.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
              </h2>
              {userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {expandSubjectSelection(userProfile.selectedSubjects || [], lang).map((subj, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {subj}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => openExamSelection()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-center shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌប្រឡង' : 'Change Exam Category'}</span>
            </button>
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map((q) => (
                <div
                  key={q.quizId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{q.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {q.subjectName} · {q.totalQuestions} {lang === 'km' ? 'សំណួរ' : 'questions'}
                        {q.durationMinutes ? ` · ${q.durationMinutes} ${lang === 'km' ? 'នាទី' : 'min'}` : ''}
                      </p>
                    </div>
                    {(() => {
                      const qScore = subjectScores[q.subjectName]?.quizScore;
                      if (qScore === undefined) return null;
                      return (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border shadow-2xs shrink-0 ${
                          qScore >= 50
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          <span>{qScore}%</span>
                        </span>
                      );
                    })()}
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
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900">{quiz.title}</h1>
                {isMockExam && activeMockExam && (
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs ${
                    activeMockExam.round === 2
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {activeMockExam.round === 2 && <Flame className="w-3 h-3 text-rose-600" />}
                    {lang === 'km'
                      ? (activeMockExam.round === 2 ? 'ជុំទី ២ (កម្រិតពិបាក)' : 'ជុំទី ១ (កម្រិតមធ្យម)')
                      : (activeMockExam.round === 2 ? 'Round 2 (Hard)' : 'Round 1 (Medium)')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {quiz.subjectName} · {Object.keys(answers).length}/{quiz.questions.length}{' '}
                {lang === 'km' ? 'បានឆ្លើយ' : 'answered'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Active Countdown Timer Display */}
              {timeLeft !== null && (
                <div
                  id="mock-exam-timer"
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold shadow-2xs transition-all ${
                    timeLeft <= 300
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse ring-2 ring-rose-300/30'
                      : activeMockExam?.round === 2
                      ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                      : 'bg-indigo-50/80 border-indigo-200 text-indigo-800'
                  }`}
                  title={lang === 'km' ? 'ពេលវេលានៅសល់' : 'Time remaining'}
                >
                  <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${timeLeft <= 300 ? 'text-rose-600' : 'text-indigo-600'}`} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}

              <button onClick={backToLobby} className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">
                {lang === 'km' ? 'ចាកចេញ' : 'Exit'}
              </button>
            </div>
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

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isMockExam && activeMockExam && activeMockExam.round === 1 ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ធ្វេីម្ដងទៀត' : 'Retake'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoToRound2}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <span>{lang === 'km' ? 'ទៅជុំទី២' : 'Go to Round 2'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMockExam(null);
                    setActiveQuizId(null);
                    setActiveQuiz(null);
                    setPracticeViewMode('hub');
                    setCurrentPage('practice');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-normal transition cursor-pointer"
                >
                  <span>{lang === 'km' ? 'ត្រឡប់ទៅអនុវត្ត' : 'Back to Practice'}</span>
                </button>
              </>
            ) : isMockExam && activeMockExam && activeMockExam.round === 2 ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ធ្វេីម្ដងទៀត' : 'Retake'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMockExam(null);
                    setActiveQuizId(null);
                    setActiveQuiz(null);
                    setPracticeViewMode('hub');
                    setCurrentPage('practice');
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  <span>{lang === 'km' ? 'ត្រឡប់ទៅអនុវត្ត' : 'Back to Practice'}</span>
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
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuizId(null);
                    setActiveQuiz(null);
                    setActiveMockExam(null);
                    setPracticeViewMode('hub');
                    setCurrentPage('practice');
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  <span>{lang === 'km' ? 'ត្រឡប់ទៅអនុវត្ត' : 'Back to Practice'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
