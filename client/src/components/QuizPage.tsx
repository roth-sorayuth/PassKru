import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockQuizzes } from '../data/mockData';
import { Quiz, Question } from '../types';
import {
  Sparkles,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { activeQuiz, setActiveQuiz, setCurrentPage, startQuizById } = useApp();

  const [quizState, setQuizState] = useState<'lobby' | 'active' | 'completed'>('lobby');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(600);

  const curQuiz: Quiz = activeQuiz || mockQuizzes[0];
  const questions = curQuiz.questions;
  const currentQuestion = questions[currentQIndex];

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (quizState === 'active' && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            handleCompleteQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, timeRemainingSeconds]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizState('active');
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeRemainingSeconds(quiz.durationMinutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (optionId: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optionId }));
  };

  const handleCompleteQuiz = () => {
    setQuizState('completed');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate score
  let correctAnswersCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswerId) {
      correctAnswersCount++;
    }
  });
  const scorePercent = Math.round((correctAnswersCount / questions.length) * 100);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // LOBBY VIEW
  if (quizState === 'lobby') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'km' ? 'កម្រងសំណួរតាមប្រធានបទ' : 'Topic-Based Knowledge Quizzes'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {lang === 'km' ? 'កម្រងកម្រងសំណួរវាយតម្លៃចំណេះដឹង' : 'Subject Assessment Quizzes'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {lang === 'km'
              ? 'ជ្រើសរើសកម្រងសំណួរដើម្បីវាស់ស្ទង់ការយល់ដឹង និងទទួលបានរបាយការណ៍វិភាគចំណុចខ្សោយភ្លាមៗ។'
              : 'Test your grasp on high-yield exam subjects and pinpoint areas needing quick revision.'}
          </p>
        </div>

        {/* Quizzes List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockQuizzes.map(q => (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                    {lang === 'km' ? q.subjectKm : q.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{q.difficulty}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {q.title?.[lang] || q.title?.km || ''}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'km' ? `ប្រធានបទ៖ ${q.topicKm || q.topic || ''}` : `Topic: ${q.topic || ''}`}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{q.questionsCount} {lang === 'km' ? 'សំណួរ' : 'questions'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{q.durationMinutes} {lang === 'km' ? 'នាទី' : 'mins'}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStartQuiz(q)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t('startQuiz')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ RUNNER
  if (quizState === 'active') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
        {/* Active Quiz Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <span className="text-xs font-bold text-indigo-600">
              {lang === 'km' ? curQuiz.subjectKm : curQuiz.subject}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-md">
              {curQuiz?.title?.[lang] || curQuiz?.title?.km || ''}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {currentQIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {lang === 'km' ? `សំណួរទី ${currentQIndex + 1}` : `Question ${currentQIndex + 1}`}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQuestion?.question?.[lang] || currentQuestion?.question?.km || ''}
            </h3>
          </div>

          {/* Answer choices */}
          <div className="space-y-3">
            {currentQuestion?.options?.map(opt => {
              const isSelected = userAnswers[currentQIndex] === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectAnswer(opt.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 uppercase ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="text-sm font-medium">{opt.text?.[lang] || opt.text?.km || ''}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700"
            >
              {t('prevQuestion')}
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>{t('nextQuestion')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCompleteQuiz}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <span>{t('submitExam')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMPLETED SUMMARY VIEW
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'km' ? 'បានបញ្ចប់កម្រងសំណួរដោយជោគជ័យ!' : 'Quiz Completed Successfully!'}
          </h2>
          <p className="text-sm text-slate-500">
            {curQuiz?.title?.[lang] || curQuiz?.title?.km || ''}
          </p>
        </div>

        {/* Score Ring / Card */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-sm mx-auto space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('overallScore')}</p>
          <p className="text-4xl font-black text-indigo-600">{scorePercent}%</p>
          <p className="text-xs text-slate-600">
            {correctAnswersCount} / {questions.length} {lang === 'km' ? 'សំណួរត្រឹមត្រូវ' : 'correct answers'}
          </p>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs text-emerald-800 font-bold">{lang === 'km' ? 'ចម្លើយត្រឹមត្រូវ' : 'Correct'}</p>
              <p className="text-lg font-black text-emerald-700">{correctAnswersCount}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs text-rose-800 font-bold">{lang === 'km' ? 'ចម្លើយមិនត្រូវ' : 'Incorrect'}</p>
              <p className="text-lg font-black text-rose-700">{questions.length - correctAnswersCount}</p>
            </div>
          </div>
        </div>

        {/* Weak Topic Recommendation Note */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{lang === 'km' ? 'ការណែនាំដើម្បីកែលម្អ' : 'Recommended Action'}</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            {lang === 'km'
              ? 'សូមពិនិត្យសង្ខេបមេរៀន "ទ្រឹស្តី Piaget & Vygotsky" ឡើងវិញ និងធ្វើលំហាត់អនុវត្ត ១០ សំណួរបន្ថែម។'
              : 'Review Piaget & Vygotsky constructivist model summary notes and retry this topic quiz.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => handleStartQuiz(curQuiz)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('retry')}</span>
          </button>

          <button
            onClick={() => setQuizState('lobby')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {lang === 'km' ? 'ជ្រើសរើសកម្រងសំណួរផ្សេង' : 'Browse Other Quizzes'}
          </button>
        </div>
      </div>
    </div>
  );
};
