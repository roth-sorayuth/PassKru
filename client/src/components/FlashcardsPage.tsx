import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { mockFlashcards } from '../data/mockData';
import { Flashcard } from '../types';
import {
  Sparkles,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FlashcardsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [cards, setCards] = useState<Flashcard[]>(mockFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  const currentCard = cards[currentIndex];
  const isMastered = masteredCards[currentCard.id];
  const masteredCount = Object.values(masteredCards).filter(Boolean).length;
  const progressPercent = Math.round((masteredCount / cards.length) * 100);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleToggleMastered = () => {
    const nextVal = !masteredCards[currentCard.id];
    setMasteredCards(prev => ({ ...prev, [currentCard.id]: nextVal }));
    if (nextVal) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{lang === 'km' ? 'បណ្ណចងចាំគរុកោសល្យឆ្លាតវៃ' : 'Pedagogy Quick Flashcards'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'បណ្ណចងចាំទ្រឹស្តី និងពាក្យគន្លឹះ' : 'Flashcards & Memory Boosters'}
        </h1>
        <p className="text-sm text-slate-600">
          {lang === 'km'
            ? 'ចុចលើបណ្ណដើម្បីត្រឡប់មើលការពន្យល់ និងគូសចំណាំបណ្ណដែលអ្នកបានចងចាំស្ទាត់។'
            : 'Click or tap on the card to flip and reveal the definition or solution. Mark mastered cards to track retention.'}
        </p>
      </div>

      {/* Progress & Counter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">
            {lang === 'km' ? `បណ្ណទី ${currentIndex + 1} នៃ ${cards.length}` : `Card ${currentIndex + 1} of ${cards.length}`}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
            {lang === 'km' ? currentCard.subjectKm : currentCard.subject}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-600">
            {masteredCount}/{cards.length} {lang === 'km' ? 'បានចាំស្ទាត់' : 'Mastered'}
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 min-h-[320px] sm:min-h-[360px] flex items-center justify-center">
        <div
          onClick={handleFlip}
          className={`w-full max-w-2xl min-h-[300px] sm:min-h-[340px] rounded-3xl p-8 sm:p-12 shadow-lg border cursor-pointer transition-all duration-500 transform flex flex-col justify-between select-none ${
            isFlipped
              ? 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white border-indigo-700'
              : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
          }`}
        >
          {/* Card Top Meta */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
              isFlipped ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {isFlipped ? (lang === 'km' ? 'ចម្លើយ / ការពន្យល់' : 'Answer / Solution') : (lang === 'km' ? 'សំណួរ / គោលគំនិត' : 'Prompt / Concept')}
            </span>

            <div className="flex items-center gap-1.5 text-xs font-medium opacity-70">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ចុចដើម្បីត្រឡប់' : 'Click to flip'}</span>
            </div>
          </div>

          {/* Card Main Body */}
          <div className="py-6 space-y-4">
            <h3 className={`text-lg sm:text-2xl font-extrabold leading-relaxed text-center ${
              isFlipped ? 'text-white whitespace-pre-line' : 'text-slate-900'
            }`}>
              {isFlipped
                ? (currentCard?.back?.[lang] || currentCard?.back?.km || '')
                : (currentCard?.front?.[lang] || currentCard?.front?.km || '')}
            </h3>

            {!isFlipped && currentCard?.hint && (
              <p className="text-center text-xs text-slate-400 italic">
                {lang === 'km'
                  ? `តម្រុយ៖ ${currentCard.hint?.[lang] || currentCard.hint?.km || ''}`
                  : `Hint: ${currentCard.hint?.[lang] || currentCard.hint?.km || ''}`}
              </p>
            )}
          </div>

          {/* Card Bottom Meta */}
          <div className="flex items-center justify-between text-xs opacity-80 pt-4 border-t border-slate-100/20">
            <span>{currentCard.category}</span>
            <span className="capitalize">{currentCard.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'មុន' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{lang === 'km' ? 'បន្ទាប់' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mastered toggle */}
        <button
          onClick={handleToggleMastered}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
            isMastered
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isMastered ? (lang === 'km' ? 'បានចងចាំស្ទាត់ (Mastered)' : 'Mastered!') : (lang === 'km' ? 'ចំណាំថាបានចាំស្ទាត់' : 'Mark as Mastered')}</span>
        </button>
      </div>
    </div>
  );
};
