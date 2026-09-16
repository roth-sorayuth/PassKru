import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { updateProfile } from '../../services/authService';
import { expandSubjectSelection, getExamCategoryLabel } from '../../data/examSelectionData';
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
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const {
    userProfile,
    setUserProfile,
    setCurrentPage,
    logoutUser,
    openExamSelection,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(userProfile.dailyGoalMinutes);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Saving a new daily goal surfaces an opt-in prompt to update course
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

    const courseSettingsChanged = dailyGoalMinutes !== userProfile.dailyGoalMinutes;

    const trimmed = name.trim();
    const spaceIndex = trimmed.indexOf(' ');
    const firstName = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
    const lastName = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1);

    try {
      await updateProfile({
        firstName,
        lastName,
        dailyGoalMinutes,
        targetExamCode: userProfile.targetExam,
      });

      setUserProfile(prev => ({
        ...prev,
        name,
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
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0f3360] to-[#1e4e8c] text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-blue-100 overflow-hidden">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            ) : (
              userProfile.name.charAt(0)
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{userProfile.name}</h1>
          <p className="text-xs text-[#0f3360] font-bold tracking-wider">
            {lang === 'km'
              ? `បេក្ខជនត្រៀមប្រឡង ${userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, 'km')} ២០២៦`
              : `Candidate for ${userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, 'en')} 2026`}
          </p>
        </div>
      </div>

      {/* Lifetime Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-500">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold text-slate-700">{t('studyStreak')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{userProfile.streakDays} {lang === 'km' ? 'ថ្ងៃ' : 'd'}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[#0f3360]">
            <Layers className="w-4 h-4 text-[#0f3360]" />
            <span className="text-xs font-bold text-slate-700">{lang === 'km' ? 'លំហាត់បានធ្វើ' : 'Solved'}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{userProfile.completedQuestions}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-emerald-600">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">{lang === 'km' ? 'ពិន្ទុ Mock' : 'Mock Avg'}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{Math.round(userProfile.averageScore)}%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-blue-600">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">{lang === 'km' ? 'ម៉ោងរៀនសរុប' : 'Hours'}</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{userProfile.studyHoursTotal}h</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#0f3360]" />
          <span>{lang === 'km' ? 'ព័ត៌មានផ្ទាល់ខ្លួន & ការកំណត់' : 'Candidate Information & Preferences'}</span>
        </h2>

        {/* Active Track and Selected Subjects Box */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
            </h3>
            {userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {expandSubjectSelection(userProfile.selectedSubjects || [], lang).map((subj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    {subj}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => openExamSelection()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer self-start sm:self-center shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌប្រឡង' : 'Change Exam Category'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f3360]/15 focus:border-[#0f3360] outline-none font-medium"
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
                      ? 'bg-[#0f3360] text-white border-[#0f3360] shadow-xs'
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
            <label className="text-xs font-bold text-slate-700">ភាសាបង្ហាញក្នុងកម្មវិធី (App Language)</label>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#0f3360] flex items-center justify-between shadow-2xs">
              <span>🇰🇭 ភាសាខ្មែរ (Khmer - ភាសាផ្លូវការ)</span>
              <span className="px-2 py-0.5 bg-[#0f3360] text-white text-[10px] rounded-md font-bold">កំណត់ដើម</span>
            </div>
          </div>
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
            className="ml-auto px-6 py-3 rounded-2xl bg-[#0f3360] hover:bg-[#0a274c] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {lang === 'km' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}
          </button>
        </div>

        {/* Course settings changed → offer to regenerate the study plan.
            Never automatic: the existing plan holds real progress. */}
        {showRegeneratePrompt && (
          <div className="p-4 rounded-2xl bg-[#0f3360]/[0.06] border border-[#0f3360]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3 min-w-0">
              <Sliders className="w-5 h-5 text-[#0f3360] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0f3360]">
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
                className="px-4 py-2 rounded-xl bg-[#0f3360] hover:bg-[#0a274c] text-white text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
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
