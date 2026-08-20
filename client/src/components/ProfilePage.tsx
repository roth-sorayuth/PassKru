import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { ExamTarget } from '../types';
import {
  User,
  Award,
  Globe,
  Clock,
  Bookmark,
  CheckCircle2,
  Sliders,
  Flame,
  Layers,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const {
    userProfile,
    setUserProfile,
    bookmarkedQuestionIds,
    setCurrentPage
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [targetExam, setTargetExam] = useState<ExamTarget>(userProfile.targetExam);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(userProfile.dailyGoalMinutes);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      email,
      targetExam,
      dailyGoalMinutes,
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const targetExamOptions = [
    { id: 'nie', label: '🏛️ NIE (គ្រូមធ្យមសិក្សាទុតិយភូមិ)' },
    { id: 'rttc', label: '🏫 RTTC (គ្រូមធ្យមសិក្សាបឋមភូមិ)' },
    { id: 'pttc', label: '🎒 PTTC (គ្រូបឋមសិក្សា)' },
    { id: 'kindergarten', label: '🧸 សាលាគរុកោសល្យមត្តេយ្យ' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-indigo-100">
          {userProfile.name.charAt(0)}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{userProfile.name}</h1>
        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
          {lang === 'km' ? `បេក្ខជនត្រៀមប្រឡង ${userProfile.targetExam.toUpperCase()} ២០២៦` : `Candidate for ${userProfile.targetExam.toUpperCase()} 2026`}
        </p>
      </div>

      {/* Lifetime Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-500">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold">{t('studyStreak')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{userProfile.streakDays} {lang === 'km' ? 'ថ្ងៃ' : 'd'}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-indigo-600">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold">{lang === 'km' ? 'លំហាត់បានធ្វើ' : 'Solved'}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{userProfile.completedQuestions}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-emerald-600">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold">{lang === 'km' ? 'ពិន្ទុ Mock' : 'Mock Avg'}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">84%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">{lang === 'km' ? 'ម៉ោងរៀនសរុប' : 'Hours'}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{userProfile.studyHoursTotal}h</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>{lang === 'km' ? 'ព័ត៌មានផ្ទាល់ខ្លួន & ការកំណត់' : 'Candidate Information & Preferences'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'អ៊ីមែល ឬ លេខទូរស័ព្ទ' : 'Email Address'}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
            />
          </div>

          {/* Target Exam */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'ក្របខណ្ឌប្រឡងគ្រូគោលដៅ' : 'Target Teacher Exam'}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {targetExamOptions.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setTargetExam(opt.id as ExamTarget)}
                  className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center justify-between ${
                    targetExam === opt.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {targetExam === opt.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Study Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'គោលដៅរៀនប្រចាំថ្ងៃ' : 'Daily Study Time Goal'}</label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 90].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyGoalMinutes(mins)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    dailyGoalMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mins} {lang === 'km' ? 'នាទី' : 'mins'}
                </button>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'ភាសាបង្ហាញក្នុងកម្មវិធី' : 'Display Language'}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang('km')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  lang === 'km'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🇰🇭 ភាសាខ្មែរ (Khmer)
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>

        {/* Bookmarked Questions Shortcut */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-amber-600 fill-amber-600" />
            <div>
              <p className="text-xs font-bold text-amber-900">{lang === 'km' ? 'សំណួរដែលបានចំណាំទុក' : 'Saved / Bookmarked Questions'}</p>
              <p className="text-[11px] text-amber-700">{bookmarkedQuestionIds.length} {lang === 'km' ? 'សំណួរត្រូវបានរក្សាទុក' : 'questions saved for revision'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage('practice')}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition"
          >
            {lang === 'km' ? 'ចូលហាត់' : 'Review'}
          </button>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!' : 'Changes saved successfully!'}</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {lang === 'km' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
