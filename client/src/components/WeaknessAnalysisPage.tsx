import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockWeakAreas } from '../data/mockData';
import { WeakArea } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Play,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  TrendingDown,
  Target
} from 'lucide-react';

export const WeaknessAnalysisPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { weakAreas, startQuizById, setCurrentPage, startMockExamById } = useApp();

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          label: { km: 'អាទិភាពខ្ពស់បំផុត', en: 'High Priority' },
          style: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      case 'medium':
        return {
          label: { km: 'អាទិភាពមធ្យម', en: 'Medium Priority' },
          style: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      default:
        return {
          label: { km: 'អាទិភាពទាប', en: 'Low Priority' },
          style: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{lang === 'km' ? 'ប្រព័ន្ធវិភាគចំណុចខ្សោយឆ្លាតវៃ' : 'AI Diagnostic Weakness Analysis'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'វិភាគចំណុចខ្សោយ & អនុសាសន៍កែលម្អ' : 'Weak Area Analysis & Action Plan'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'ប្រព័ន្ធវិភាគលើលទ្ធផលធ្វើលំហាត់ជាក់ស្តែង និងណែនាំដំណោះស្រាយត្រង់គោលដៅដើម្បីបិទគម្លាតចំណេះដឹង។'
            : 'Pinpoint exact conceptual blind spots and receive targeted study prescriptions to maximize exam scores.'}
        </p>
      </div>

      {/* Actionable Recommendations Hub Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            {lang === 'km' ? 'អនុសាសន៍សកម្មភាពថ្ងៃនេះ (Actionable Recommendations)' : "Today's Actionable Recommendations"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => startQuizById('quiz-psy-01')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/15 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-300">1. {lang === 'km' ? 'ធ្វើលំហាត់ ១០ សំណួរ' : 'Practice 10 Qs'}</span>
              <p className="text-xs font-semibold text-white">
                {lang === 'km' ? 'ចិត្តវិទ្យាអភិវឌ្ឍន៍ Piaget' : 'Piaget Developmental Theory'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 pt-2">
              <span>{lang === 'km' ? 'ចាប់ផ្តើមឥឡូវ' : 'Start now'}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setCurrentPage('learning')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/15 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-300">2. {lang === 'km' ? 'អានសង្ខេបជំពូកទី ៣' : 'Review Chapter 3'}</span>
              <p className="text-xs font-semibold text-white">
                {lang === 'km' ? 'វិធីសាស្ត្របង្រៀនសកម្ម' : 'Active Teaching Methods'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 pt-2">
              <span>{lang === 'km' ? 'អានមេរៀន' : 'Read notes'}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setCurrentPage('flashcards')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/15 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-300">3. {lang === 'km' ? 'រំលឹកបណ្ណចងចាំ' : 'Review Flashcards'}</span>
              <p className="text-xs font-semibold text-white">
                {lang === 'km' ? 'ពាក្យគន្លឹះ Bloom\'s Taxonomy' : 'Bloom\'s Taxonomy Terms'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 pt-2">
              <span>{lang === 'km' ? 'រំលឹក ៥ នាទី' : '5 mins review'}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => startMockExamById('mock-nie-2026-01')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/15 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-300">4. {lang === 'km' ? 'ប្រឡងសាកល្បង Mock' : 'Take Mock Exam'}</span>
              <p className="text-xs font-semibold text-white">
                {lang === 'km' ? 'វិញ្ញាសាវប្បធម៌ទូទៅ ៤៥ នាទី' : 'General Culture 45m Test'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-300 pt-2">
              <span>{lang === 'km' ? 'ចូលរួមប្រឡង' : 'Enter Exam'}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized Weak Areas List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          {lang === 'km' ? 'បញ្ជីប្រធានបទខ្សោយ (រៀបតាមលំដាប់អាទិភាព)' : 'Prioritized Weak Topics (High to Low Priority)'}
        </h2>

        <div className="space-y-4">
          {weakAreas.map(weak => {
            const priorityBadge = getPriorityBadge(weak.priority);
            return (
              <div
                key={weak.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityBadge.style}`}>
                      {priorityBadge.label[lang]}
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {lang === 'km' ? weak.subjectKm : weak.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 font-medium">
                      {weak.failedQuestionsCount} {lang === 'km' ? 'សំណួរឆ្លើយខុស' : 'incorrect attempts'}
                    </span>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      {weak.accuracyRate}% {lang === 'km' ? 'ភាពត្រឹមត្រូវ' : 'accuracy'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {lang === 'km' ? weak.topicKm : weak.topic}
                  </h3>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'km' ? 'អនុសាសន៍ដំណោះស្រាយជាក់លាក់៖' : 'Actionable Recommendation:'}</span>
                    </span>
                    <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                      {weak.recommendation[lang]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => startQuizById(weak.actionQuizId || 'quiz-psy-01')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'km' ? 'អនុវត្តកែលម្អប្រធានបទនេះ' : 'Practice & Fix Topic'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
