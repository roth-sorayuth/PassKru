import React from 'react';

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
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage, isLoggedIn, setLoginModalOpen } = useApp();

  const handleStart = () => {
    if (isLoggedIn) {
      setCurrentPage('dashboard');
    } else {
      setLoginModalOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = () => {
    if (isLoggedIn) {
      setCurrentPage('learning');
    } else {
      setLoginModalOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPage = (page: ActivePage) => {
    if (isLoggedIn) {
      setCurrentPage(page);
    } else {
      setLoginModalOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero Slider Section */}
      <section className="relative h-[600px] w-full bg-[#0a0a0c] flex items-center overflow-hidden rounded-2xl">
        {/* Watercolor Teacher Image Background */}
        <img 
          src="/teacher.jpg" 
          alt="PassKru Teacher" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten"
        />
        {/* Smooth Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Slider Left Arrow */}
        <button className="absolute left-4 z-20 p-2 text-white/50 hover:text-white transition cursor-pointer">
          <ChevronLeft className="w-12 h-12 stroke-[1.5]" />
        </button>

        {/* Hero Content Overlay */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full z-10 text-white">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tight">
              PassKru
            </h1>
            <p className="text-xl sm:text-2xl text-slate-200 font-light leading-relaxed max-w-xl">
              centralize everything about teacher examination
            </p>
            <div className="pt-4">
              <button 
                onClick={handleStart}
                className="px-8 py-3.5 rounded-full bg-[#ff0000] hover:bg-red-700 text-white font-bold text-sm tracking-wide transition cursor-pointer shadow-lg shadow-red-600/20 uppercase"
              >
                Shop now
              </button>
            </div>
          </div>
        </div>

        {/* Slider Right Arrow */}
        <button className="absolute right-4 z-20 p-2 text-white/50 hover:text-white transition cursor-pointer">
          <ChevronRight className="w-12 h-12 stroke-[1.5]" />
        </button>
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
