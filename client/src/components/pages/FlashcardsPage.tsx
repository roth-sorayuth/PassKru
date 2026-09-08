import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { getFlashcards } from '../../services/flashcardService';
import { FlashcardApi, Flashcard } from '../../types';
import { mockFlashcards } from '../../data/mockData';
import {
  isSubjectInSelection,
  expandSubjectSelection,
  getExamCategoryLabel,
} from '../../data/examSelectionData';
import {
  ArrowLeft,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Loader2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

/**
 * Adapter helper to transform client mock Flashcard into API-compatible FlashcardApi format
 */
const mapMockToApi = (fc: Flashcard, idx: number, language: 'km' | 'en'): FlashcardApi => {
  // Safely extract front/back text with fallbacks
  const frontText = language === 'km'
    ? (fc.front?.km || '')
    : (fc.front?.en || fc.front?.km || '');
  
  const backText = language === 'km'
    ? (fc.back?.km || '')
    : (fc.back?.en || fc.back?.km || '');
  
  // Safely extract hint with fallbacks
  const hint = fc.hint
    ? (language === 'km' ? fc.hint.km : (fc.hint.en || fc.hint.km))
    : null;

  // Safely extract subject names
  const deckTitle = language === 'km' ? (fc.subjectKm || '') : (fc.subject || '');
  const subjectName = language === 'km' ? (fc.subjectKm || '') : (fc.subject || '');

  return {
    flashcardId: 9000 + idx + 1,
    deckId: 1,
    category: fc.category || null,
    frontText,
    backText,
    hint,
    difficulty: fc.difficulty || 'medium',
    deckTitle,
    subjectId: null,
    subjectName,
  };
};

export const FlashcardsPage: React.FC = () => {
  const { lang } = useLanguage();
  const {
    setCurrentPage,
    setPracticeViewMode,
    selectedPracticeSubject,
    selectedPracticeSubjectId,
    userProfile,
    openExamSelection,
  } = useApp();

  const [cards, setCards] = useState<FlashcardApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  // Resolve user's chosen subjects strictly from their selected category profile
  const userChosenSubjects = useMemo(() => {
    if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
      return expandSubjectSelection(userProfile.selectedSubjects);
    }
    // Strict fallback based on exam target if selectedSubjects is not yet saved
    if (userProfile?.targetExam === 'pttc') {
      return ['ភាសាខ្មែរ', 'គណិតវិទ្យា', 'វប្បធម៌ទូទៅ'];
    }
    if (userProfile?.targetExam === 'nie' || userProfile?.targetExam === 'rttc') {
      return ['វប្បធម៌ទូទៅ'];
    }
    return [];
  }, [userProfile?.selectedSubjects, userProfile?.targetExam]);

  // Load flashcards strictly filtered to user's chosen subjects
  const fetchFlashcardsData = useCallback(async () => {
    setLoading(true);
    let finalCards: FlashcardApi[] = [];

    try {
      const numericSubjectId =
        selectedPracticeSubjectId && !isNaN(Number(selectedPracticeSubjectId))
          ? selectedPracticeSubjectId
          : undefined;

      const res = await getFlashcards({ subjectId: numericSubjectId });

      if (res?.success && Array.isArray(res.flashcards) && res.flashcards.length > 0) {
        finalCards = res.flashcards;
      }
    } catch (err) {
      console.warn('Backend flashcards unavailable, using embedded study cards:', err);
    }

    // Fallback to rich embedded mock flashcards
    if (finalCards.length === 0) {
      finalCards = mockFlashcards.map((fc, idx) => mapMockToApi(fc, idx, lang));
    }

    // Apply strict filtering: ONLY subjects chosen in the choosing category
    let filtered = finalCards;

    if (selectedPracticeSubject) {
      // Single chosen subject view
      const matched = finalCards.filter(
        (c) =>
          c.subjectName &&
          (isSubjectInSelection(c.subjectName, [selectedPracticeSubject]) ||
            isSubjectInSelection(selectedPracticeSubject, [c.subjectName]) ||
            c.subjectName.toLowerCase().includes(selectedPracticeSubject.toLowerCase()) ||
            selectedPracticeSubject.toLowerCase().includes(c.subjectName.toLowerCase()))
      );
      if (matched.length > 0) {
        filtered = matched;
      }
    } else if (userChosenSubjects.length > 0) {
      // Cards belonging to the user's chosen subjects only
      const chosenFiltered = finalCards.filter(
        (c) =>
          c.subjectName &&
          (isSubjectInSelection(c.subjectName, userChosenSubjects) ||
            userChosenSubjects.some((chosen) =>
              c.subjectName!.toLowerCase().includes(chosen.toLowerCase()) ||
              chosen.toLowerCase().includes(c.subjectName!.toLowerCase())
            ))
      );
      if (chosenFiltered.length > 0) {
        filtered = chosenFiltered;
      }
    }

    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setLoading(false);
  }, [selectedPracticeSubjectId, selectedPracticeSubject, userChosenSubjects, lang]);

  useEffect(() => {
    fetchFlashcardsData();
  }, [fetchFlashcardsData]);

  const currentCard: FlashcardApi | undefined = cards[currentIndex];

  const handleNext = useCallback(() => {
    if (cards.length <= 1) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    if (cards.length <= 1) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleShuffle = () => {
    if (cards.length <= 1) return;
    setIsFlipped(false);
    setShowHint(false);

    // Shuffle the deck of cards (Fisher-Yates algorithm)
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // If the shuffled deck's first card happens to be the exact same card currently viewed,
    // swap it with another card so the user immediately gets a new question on card 1.
    if (currentCard && shuffled[0].flashcardId === currentCard.flashcardId && shuffled.length > 1) {
      const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }

    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (id: number) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Keyboard navigation shortcuts: Space to flip, Left/Right arrows to cycle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleBackToSubjectSelect = () => {
    try {
      sessionStorage.setItem('passkru_practice_category', 'flashcards');
    } catch {}
    setPracticeViewMode('subject-select');
    setCurrentPage('practice');
  };

  const isMastered = currentCard ? masteredIds.includes(currentCard.flashcardId) : false;

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackToSubjectSelect}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅជ្រើសរើសមុខវិជ្ជា' : 'Back to Choose Subject'}</span>
          </button>

          {selectedPracticeSubject && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a3263]/10 border border-[#0a3263]/20 text-[#0a3263] text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{selectedPracticeSubject}</span>
            </div>
          )}
        </div>

        {/* Active Exam Target Banner */}
        <div className="bg-gradient-to-r from-[#0f3360] to-[#1a4a82] rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
                {lang === 'km' ? 'ក្របខណ្ឌប្រឡងសកម្ម' : 'Active Track'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
              </h2>
            </div>
            {userChosenSubjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-blue-200 font-semibold mr-1">
                  {lang === 'km' ? 'មុខវិជ្ជាជ្រើសរើស៖' : 'Selected Subjects:'}
                </span>
                {userChosenSubjects.map((subj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white/15 text-white border border-white/20"
                  >
                    • {subj}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => openExamSelection()}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition border border-white/30 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌ' : 'Change Category'}</span>
          </button>
        </div>

        {/* Shuffle Control Only */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleShuffle}
            disabled={cards.length <= 1}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'km' ? 'ច្របល់កាត' : 'Shuffle'}</span>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        )}

        {/* 3D Flashcard Presentation Card */}
        {!loading && currentCard && (
          <div className="space-y-6">
            {/* Card Progress Indicator Bar */}
            <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#0a3263] h-full transition-all duration-300 ease-out"
                style={{
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              />
            </div>

            {/* Flip Container */}
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className="relative min-h-[340px] sm:min-h-[400px] w-full cursor-pointer select-none group perspective-1000"
            >
              <div
                className={`relative w-full h-full min-h-[340px] sm:min-h-[400px] rounded-3xl p-7 sm:p-10 shadow-md hover:shadow-xl transition-all duration-500 transform-style-preserve-3d flex flex-col justify-between border ${
                  isFlipped
                    ? 'bg-gradient-to-br from-[#0a2347] via-[#0f3360] to-[#164278] text-white border-blue-900'
                    : 'bg-white text-slate-900 border-slate-200/90'
                }`}
              >
                {/* Top status inside card */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isFlipped
                        ? 'bg-white/15 text-blue-200 border border-white/20'
                        : 'bg-blue-50 text-[#0a3263] border border-blue-100'
                    }`}
                  >
                    {isFlipped
                      ? lang === 'km'
                        ? 'ចម្លើយ & ការពន្យល់'
                        : 'Answer & Explanation'
                      : lang === 'km'
                      ? 'សំណួរ / រូបមន្ត'
                      : 'Question / Formula'}
                  </span>

                  <div className="flex items-center gap-2.5">
                    {/* Difficulty Badge */}
                    {currentCard.difficulty && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          isFlipped
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {currentCard.difficulty === 'easy'
                          ? lang === 'km' ? 'កម្រិតងាយ' : 'Easy'
                          : currentCard.difficulty === 'hard'
                          ? lang === 'km' ? 'កម្រិតពិបាក' : 'Hard'
                          : lang === 'km' ? 'កម្រិតមធ្យម' : 'Medium'}
                      </span>
                    )}

                    <span
                      className={`text-xs font-bold ${
                        isFlipped ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {currentIndex + 1} / {cards.length}
                    </span>

                    {/* Mastered Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(currentCard.flashcardId);
                      }}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500 text-white'
                          : isFlipped
                          ? 'bg-white/15 text-white/60 hover:text-emerald-300'
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
                  {currentCard.subjectName || currentCard.category ? (
                    <p
                      className={`text-xs font-bold tracking-wider uppercase ${
                        isFlipped ? 'text-blue-200' : 'text-[#0a3263]'
                      }`}
                    >
                      {[currentCard.subjectName, currentCard.category].filter(Boolean).join(' • ')}
                    </p>
                  ) : null}

                  <p
                    className={`text-lg sm:text-2xl font-bold leading-relaxed whitespace-pre-line ${
                      isFlipped ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {isFlipped ? currentCard.backText : currentCard.frontText}
                  </p>

                  {/* Optional Hint on Front */}
                  {!isFlipped && currentCard.hint && showHint && (
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-medium animate-fadeIn">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{currentCard.hint}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Prompt inside card */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/20">
                  {!isFlipped && currentCard.hint ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint((prev) => !prev);
                      }}
                      className="text-xs font-bold text-[#0a3263] hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>
                        {showHint
                          ? lang === 'km'
                            ? 'លាក់តម្រុយ'
                            : 'Hide Hint'
                          : lang === 'km'
                          ? 'បង្ហាញតម្រុយ'
                          : 'Show Hint'}
                      </span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isFlipped ? 'text-white/60' : 'text-slate-400'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ចុចដើម្បីបង្វិល' : 'Click to flip'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handlePrev}
                disabled={cards.length <= 1}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'km' ? 'កាតមុន' : 'Previous'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0a3263] hover:bg-[#082447] shadow-sm transition cursor-pointer active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
                <span>{lang === 'km' ? 'បង្វិលកាត' : 'Flip Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={cards.length <= 1}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{lang === 'km' ? 'កាតបន្ទាប់' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Keyboard shortcut helper footer */}
            <div className="text-center text-[11px] text-slate-400 font-normal">
              {lang === 'km'
                ? 'គន្លឹះ៖ ប្រើ Spacebar ដើម្បីបង្វិលកាត • ព្រួញ ◀ ▶ ដើម្បីផ្លាស់ប្តូរកាត'
                : 'Shortcut tips: Press Spacebar to flip • Left / Right arrows to switch cards'}
            </div>
          </div>
        )}

        {/* Empty State fallback (if 0 cards found for subject) */}
        {!loading && cards.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {lang === 'km' ? 'មិនមានបណ្ណចងចាំទេ' : 'No flashcards found'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'km'
                ? 'មិនទាន់មានបណ្ណចងចាំសម្រាប់មុខវិជ្ជានេះនៅឡើយទេ។'
                : 'No flashcards available for this subject yet.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleBackToSubjectSelect}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0a3263] hover:bg-[#082447] transition cursor-pointer"
              >
                {lang === 'km' ? 'ត្រឡប់ទៅជ្រើសរើសមុខវិជ្ជា' : 'Back to Choose Subject'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
