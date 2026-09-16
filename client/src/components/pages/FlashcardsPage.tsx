import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { getFlashcards, getFlashcardDecks, FlashcardDeckApi } from '../../services/flashcardService';
import { FlashcardApi } from '../../types';
import { MathText } from '../ui/MathText';
import {
  isSubjectInSelection,
  expandSubjectSelection,
  getExamCategoryLabel,
  withCoreSubjects,
} from '../../data/examSelectionData';
import { getSubjectTheme } from '../../utils/subjectIcons';
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
  Layers,
  Sparkles,
  Play,
  Grid,
} from 'lucide-react';

const CARDS_PER_SET = 10;

const getEquivalentSubjectNames = (subjectName: string): string[] => {
  if (!subjectName) return [];
  const s = subjectName.trim();
  const lower = s.toLowerCase();
  const res = new Set<string>([s, lower]);

  if (lower.includes('ប្រវត្តិ') || lower.includes('history')) {
    res.add('ប្រវត្តិវិទ្យា');
    res.add('ប្រវត្តិសាស្ត្រ');
    res.add('ប្រវត្តិសាស្ត្រខ្មែរ');
  }
  if (lower.includes('ភូមិ') || lower.includes('geo')) {
    res.add('ភូមិវិទ្យា');
    res.add('ភូមិសាស្ត្រ');
    res.add('ភូមិសាស្ត្រកម្ពុជា');
    res.add('ភូមិវិទ្យាកម្ពុជា');
  }
  if (lower.includes('ជីវ') || lower.includes('bio')) {
    res.add('ជីវវិទ្យា');
    res.add('ជីវ:វិទ្យា');
    res.add('ជីវវិទ្យាកោសិកា');
  }
  if (lower.includes('គីមី') || lower.includes('chem')) {
    res.add('គីមីវិទ្យា');
    res.add('គីមីវិទ្យាទូទៅ');
  }
  if (lower.includes('មេកានិច') || lower.includes('រូប') || lower.includes('physic')) {
    res.add('រូបវិទ្យា');
    res.add('មេកានិច');
  }
  if (lower.includes('គណិត') || lower.includes('math')) {
    res.add('គណិតវិទ្យា');
  }
  if (lower.includes('ខ្មែរ') || lower.includes('khmer')) {
    res.add('ភាសាខ្មែរ');
    res.add('វេយ្យាករណ៍ខ្មែរ');
  }
  if (lower.includes('វប្បធម៌') || lower.includes('general')) {
    res.add('វប្បធម៌ទូទៅ');
  }

  return Array.from(res);
};

const matchSubject = (deckSubj: string | null | undefined, targetSubj: string): boolean => {
  if (!deckSubj) return false;
  const targetEquivs = getEquivalentSubjectNames(targetSubj).map((s) => s.toLowerCase());
  const deckLower = deckSubj.toLowerCase();
  return targetEquivs.some((eq) => deckLower.includes(eq) || eq.includes(deckLower));
};

// Subjects are chosen on the practice page's flashcards list; this page only shows a subject's decks and cards.
type ViewStep = 'deck-select' | 'viewer';

