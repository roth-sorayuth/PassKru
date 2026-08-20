import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockQuestions } from '../data/mockData';
import { Question } from '../types';
import {
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Share2,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuestionPracticePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { bookmarkedQuestionIds, toggleBookmarkQuestion, setCurrentPage } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  const subjects = [
    { id: 'all', label: { km: 'គ្រប់មុខវិជ្ជា', en: 'All Subjects' } },
    { id: 'pedagogy', label: { km: 'គរុកោសល្យ & ចិត្តវិទ្យា', en: 'Pedagogy' } },
    { id: 'culture', label: { km: 'វប្បធម៌ទូទៅ', en: 'Culture' } },
    { id: 'khmer', label: { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer' } },
    { id: 'math', label: { km: 'គណិតវិទ្យា', en: 'Math' } },
  ];

  const filteredQuestions: Question[] = mockQuestions.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesBookmark = !onlyBookmarks || bookmarkedQuestionIds.includes(q.id);
    return matchesSubject && matchesBookmark;
  });

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQ = filteredQuestions[safeIndex] || mockQuestions[0];
  const isBookmarked = bookmarkedQuestionIds.includes(currentQ.id);

  const handleSelectOption = (optId: string) => {
    if (!isAnswerSubmitted) {
      setSelectedOptionId(optId);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
    const correct = selectedOptionId === currentQ.correctAnswerId;
    setUserAnswersHistory(prev => ({
      ...prev,
      [currentQ.id]: { selected: selectedOptionId, isCorrect: correct }
    }));

    if (correct) {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (safeIndex < filteredQuestions.length - 1) {
      setCurrentIndex(safeIndex + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  const isCorrect = selectedOptionId === currentQ.correctAnswerId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {safeIndex + 1}/{filteredQuestions.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {lang === 'km' ? currentQ.subjectKm : currentQ.subject}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'km' ? currentQ.topicKm : currentQ.topic}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {lang === 'km' ? 'កម្រិតមធ្យម' : 'Medium Difficulty'} • {currentQ.year || 2025}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmarkQuestion(currentQ.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? (lang === 'km' ? 'បានចំណាំ' : 'Saved') : (lang === 'km' ? 'ចំណាំ' : 'Bookmark')}</span>
            </button>

            {/* Filter bookmarks only toggle */}
            <button
              onClick={() => {
                setOnlyBookmarks(!onlyBookmarks);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                onlyBookmarks
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'km' ? 'សំណួរចំណាំ' : 'Saved Only'} ({bookmarkedQuestionIds.length})
            </button>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubject(s.id);
                setCurrentIndex(0);
                setSelectedOptionId(null);
                setIsAnswerSubmitted(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSubject === s.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label[lang]}
            </button>
          ))}
        </div>

        {/* Clickable Question Navigator Bubbles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {filteredQuestions.map((q, idx) => {
            const hist = userAnswersHistory[q.id];
            const isCurrent = safeIndex === idx;

            let bubbleClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
            if (hist) {
              bubbleClass = hist.isCorrect ? 'bg-emerald-500 text-white font-bold' : 'bg-rose-500 text-white font-bold';
            }
            if (isCurrent) {
              bubbleClass += ' ring-2 ring-indigo-600 ring-offset-2 font-black';
            }

            return (
              <button
                key={q.id}
                onClick={() => handleJumpToQuestion(idx)}
                className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center shrink-0 transition cursor-pointer ${bubbleClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'km' ? `សំណួរទី ${safeIndex + 1}` : `Question ${safeIndex + 1}`}
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
            {currentQ.question?.[lang] || currentQ.question?.km || ''}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options?.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            const isThisCorrect = opt.id === currentQ.correctAnswerId;

            let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

            if (isSelected && !isAnswerSubmitted) {
              optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-500/20';
            }

            if (isAnswerSubmitted) {
              if (isThisCorrect) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
              } else if (isSelected && !isThisCorrect) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 uppercase ${
                      isSelected
                        ? isAnswerSubmitted
                          ? isThisCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{opt.text?.[lang] || opt.text?.km || ''}</span>
                </div>

                {isAnswerSubmitted && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700 transition cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('prevQuestion')}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t('submitAnswer')}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={safeIndex === filteredQuestions.length - 1}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t('nextQuestion')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Explanation Card */}
        {isAnswerSubmitted && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700">{t('correct')}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-rose-700">{t('incorrect')}</span>
                </>
              )}
            </div>

            <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
              <p className="font-bold text-slate-900">{t('explanation')}:</p>
              <p className="text-slate-800">{currentQ.explanation?.[lang] || currentQ.explanation?.km || ''}</p>
            </div>

            {currentQ.reference && (
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 font-medium">
                {lang === 'km' ? 'ឯកសារយោងផ្លូវការ៖ ' : 'Official Reference: '}{currentQ.reference}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
