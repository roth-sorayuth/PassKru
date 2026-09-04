import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ExamTarget } from '../../types';
import { updateProfile } from '../../services/authService';
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
  RotateCcw,
  LogOut,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const {
    userProfile,
    setUserProfile,
    bookmarkedQuestionIds,
    setCurrentPage,
    logoutUser
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [targetExam, setTargetExam] = useState<ExamTarget>(userProfile.targetExam);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(userProfile.dailyGoalMinutes);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Saving a new target exam / daily goal does NOT rewrite an existing study
  // plan — the two surfaces would otherwise silently disagree forever. We
  // surface an opt-in prompt instead of regenerating behind the user's back.
  const [showRegeneratePrompt, setShowRegeneratePrompt] = useState(false);

  const goRegenerateStudyPlan = () => {
    try {
      // StudyPlanPage reads and clears this on mount to open its wizard.
      sessionStorage.setItem('passkru_open_study_plan_wizard', '1');
    } catch {
      // Blocked storage just means the wizard won't auto-open; the page still
      // loads and "Adjust Course Settings" is one click away.
    }
    setShowRegeneratePrompt(false);
    setCurrentPage('study-plan');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const courseSettingsChanged =
      targetExam !== userProfile.targetExam ||
      dailyGoalMinutes !== userProfile.dailyGoalMinutes;

    const trimmed = name.trim();
    const spaceIndex = trimmed.indexOf(' ');
    const firstName = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
    const lastName = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1);

    try {
      await updateProfile({
        firstName,
        lastName,
        dailyGoalMinutes,
        // Send the track code and let the server resolve the row — the old
        // hardcoded 1/2/3 ids don't exist in this database and the write
        // failed the foreign key.
        targetExamCode: targetExam,
      });

      setUserProfile(prev => ({
        ...prev,
        name,
        targetExam,
        dailyGoalMinutes,
      }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      if (courseSettingsChanged) setShowRegeneratePrompt(true);
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      setSaveError(err?.message || (lang === 'km' ? 'មិនអាចរក្សាទុកបានទេ សូមព្យាយាមម្តងទៀត' : 'Could not save your changes. Please try again.'));
    } finally {
      setSaving(false);
    }
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
      <div className="relative max-w-2xl mx-auto">
        <button
          type="button"
          onClick={logoutUser}
          className="absolute right-0 top-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ចាកចេញ' : 'Sign Out'}</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-indigo-100 overflow-hidden">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              userProfile.name.charAt(0)
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{userProfile.name}</h1>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
            {lang === 'km' ? `បេក្ខជនត្រៀមប្រឡង ${userProfile.targetExam.toUpperCase()} ២០២៦` : `Candidate for ${userProfile.targetExam.toUpperCase()} 2026`}
          </p>
        </div>
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
          <p className="text-2xl font-black text-slate-900">{Math.round(userProfile.averageScore)}%</p>
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

          {/* Email (read-only — identity is managed by sign-in, not editable here) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'អ៊ីមែល' : 'Email Address'}</label>
            <input
              type="email"
              value={userProfile.email}
              readOnly
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none font-medium cursor-not-allowed"
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
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!' : 'Changes saved successfully!'}</span>
            </span>
          )}
          {saveError && (
            <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {lang === 'km' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}
          </button>
        </div>

        {/* Course settings changed → offer to regenerate the study plan.
            Never automatic: the existing plan holds real progress. */}
        {showRegeneratePrompt && (
          <div className="p-4 rounded-2xl bg-[#0a3263]/[0.06] border border-[#0a3263]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3 min-w-0">
              <Sliders className="w-5 h-5 text-[#0a3263] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0a3263]">
                  {lang === 'km'
                    ? 'ការកំណត់វគ្គសិក្សារបស់អ្នកបានផ្លាស់ប្តូរ — បង្កើតផែនការសិក្សាឡើងវិញ?'
                    : 'Your course settings changed — regenerate your study plan?'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {lang === 'km'
                    ? 'ផែនការបច្ចុប្បន្នរបស់អ្នកនៅដដែល រហូតទាល់តែអ្នកបង្កើតវាឡើងវិញ។'
                    : 'Your existing plan stays as-is until you regenerate it.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setShowRegeneratePrompt(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
              >
                {lang === 'km' ? 'ពេលក្រោយ' : 'Not now'}
              </button>
              <button
                type="button"
                onClick={goRegenerateStudyPlan}
                className="px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{lang === 'km' ? 'បង្កើតឡើងវិញ' : 'Update my plan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
