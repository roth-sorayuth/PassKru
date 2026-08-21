import React from 'react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp, ActivePage } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Target,
  FileCheck2,
  Users,
  Flame,
  Star,
  BrainCircuit,
  Clock,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage } = useApp();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useAuth();

  const handleStart = () => {
    if (isSignedIn) {
      setCurrentPage('dashboard');
    } else {
      openSignIn();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = () => {
    if (isSignedIn) {
      setCurrentPage('learning');
    } else {
      openSignIn();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPage = (page: ActivePage) => {
    if (isSignedIn) {
      setCurrentPage(page);
    } else {
      openSignIn();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-20 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-300/30 via-blue-200/20 to-purple-300/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* National Exam Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>
                {lang === 'km'
                  ? 'វេទិកាត្រៀមប្រឡងគ្រូ NIE, RTTC, PTTC និង មត្តេយ្យ ឆ្នាំ២០២៦'
                  : 'Teacher Exam Prep 2026: NIE, RTTC, PTTC & Kindergarten'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.25]">
              {lang === 'km' ? (
                <>
                  ត្រៀមប្រឡងគ្រូបង្រៀនជាតិ <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                    កាន់តែឆ្លាតវៃ និងមានទំនុកចិត្ត
                  </span>
                </>
              ) : (
                <>
                  Prepare Smarter for Your <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                    National Teacher Examination
                  </span>
                </>
              )}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {lang === 'km'
                ? 'PassKru ប្រមូលផ្តុំព័ត៌មានប្រឡងផ្លូវការ វិញ្ញាសាចាស់ៗជាមួយចម្លើយពន្យល់ លំហាត់អនុវត្ត ការប្រឡងសាកល្បង និងផែនការសិក្សា AI ចូលក្នុងវេទិកាតែមួយ ងាយស្រួលប្រើប្រាស់។'
                : 'PassKru brings official exam updates, past papers with full solutions, interactive practice quizzes, realistic mock tests, and personalized study plans into one simple platform.'}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>{t('btnStartPrep')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-base border border-slate-300 shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{t('btnExploreResources')}</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'km' ? 'វិញ្ញាសាស្របតាមក្រសួង MoEYS' : 'Official MoEYS curriculum'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'km' ? 'ឥតគិតថ្លៃសម្រាប់បេក្ខជនទាំងអស់' : 'Free access for candidates'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'km' ? 'គាំទ្រភាសាខ្មែរ ១០០%' : '100% Full Khmer support'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Hero Card Mockup */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
            <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-500 ml-2 font-mono">
                  passkru.edu.kh/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>14-Day Streak</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{lang === 'km' ? 'ថ្ងៃនៅសល់' : 'Exam Countdown'}</span>
                    <Clock className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">៦៧ ថ្ងៃ <span className="text-xs font-normal text-slate-500">(25 តុលា)</span></p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[65%]" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{lang === 'km' ? 'ពិន្ទុ Mock ចុងក្រោយ' : 'Latest Mock Score'}</span>
                    <Award className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-emerald-600">៨៤% <span className="text-xs font-normal text-slate-500">(42/50)</span></p>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% {lang === 'km' ? 'ធៀបនឹងសប្តាហ៍មុន' : 'vs last week'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{lang === 'km' ? 'សំណួរដែលបានអនុវត្ត' : 'Questions Mastered'}</span>
                    <Target className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-black text-blue-600">២៤៨ <span className="text-xs font-normal text-slate-500">សំណួរ</span></p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {lang === 'km' ? 'ភាពត្រឹមត្រូវមធ្យម ៧៨%' : '78% Accuracy Average'}
                  </p>
                </div>
              </div>

              {/* Sample question preview in hero */}
              <div className="bg-indigo-900/5 rounded-xl p-4 sm:p-5 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
                      {lang === 'km' ? 'កិច្ចការថ្ងៃនេះ' : "Today's Task"}
                    </span>
                    <span className="text-xs text-indigo-900 font-semibold">
                      {lang === 'km' ? 'គរុកោសល្យ & ចិត្តវិទ្យាអប់រំ' : 'Pedagogy & Psychology'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {lang === 'km'
                      ? 'វិភាគទ្រឹស្តីស្ថាបនានិយមរបស់ Piaget & Vygotsky ក្នុងការគ្រប់គ្រងថ្នាក់រៀន'
                      : 'Piaget & Vygotsky Constructivism Theory for Classroom Management'}
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm shrink-0 transition"
                >
                  {lang === 'km' ? 'បន្តរៀន' : 'Continue Study'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Candidates / Exams Strip */}
      <section className="bg-slate-100 py-10 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            {lang === 'km'
              ? 'គាំទ្រគ្រប់ក្របខណ្ឌប្រឡងគ្រូទូទាំងប្រទេសកម្ពុជា'
              : 'Supporting All Cambodian Teacher Candidate Categories'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🏛️</span>
              <h4 className="font-bold text-sm text-slate-900">NIE (គ្រូវិទ្យាល័យ)</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {lang === 'km' ? 'គ្រូមធ្យមសិក្សាទុតិយភូមិ (បរិញ្ញាបត្រ+១)' : 'Upper Secondary Level'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🏫</span>
              <h4 className="font-bold text-sm text-slate-900">RTTC (គ្រូអនុ)</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {lang === 'km' ? 'គ្រូមធ្យមសិក្សាបឋមភូមិ (១២+២)' : 'Lower Secondary Level'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🎒</span>
              <h4 className="font-bold text-sm text-slate-900">PTTC (គ្រូបឋម)</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {lang === 'km' ? 'គ្រូបង្រៀនកម្រិតបឋមសិក្សា (១២+២)' : 'Primary School Level'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🧸</span>
              <h4 className="font-bold text-sm text-slate-900">មត្តេយ្យសិក្សា</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {lang === 'km' ? 'គ្រូបង្រៀនកម្រិតមត្តេយ្យ (១២+២)' : 'Early Childhood Level'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why PassKru Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {t('whyPassKruTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t('whyPassKruSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('benefit1Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('benefit1Desc')}</p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('benefit2Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('benefit2Desc')}</p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('benefit3Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('benefit3Desc')}</p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('benefit4Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('benefit4Desc')}</p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('benefit5Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('benefit5Desc')}</p>
          </div>

          {/* Benefit 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('benefit6Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('benefit6Desc')}</p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white py-16 sm:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              {lang === 'km' ? 'ដំណើរការត្រៀមប្រឡង' : 'Preparation Workflow'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t('howItWorksTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 hover:bg-white/15 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-xl font-black text-white shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-white">{t('step1Title')}</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">{t('step1Desc')}</p>
              <ul className="text-xs text-indigo-200 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'km' ? 'សង្ខេបទ្រឹស្តីគរុកោសល្យ' : 'Pedagogical summaries'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'km' ? 'បណ្ណចងចាំ Flashcards' : 'Quick review flashcards'}</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 hover:bg-white/15 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-xl font-black text-white shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-white">{t('step2Title')}</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">{t('step2Desc')}</p>
              <ul className="text-xs text-indigo-200 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'km' ? 'វិញ្ញាសាចាស់ៗ ២០១៨-២០២៥' : 'Past papers archive'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'km' ? 'ប្រឡងសាកល្បង Mock Exam' : 'Timed mock exam simulation'}</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 hover:bg-white/15 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-xl font-black text-white shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-white">{t('step3Title')}</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">{t('step3Desc')}</p>
              <ul className="text-xs text-indigo-200 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'km' ? 'វិភាគចំណុចខ្សោយស្វ័យប្រវត្តិ' : 'Automated weak area diagnostics'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'km' ? 'ពិគ្រោះយោបល់ជាមួយគ្រូបង្វឹក' : 'Verified mentor coaching'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Platform Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {lang === 'km' ? 'លក្ខណៈពិសេសចម្បង' : 'Core Capabilities'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {lang === 'km' ? '៣ ផ្នែកសំខាន់សម្រាប់ជោគជ័យរបស់អ្នក' : '3 Pillars Built for Your Exam Success'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {lang === 'km' ? '១. មជ្ឈមណ្ឌលព័ត៌មានប្រឡង' : '1. Exam Information Hub'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'km'
                ? 'ព័ត៌មានលម្អិតអំពីកាលបរិច្ឆេទប្រឡង លក្ខខណ្ឌជ្រើសរើស ឯកសារតម្រូវ និងសេចក្តីប្រកាសផ្លូវការពីក្រសួងអប់រំ យុវជន និងកីឡា។'
                : 'Centralized registry of verified MoEYS announcements, registration deadlines, required documents, and provincial intake quotas.'}
            </p>
            <button
              onClick={() => handleNavigateToPage('exam-info')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'km' ? 'ស្វែងយល់បន្ថែម' : 'Learn more'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {lang === 'km' ? '២. បណ្ណាល័យឌីជីថល & លំហាត់' : '2. Digital Learning & Practice'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'km'
                ? 'រាប់ពាន់សំណួរវិញ្ញាសា គរុកោសល្យ ចិត្តវិទ្យា វប្បធម៌ទូទៅ និងមុខវិជ្ជាឯកទេស ជាមួយចម្លើយពន្យល់ និងការប្រឡងសាកល្បងកំណត់ពេល។'
                : 'Thousands of curated questions across pedagogy, psychology, general knowledge, and specialized subjects with instant solution keys.'}
            </p>
            <button
              onClick={() => handleNavigateToPage('practice')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'km' ? 'សាកល្បងលំហាត់' : 'Try sample practice'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {lang === 'km' ? '៣. ផែនការសិក្សាផ្ទាល់ខ្លួន' : '3. Personalized Preparation'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'km'
                ? 'ប្រព័ន្ធឆ្លាតវៃរៀបចំកាលវិភាគប្រចាំថ្ងៃ តាមដានចំណុចខ្សោយ និងផ្តល់អនុសាសន៍រៀនជាក់លាក់ដើម្បីធានាអត្រាប្រឡងជាប់ខ្ពស់បំផុត។'
                : 'Intelligent daily task generators that diagnose your weak subject areas and deliver actionable revision recommendations.'}
            </p>
            <button
              onClick={() => handleNavigateToPage('study-plan')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'km' ? 'បង្កើតផែនការសិក្សា' : 'Generate study plan'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              {lang === 'km'
                ? 'ត្រៀមខ្លួនឱ្យរួចរាល់សម្រាប់ថ្ងៃប្រឡងគ្រូ ២០២៦!'
                : 'Ready to Conquer Your National Teacher Exam 2026?'}
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
              {lang === 'km'
                ? 'ចូលរួមជាមួយបេក្ខជនរាប់ពាន់នាក់នៅទូទាំងប្រទេសកម្ពុជា។ ចាប់ផ្តើមរៀន និងអនុវត្តដោយឥតគិតថ្លៃថ្ងៃនេះ។'
                : 'Join thousands of teacher candidates across Cambodia. Start mastering past papers, mock exams, and personalized plans today.'}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-base shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>{t('btnStartPrep')}</span>
              </button>
              <button
                onClick={() => handleNavigateToPage('mock-exam')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-base border border-indigo-400/40 transition cursor-pointer"
              >
                {t('btnTryMockExam')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
