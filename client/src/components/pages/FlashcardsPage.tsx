import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { mockFlashcards } from '../../data/mockData';
import { Flashcard } from '../../types';
import {
  ArrowLeft,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Shuffle,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { lang } = useLanguage();
  const { setCurrentPage, setPracticeViewMode, selectedPracticeSubject, setSelectedPracticeSubject } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  // Filter cards by subject (if selected)
  const filteredCards = useMemo(() => {
    let cards = [...mockFlashcards];

    if (selectedPracticeSubject) {
      const subjectMatches = cards.filter(c =>
        c.subjectKm.toLowerCase().includes(selectedPracticeSubject.toLowerCase()) ||
        c.subject.toLowerCase().includes(selectedPracticeSubject.toLowerCase())
      );
      // Fallback if none match the exact subject name
      if (subjectMatches.length > 0) {
        cards = subjectMatches;
      }
    }

    return cards;
  }, [selectedPracticeSubject]);

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setPracticeViewMode('hub');
              setCurrentPage('practice');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-normal text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to Practice'}</span>
          </button>
        </div>

        {/* Title Bar */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'km' ? 'បណ្ណចងចាំរូបមន្ត & គន្លឹះ' : 'Interactive Study Flashcards'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-slate-900">
            {lang === 'km' ? 'បណ្ណចងចាំ Flashcards' : 'Memory Flashcards'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            {lang === 'km'
              ? 'ចុចលើកាតដើម្បីបង្វិលមើលចម្លើយ និងរូបមន្តពន្យល់'
              : 'Click or tap the card to flip between question and explanation.'}
          </p>
        </div>

        {/* Controls Bar: Shuffle */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-normal text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'km' ? 'ច្របល់កាត' : 'Shuffle'}</span>
          </button>
        </div>

        {/* 3D Flashcard Presentation Card */}
        {currentCard ? (
          <div className="space-y-6">
            <div
              onClick={() => setIsFlipped(prev => !prev)}
              className="relative min-h-[320px] sm:min-h-[380px] w-full cursor-pointer select-none group perspective-1000"
            >
              <div
                className={`relative w-full h-full min-h-[320px] sm:min-h-[380px] rounded-3xl p-7 sm:p-10 shadow-md hover:shadow-xl transition-all duration-500 transform-style-preserve-3d flex flex-col justify-between border ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border-indigo-700'
                    : 'bg-white text-slate-900 border-slate-200/90'
                }`}
              >
                {/* Top status inside card */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isFlipped
                      ? 'bg-white/10 text-indigo-300 border border-white/20'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {isFlipped
                      ? (lang === 'km' ? 'ចម្លើយ & ការពន្យល់' : 'Answer & Explanation')
                      : (lang === 'km' ? 'សំណួរ / រូបមន្ត' : 'Question / Term')}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isFlipped ? 'text-white/60' : 'text-slate-400'}`}>
                      {currentIndex + 1} / {filteredCards.length}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(currentCard.id);
                      }}
                      className={`p-1.5 rounded-full transition cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500 text-white'
                          : isFlipped
                          ? 'bg-white/10 text-white/50 hover:text-emerald-400'
                          : 'bg-slate-100 text-slate-400 hover:text-emerald-600'
                      }`}
                      title={isMastered ? 'Mastered' : 'Mark as mastered'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Main Body Content */}
                <div className="py-6 sm:py-8 text-center space-y-4">
                  <p className={`text-xs font-bold tracking-wider uppercase ${isFlipped ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    {lang === 'km' ? currentCard.subjectKm : currentCard.subject} • {currentCard.category}
                  </p>

                  <p className={`text-lg sm:text-2xl font-bold leading-relaxed whitespace-pre-line ${
                    isFlipped ? 'text-white' : 'text-slate-900'
                  }`}>
                    {isFlipped
                      ? (lang === 'km' ? currentCard.back.km : currentCard.back.en)
                      : (lang === 'km' ? currentCard.front.km : currentCard.front.en)}
                  </p>

                  {/* Optional Hint on Front */}
                  {!isFlipped && currentCard.hint && showHint && (
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-xl text-xs font-medium animate-fadeIn">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{lang === 'km' ? currentCard.hint.km : currentCard.hint.en}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Prompt inside card */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/30">
                  {!isFlipped && currentCard.hint ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(prev => !prev);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{showHint ? (lang === 'km' ? 'លាក់តម្រុយ' : 'Hide Hint') : (lang === 'km' ? 'បង្ហាញតម្រុយ' : 'Show Hint')}</span>
                    </button>
                  ) : <div />}

                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isFlipped ? 'text-white/60' : 'text-slate-400'}`}>
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ចុចដើម្បីបង្វិល' : 'Click to flip'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Prev, Next, Flip */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'km' ? 'កាតមុន' : 'Previous'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped(prev => !prev)}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0a3263] hover:bg-[#082447] shadow-sm transition cursor-pointer active:scale-95"
              >
                {lang === 'km' ? 'បង្វិលកាត' : 'Flip Card'}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <span>{lang === 'km' ? 'កាតបន្ទាប់' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {lang === 'km' ? 'រកមិនឃើញបណ្ណចងចាំទេ' : 'No flashcards found'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'km' ? 'សូមជ្រើសរើសកម្រិត ឬមុខវិជ្ជាផ្សេងទៀត។' : 'Try switching difficulty or selecting another subject.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setDifficultyFilter('all');
                setSelectedPracticeSubject(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
            >
              {lang === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset Filters'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlashcardsPage;