export const FlashcardsPage: React.FC = () => {
  const { lang } = useLanguage();
  const {
    setCurrentPage,
    setPracticeViewMode,
    selectedPracticeSubject,
    setSelectedPracticeSubject,
    selectedPracticeSubjectId,
    setSelectedPracticeSubjectId,
    userProfile,
    openExamSelection,
    quizReturnPage,
    activeFlashcardDeckId,
    setActiveFlashcardDeckId,
  } = useApp();

  // Active step flow: 'deck-select' -> 'viewer'
  const [viewStep, setViewStep] = useState<ViewStep>('deck-select');

  const [chosenSubjectName, setChosenSubjectName] = useState<string>(selectedPracticeSubject || 'គណិតវិទ្យា');
  const [chosenSubjectId, setChosenSubjectId] = useState<string | number | undefined>(selectedPracticeSubjectId);

  // Deck state
  const [decks, setDecks] = useState<FlashcardDeckApi[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeckApi | null>(null);

  // Cards state for viewer
  const [cards, setCards] = useState<FlashcardApi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Viewer controls
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  // User chosen subjects list from profile
  const userChosenSubjects = useMemo(() => {
    if (userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0) {
      return expandSubjectSelection(userProfile.selectedSubjects);
    }
    if (userProfile?.targetExam === 'pttc') {
      return ['វប្បធម៌ទូទៅ', 'គណិតវិទ្យា', 'អក្សរសាស្ត្រខ្មែរ'];
    }
    if (userProfile?.targetExam === 'nie' || userProfile?.targetExam === 'rttc') {
      return ['វប្បធម៌ទូទៅ'];
    }
    return ['គណិតវិទ្យា', 'ភាសាខ្មែរ', 'វប្បធម៌ទូទៅ', 'ភាសាអង់គ្លេស'];
  }, [userProfile?.selectedSubjects, userProfile?.targetExam]);

  // Fetch the subject's decks from the database
  const loadDecksForSubject = useCallback(async (subjName: string, subjId?: string | number) => {
    setLoading(true);
    let fetchedDecks: FlashcardDeckApi[] = [];
    try {
      const numericSubjectId = subjId && !isNaN(Number(subjId)) ? String(subjId) : undefined;
      const res = await getFlashcardDecks({ subjectId: numericSubjectId, subjectName: subjName });
      fetchedDecks = (res?.decks || []).filter(
        (d) => matchSubject(d.subjectName, subjName) && d.totalFlashcards > 0
      );
    } catch (err) {
      console.warn('Failed to load decks from server:', err);
    }
    setDecks(fetchedDecks);
    setLoading(false);
    return fetchedDecks;
  }, []);

  // Load a deck's cards from the database
  const loadCardsForDeck = useCallback(async (deck: FlashcardDeckApi) => {
    setLoading(true);
    setSelectedDeck(deck);
    let fetchedCards: FlashcardApi[] = [];
    try {
      const res = await getFlashcards({ deckId: String(deck.deckId) });
      fetchedCards = res?.flashcards || [];
    } catch (err) {
      console.warn('Failed to load cards for deck:', err);
    }
    setCards(fetchedCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setViewStep('viewer');
    setLoading(false);
  }, []);

  // Load the chosen subject's decks. Without a subject (browser back/forward,
  // refresh) go to the practice page's flashcards subject list instead.
  useEffect(() => {
    if (selectedPracticeSubject) {
      setChosenSubjectName(selectedPracticeSubject);
      setChosenSubjectId(selectedPracticeSubjectId);
      setViewStep('deck-select');
      loadDecksForSubject(selectedPracticeSubject, selectedPracticeSubjectId).then((list) => {
        // Opened from a study plan task: go straight to that deck's cards.
        const target = activeFlashcardDeckId ? list.find((d) => d.deckId === activeFlashcardDeckId) : null;
        if (activeFlashcardDeckId) setActiveFlashcardDeckId(null);
        if (target) loadCardsForDeck(target);
      });
    } else {
      handleBackToSubjectSelect(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPracticeSubject, selectedPracticeSubjectId, loadDecksForSubject]);

  // Viewer Card Navigation
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

    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

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
    if (viewStep !== 'viewer') return;

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
  }, [viewStep, handleNext, handlePrev]);

  // Back to the practice page's flashcards subject list. `replace` is for the
  // no-subject redirect, so Back doesn't return to an empty /flashcards and bounce.
  const handleBackToSubjectSelect = (replace = false) => {
    // Opened from a study plan (or dashboard) task: go back there instead.
    if (quizReturnPage) {
      setCurrentPage(quizReturnPage, { replace });
      return;
    }
    try {
      sessionStorage.setItem('passkru_practice_category', 'flashcards');
    } catch {}
    setPracticeViewMode('subject-select');
    setCurrentPage('practice', { replace });
  };

  const isMastered = currentCard ? masteredIds.includes(currentCard.flashcardId) : false;

  // No subject chosen: the effect above is redirecting to the subject list.
  if (!selectedPracticeSubject) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {viewStep === 'viewer' && (
              <button
                type="button"
                onClick={() => setViewStep('deck-select')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#0a3263] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'ត្រឡប់ទៅជ្រើសរើសវិញ្ញាសារ' : 'Back to Decks List'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleBackToSubjectSelect()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {quizReturnPage === 'study-plan'
                  ? lang === 'km' ? 'ត្រឡប់ទៅផែនការសិក្សា' : 'Back to Study Plan'
                  : quizReturnPage
                    ? lang === 'km' ? 'ត្រឡប់ទៅទំព័រមុន' : 'Back'
                    : lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជាផ្សេង' : 'Change Subject'}
              </span>
            </button>
          </div>

          {chosenSubjectName && (() => {
            const theme = getSubjectTheme(chosenSubjectName);
            const SubjIcon = theme.icon;
            return (
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl ${theme.bg} ${theme.text} border ${theme.border || 'border-blue-200'} text-xs font-bold`}>
                <SubjIcon className="w-3.5 h-3.5" />
                <span>{chosenSubjectName}</span>
                {selectedDeck && viewStep === 'viewer' && (
                  <span className="opacity-80 font-semibold">• {selectedDeck.title}</span>
                )}
              </div>
            );
          })()}
        </div>

        {/* Active Exam Target Banner */}
        <div className="bg-gradient-to-r from-[#0f3360] to-[#1a4a82] rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-xs">
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

        {/* ========================================================================= */}
        {/* STEP 2: DECK CARD SELECTION GRID (CHOOSE BATCH DECK) */}
        {/* ========================================================================= */}
        {viewStep === 'deck-select' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0a3263]" />
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {lang === 'km' ? `វិញ្ញាសារបណ្ណចងចាំមុខវិជ្ជា ${chosenSubjectName}` : `Flashcard Decks for ${chosenSubjectName}`}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'km'
                    ? `មាន ${decks.length} វិញ្ញាសារបណ្ណចងចាំ`
                    : `Showing ${decks.length} decks`}
                </p>
              </div>

            </div>

            {loading && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#0a3263] animate-spin mx-auto" />
                <p className="text-xs text-slate-500">
                  {lang === 'km' ? 'កំពុងផ្ទុកវិញ្ញាសារបណ្ណចងចាំ...' : 'Loading deck batches...'}
                </p>
              </div>
            )}

            {!loading && decks.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                {lang === 'km' ? 'មុខវិជ្ជានេះមិនទាន់មានវិញ្ញាសារបណ្ណចងចាំទេ' : 'This subject has no flashcard decks yet'}
              </div>
            )}

            {!loading && decks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {decks.map((deckItem, idx) => (
                  <div
                    key={deckItem.deckId}
                    onClick={() => loadCardsForDeck(deckItem)}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-[#0a3263] transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    {/* Top deck badge header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#0a3263] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#0a3263] uppercase tracking-wider">
                          {lang === 'km' ? `វិញ្ញាសារទី ${idx + 1}` : `Deck Batch ${idx + 1}`}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#0a3263] border border-blue-100 flex items-center gap-1">
                        <Grid className="w-3 h-3 text-[#0a3263]" />
                        {deckItem.totalFlashcards} {lang === 'km' ? 'កាត' : 'cards'}
                      </span>
                    </div>

                    {/* Deck details */}
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0a3263] transition">
                        {deckItem.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {deckItem.description || 'កម្រងបណ្ណចងចាំសម្រាប់រំលឹកមេរៀន និងរូបមន្តសំខាន់ៗ'}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        {lang === 'km' ? 'កម្រិតមធ្យម • ស្វ័យសិក្សា' : 'Medium • Self Study'}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0a3263] group-hover:bg-[#082447] transition shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{lang === 'km' ? 'រៀនបណ្ណ' : 'Study Deck'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: 3D FLASHCARD VIEWER FOR SELECTED DECK */}
        {/* ========================================================================= */}
        {viewStep === 'viewer' && selectedDeck && (
          <div className="space-y-6 animate-fadeIn">
            {/* Viewer Deck Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0a3263] text-white">
                    {selectedDeck.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedDeck.description || 'កម្រងបណ្ណចងចាំសម្រាប់រំលឹកមេរៀន'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleShuffle}
                  disabled={cards.length <= 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-600" />
                  <span>{lang === 'km' ? 'ច្របល់កាត' : 'Shuffle'}</span>
                </button>
              </div>
            </div>

            {loading && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#0a3263] animate-spin mx-auto" />
                <p className="text-xs text-slate-500">
                  {lang === 'km' ? 'កំពុងផ្ទុកបណ្ណចងចាំ...' : 'Loading flashcards...'}
                </p>
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

                {/* Flip Container with Smooth 3D Transition */}
                <div
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="relative w-full h-[360px] sm:h-[420px] cursor-pointer select-none perspective-1000 group"
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500 ease-in-out transform-style-3d group-active:scale-[0.99]"
                    style={{
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* FRONT FACE */}
                    <div className="absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-8 md:p-10 shadow-md hover:shadow-xl flex flex-col justify-between border bg-white text-slate-900 border-slate-200/90 backface-hidden">
                      {/* Top status inside card */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0a3263] border border-blue-100">
                          {lang === 'km' ? 'សំណួរ / រូបមន្ត' : 'Question / Formula'}
                        </span>

                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {/* Difficulty Badge */}
                          {currentCard.difficulty && (
                            <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {currentCard.difficulty === 'easy' || currentCard.difficulty === 'ងាយ'
                                ? lang === 'km' ? 'កម្រិតងាយ' : 'Easy'
                                : currentCard.difficulty === 'hard' || currentCard.difficulty === 'ពិបាក'
                                ? lang === 'km' ? 'កម្រិតពិបាក' : 'Hard'
                                : lang === 'km' ? 'កម្រិតមធ្យម' : 'Medium'}
                            </span>
                          )}

                          <span className="text-xs font-bold text-slate-400">
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
                                : 'bg-slate-100 text-slate-400 hover:text-emerald-600'
                            }`}
                            title={isMastered ? 'Mastered' : 'Mark as mastered'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Card Main Body Content (Front) */}
                      <div className="py-4 sm:py-6 text-center space-y-3 sm:space-y-4 overflow-y-auto max-h-[220px] sm:max-h-[260px]">
                        {currentCard.subjectName || currentCard.category ? (
                          <p className="text-xs font-bold tracking-wider uppercase text-[#0a3263]">
                            {[currentCard.subjectName, currentCard.category].filter(Boolean).join(' • ')}
                          </p>
                        ) : null}

                        <p className="text-base sm:text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line text-slate-900">
                          {/* Same KaTeX rendering as quizzes: handles $…$, bare LaTeX and keyboard math */}
                          <MathText text={currentCard.frontText} />
                        </p>

                        {/* Optional Hint on Front */}
                        {currentCard.hint && showHint && (
                          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-medium animate-fadeIn">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span><MathText text={currentCard.hint} /></span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Prompt inside card */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        {currentCard.hint ? (
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

                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>{lang === 'km' ? 'ចុចដើម្បីបង្វិល' : 'Click to flip'}</span>
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-8 md:p-10 shadow-md hover:shadow-xl flex flex-col justify-between border bg-gradient-to-br from-[#0a2347] via-[#0f3360] to-[#164278] text-white border-blue-900 backface-hidden rotate-y-180">
                      {/* Top status inside card */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white/15 text-blue-200 border border-white/20">
                          {lang === 'km' ? 'ចម្លើយ & ការពន្យល់' : 'Answer & Explanation'}
                        </span>

                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {/* Difficulty Badge */}
                          {currentCard.difficulty && (
                            <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                              {currentCard.difficulty === 'easy' || currentCard.difficulty === 'ងាយ'
                                ? lang === 'km' ? 'កម្រិតងាយ' : 'Easy'
                                : currentCard.difficulty === 'hard' || currentCard.difficulty === 'ពិបាក'
                                ? lang === 'km' ? 'កម្រិតពិបាក' : 'Hard'
                                : lang === 'km' ? 'កម្រិតមធ្យម' : 'Medium'}
                            </span>
                          )}

                          <span className="text-xs font-bold text-white/70">
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
                                : 'bg-white/15 text-white/60 hover:text-emerald-300'
                            }`}
                            title={isMastered ? 'Mastered' : 'Mark as mastered'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Card Main Body Content (Back) */}
                      <div className="py-4 sm:py-6 text-center space-y-3 sm:space-y-4 overflow-y-auto max-h-[220px] sm:max-h-[260px]">
                        {currentCard.subjectName || currentCard.category ? (
                          <p className="text-xs font-bold tracking-wider uppercase text-blue-200">
                            {[currentCard.subjectName, currentCard.category].filter(Boolean).join(' • ')}
                          </p>
                        ) : null}

                        <p className="text-base sm:text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line text-white">
                          {/* Same KaTeX rendering as quizzes: handles $…$, bare LaTeX and keyboard math */}
                          <MathText text={currentCard.backText} />
                        </p>
                      </div>

                      {/* Bottom Prompt inside card */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div />

                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>{lang === 'km' ? 'ចុចដើម្បីបង្វិល' : 'Click to flip'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={cards.length <= 1}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{lang === 'km' ? 'កាតមុន' : 'Previous'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0a3263] hover:bg-[#082447] shadow-sm transition cursor-pointer active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>{lang === 'km' ? 'បង្វិលកាត' : 'Flip Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={cards.length <= 1}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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

            {/* Empty State fallback */}
            {!loading && cards.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">
                  {lang === 'km' ? 'មិនមានបណ្ណចងចាំទេ' : 'No flashcards found'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'km'
                    ? 'មិនទាន់មានបណ្ណចងចាំសម្រាប់វិញ្ញាសារនេះនៅឡើយទេ។'
                    : 'No flashcards available for this deck batch yet.'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewStep('deck-select')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0a3263] hover:bg-[#082447] transition cursor-pointer"
                  >
                    {lang === 'km' ? 'ត្រឡប់ទៅជ្រើសរើសវិញ្ញាសារ' : 'Back to Decks List'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
