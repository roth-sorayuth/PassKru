import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockExams } from '../data/mockData';
import { MockExam, Question } from '../types';
import {
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Bookmark,
  Flag,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Layers,
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MockExamPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { activeMockExam, setActiveMockExam, setCurrentPage, startQuizById } = useApp();

  const [selectedExamId, setSelectedExamId] = useState<string>(activeMockExam?.id || mockExams[0].id);
  const [examState, setExamState] = useState<'lobby' | 'active' | 'result'>('lobby');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(45 * 60);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);

  const exam: MockExam = mockExams.find(e => e.id === selectedExamId) || mockExams[0];
  const questions: Question[] = exam.questions;
  const currentQ: Question = questions[currentQIndex] || questions[0];

  // Timer
  useEffect(() => {
    let timer: any;
    if (examState === 'active' && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeRemainingSeconds]);

  const handleStartExam = (examToStart?: MockExam) => {
    if (examToStart) {
      setSelectedExamId(examToStart.id);
    }
    setExamState('active');
    setCurrentQIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSeconds(exam.durationMinutes * 60);
    setShowSubmitConfirmModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (optionId: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optionId }));
  };

  const toggleMarkForReview = (index: number) => {
    setMarkedForReview(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleFinalSubmit = () => {
    setShowSubmitConfirmModal(false);
    setExamState('result');
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Result Metrics
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswerId) {
      correctCount++;
    }
  });

  const rawScore = correctCount * (exam.totalMarks / questions.length);
  const percentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = rawScore >= exam.passingMarks;
  const answeredCount = Object.keys(userAnswers).length;

  // LOBBY VIEW
  if (examState === 'lobby') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>{lang === 'km' ? 'ប្រព័ន្ធប្រឡងសាកល្បងស្តង់ដារជាតិ ២០២៦' : 'National Standard Mock Exam Simulator'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {lang === 'km' ? 'ការប្រឡងសាកល្បង Mock Exam' : 'Full-Length Mock Examination'}
          </h1>
          <p className="text-sm text-slate-600">
            {lang === 'km'
              ? 'ជ្រើសរើសវិញ្ញាសាដើម្បីចាប់ផ្តើមប្រឡងសាកល្បងក្រោមសម្ពាធម៉ោង និងទទួលការវិភាគចំណុចខ្សោយភ្លាមៗ។'
              : 'Choose an official track mock exam to test pacing under real-time constraints.'}
          </p>
        </div>

        {/* Track Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockExams.map(m => {
            const isSelected = selectedExamId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedExamId(m.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {lang === 'km' ? m.subjectKm : m.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{m.year}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{m.title?.[lang] || m.title?.km || ''}</h3>
                  <p className="text-xs text-slate-600">{m.description?.[lang] || m.description?.km || ''}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>⏱️ {m.durationMinutes} {lang === 'km' ? 'នាទី' : 'mins'} • {m.questions.length} {lang === 'km' ? 'សំណួរ' : 'Qs'}</span>
                  <span className="font-bold text-indigo-600">{m.totalMarks} {lang === 'km' ? 'ពិន្ទុ' : 'pts'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exam Specifications Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {lang === 'km' ? `លក្ខខណ្ឌវិញ្ញាសា៖ ${exam?.title?.km || ''}` : `Exam Setup: ${exam?.title?.en || exam?.title?.km || ''}`}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'រយៈពេលកំណត់' : 'Duration'}</span>
              <p className="text-xl font-black text-slate-900">{exam.durationMinutes} {lang === 'km' ? 'នាទី' : 'Mins'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'ចំនួនសំណួរ' : 'Questions'}</span>
              <p className="text-xl font-black text-slate-900">{exam.questions.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'ពិន្ទុសរុប' : 'Total Marks'}</span>
              <p className="text-xl font-black text-slate-900">{exam.totalMarks}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'ពិន្ទុជាប់កម្រិត' : 'Passing Score'}</span>
              <p className="text-xl font-black text-emerald-600">{exam.passingMarks} ({lang === 'km' ? '៥០%' : '50%'})</p>
            </div>
          </div>

          {/* Official Instructions */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{lang === 'km' ? 'បទបញ្ជា និងការណែនាំមុនពេលប្រឡង' : 'Official Examination Instructions'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950">
              {exam.instructions[lang].map((inst, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleStartExam()}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>{t('startExam')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM SIMULATION
  if (examState === 'active') {
    const isUnder5Mins = timeRemainingSeconds < 300;
    const isCurrentMarked = markedForReview[currentQIndex];

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
        {/* Top Status Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:px-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              MOCK
            </div>
            <div>
              <p className="text-xs text-indigo-300 font-semibold uppercase">{exam.subjectKm} • NIE 2026</p>
              <h2 className="text-sm sm:text-base font-bold truncate max-w-xs sm:max-w-md">{exam.title[lang]}</h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-black transition ${
            isUnder5Mins ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-amber-400 border border-slate-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                  {lang === 'km' ? `សំណួរទី ${currentQIndex + 1} នៃ ${questions.length}` : `Question ${currentQIndex + 1} of ${questions.length}`}
                </span>

                <button
                  onClick={() => toggleMarkForReview(currentQIndex)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isCurrentMarked
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${isCurrentMarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{isCurrentMarked ? (lang === 'km' ? 'បានចំណាំ' : 'Marked') : t('markForReview')}</span>
                </button>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question?.[lang] || currentQ.question?.km || ''}
              </h3>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {currentQ.options?.map(opt => {
                  const isSelected = userAnswers[currentQIndex] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectAnswer(opt.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 uppercase ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {opt.id}
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{opt.text?.[lang] || opt.text?.km || ''}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Nav inside exam */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('prevQuestion')}</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentQIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex(prev => prev + 1)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t('nextQuestion')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirmModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('submitExam')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Question Palette (1 Col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">{lang === 'km' ? 'ផ្ទាំងសំណួរ' : 'Question Palette'}</h4>
                <span className="text-xs font-semibold text-indigo-600">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              {/* Grid of question bubbles */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isMarked = markedForReview[idx];
                  const isCurrent = currentQIndex === idx;

                  let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (isAnswered) btnStyle = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                  if (isMarked) btnStyle = 'bg-amber-400 text-slate-950 font-bold border-amber-500';
                  if (isCurrent) btnStyle += ' ring-2 ring-indigo-500 ring-offset-2';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center relative ${btnStyle}`}
                    >
                      <span>{idx + 1}</span>
                      {isMarked && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-600" />
                  <span>{lang === 'km' ? 'បានឆ្លើយរួច' : 'Answered'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-400" />
                  <span>{lang === 'km' ? 'បានចំណាំ (Marked)' : 'Marked for review'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
                  <span>{lang === 'km' ? 'មិនទាន់ឆ្លើយ' : 'Unanswered'}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  {t('submitExam')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showSubmitConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-scaleUp">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {lang === 'km' ? 'បញ្ជាក់ការប្រគល់វិញ្ញាសា?' : 'Confirm Exam Submission?'}
                </h3>
                <p className="text-xs text-slate-600">
                  {lang === 'km'
                    ? `អ្នកបានឆ្លើយ ${answeredCount} ក្នុងចំណោម ${questions.length} សំណួរ។ តើអ្នកប្រាកដជាចង់បញ្ចប់ការប្រឡងឥឡូវនេះទេ?`
                    : `You have answered ${answeredCount} of ${questions.length} questions. Are you sure you want to finish?`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  {lang === 'km' ? 'ត្រឡប់ទៅធ្វើបន្ត' : 'Continue Exam'}
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {lang === 'km' ? 'យល់ព្រមប្រគល់' : 'Yes, Submit Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // POST-SUBMISSION DETAILED DIAGNOSTIC REPORT
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Result Card */}
      <div className={`rounded-3xl p-6 sm:p-10 border text-center space-y-6 shadow-sm ${
        isPassed
          ? 'bg-gradient-to-b from-emerald-50 via-white to-white border-emerald-200'
          : 'bg-gradient-to-b from-amber-50 via-white to-white border-amber-200'
      }`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner ${
          isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
        }`}>
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isPassed ? t('passed') : t('needImprovement')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {lang === 'km' ? 'របាយការណ៍វិភាគលទ្ធផល Mock Exam' : 'Official Mock Exam Diagnostic Report'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {exam?.title?.[lang] || exam?.title?.km || ''}
          </p>
        </div>

        {/* Score Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">{t('overallScore')}</span>
            <p className="text-2xl font-black text-indigo-600">{rawScore} / {exam.totalMarks}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">{t('accuracy')}</span>
            <p className="text-2xl font-black text-emerald-600">{percentage}%</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'ត្រូវ' : 'Correct'}</span>
            <p className="text-2xl font-black text-emerald-600">{correctCount} <span className="text-xs text-slate-400 font-normal">/ {questions.length}</span></p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'ខុស' : 'Incorrect'}</span>
            <p className="text-2xl font-black text-rose-600">{questions.length - correctCount}</p>
          </div>
        </div>

        {/* Weak Areas & Targeted Recommendations */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4 max-w-2xl mx-auto">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{lang === 'km' ? 'ការវិភាគចំណុចខ្សោយ និងអនុសាសន៍កែលម្អ' : 'Weak Area Analysis & Recommendations'}</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-rose-600">{lang === 'km' ? '• ចិត្តវិទ្យាអប់រំ (ទ្រឹស្តី Piaget & Vygotsky):' : '• Educational Psychology:'}</span>
              <p className="text-slate-600">
                {lang === 'km'
                  ? 'អ្នកបានឆ្លើយខុសសំណួរទាក់ទងនឹងដំណាក់កាលអភិវឌ្ឍបញ្ញា។ សូមអានជំពូកទី ៣ និងធ្វើកម្រងសំណួរអនុវត្តឡើងវិញ។'
                  : 'Struggled with cognitive developmental stages. Review Chapter 3 notes and solve 10 practice questions.'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-emerald-600">{lang === 'km' ? '• វប្បធម៌ទូទៅ និងច្បាប់អប់រំ:' : '• General Culture & Education Law:'}</span>
              <p className="text-slate-600">
                {lang === 'km'
                  ? 'ការយល់ដឹងល្អណាស់ (៩០% ភាពត្រឹមត្រូវ)។ សូមបន្តរក្សាសន្ទុះនេះ!'
                  : 'Excellent mastery (90% accuracy). Maintain this momentum.'}
              </p>
            </div>
          </div>
        </div>

        {/* Post Exam CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleStartExam()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'km' ? 'ប្រឡងឡើងវិញ' : 'Retake Mock Exam'}</span>
          </button>

          <button
            onClick={() => setCurrentPage('weakness')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{lang === 'km' ? 'មើលចំណុចខ្សោយលម្អិត' : 'View Weakness Tracker'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
