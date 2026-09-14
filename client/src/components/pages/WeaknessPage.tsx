import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  getWeakAreas,
  WeakAreaApi,
  StrengthAreaApi,
  WeaknessAnalysisResponse,
} from '../../services/weaknessService';
import {
  AlertTriangle,
  Target,
  TrendingDown,
  BookOpen,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  Layers,
} from 'lucide-react';

const SEVERITY_STYLES: Record<string, { badge: string; bar: string }> = {
  high: { badge: 'bg-red-50 text-red-700 border-red-200', bar: 'bg-red-500' },
  medium: { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' },
  low: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
};

const SEVERITY_LABEL: Record<string, { km: string; en: string }> = {
  high: { km: 'ខ្សោយខ្លាំង', en: 'High Priority' },
  medium: { km: 'មធ្យម', en: 'Medium Priority' },
  low: { km: 'តិចតួច', en: 'Low Priority' },
};

export const WeaknessPage: React.FC = () => {
  const { lang } = useLanguage();
  const { startQuizById, setCurrentPage } = useApp();

  const [analysisData, setAnalysisData] = useState<WeaknessAnalysisResponse | null>(null);
  const [weakAreas, setWeakAreas] = useState<WeakAreaApi[]>([]);
  const [strengths, setStrengths] = useState<StrengthAreaApi[]>([]);
  const [activeTab, setActiveTab] = useState<'weakness' | 'strength'>('weakness');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWeakAreas();
      if (res?.success) {
        setAnalysisData(res);
        setWeakAreas(Array.isArray(res.weakAreas) ? res.weakAreas : []);
        setStrengths(Array.isArray(res.strengths) ? res.strengths : []);
      } else {
        setAnalysisData(null);
        setWeakAreas([]);
        setStrengths([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch weakness analysis:', err);
      setError(err?.message || 'Could not load weakness analysis from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const highCount = weakAreas.filter((w) => w.priority === 'high').length;
  const mediumCount = weakAreas.filter((w) => w.priority === 'medium').length;
  const hasActivePlan = analysisData?.hasActivePlan ?? true;
  const currentPlan = analysisData?.plan;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back to Dashboard Navigation */}
      <div>
        <button
          type="button"
          onClick={() => setCurrentPage('dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-slate-500 group-hover:text-slate-900" />
          <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <TrendingDown className="w-4 h-4" />
          <span>{lang === 'km' ? 'ការវិភាគចំណុចខ្សោយ និងចំណុចខ្លាំង' : 'Strength & Weakness Analysis'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'ចំណុចខ្សោយ និងចំណុចខ្លាំង' : 'Strengths & Areas to Strengthen'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'វិភាគផ្អែកលើផែនការសិក្សាបច្ចុប្បន្នរបស់អ្នក តាមរយៈលទ្ធផលកម្រងសំណួរ និងការប្រឡងសាកល្បង។'
            : 'Analyzed strictly based on your current active study plan from quiz and mock exam attempts.'}
        </p>

        {/* Current Active Plan Badge */}
        {currentPlan && (
          <div className="pt-2">
            <div className="inline-flex max-w-full items-start sm:items-center gap-2 px-3 sm:px-4 py-1.5 rounded-2xl sm:rounded-full bg-[#0a3263]/5 border border-[#0a3263]/20 text-[#0a3263] text-xs font-bold shadow-2xs break-words">
              <Layers className="w-3.5 h-3.5 text-[#0a3263] shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-snug">
                {lang === 'km' ? 'ផែនការសិក្សាបច្ចុប្បន្ន៖ ' : 'Current Plan: '}
                <span className="text-slate-900 font-extrabold">
                  {Array.isArray(currentPlan.targetSubjects)
                    ? currentPlan.targetSubjects
                        .map((s: any) => (typeof s === 'string' ? s : s?.km || s?.name || s?.key || ''))
                        .filter(Boolean)
                        .join(', ')
                    : ''}
                  {currentPlan.examName ? ` (${currentPlan.examName})` : ''}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* No Active Plan State */}
      {!loading && !error && !hasActivePlan && (
        <div className="p-6 sm:p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">
            {lang === 'km' ? 'មិនទាន់មានផែនការសិក្សាសកម្មនៅឡើយទេ' : 'No Active Study Plan Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {lang === 'km'
              ? 'ការវិភាគចំណុចខ្សោយ និងចំណុចខ្លាំងត្រូវបានបង្កើតឡើងផ្អែកលើផែនការសិក្សាបច្ចុប្បន្នរបស់អ្នក។ សូមបង្កើត ឬបើកដំណើរការផែនការសិក្សាដើម្បីចាប់ផ្តើម។'
              : 'Strength and weakness analysis is scoped to your active study plan. Please create or activate a study plan to start analyzing your performance.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentPage('study-plan')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0a3263] hover:bg-[#082447] shadow-sm transition cursor-pointer"
            >
              <span>{lang === 'km' ? 'ទៅកាន់ផែនការសិក្សា' : 'Go to Study Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Summary strip */}
      {!loading && !error && hasActivePlan && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-4 text-center shadow-2xs">
            <p className="text-lg sm:text-2xl font-black text-slate-900">{weakAreas.length}</p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 sm:mt-1 leading-tight">
              {lang === 'km' ? 'ចំណុចខ្សោយសរុប' : 'Total Weak Topics'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-red-200 p-2.5 sm:p-4 text-center shadow-2xs">
            <p className="text-lg sm:text-2xl font-black text-red-600">{highCount}</p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 sm:mt-1 leading-tight">
              {lang === 'km' ? 'ខ្សោយខ្លាំង' : 'High Priority'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-200 p-2.5 sm:p-4 text-center shadow-2xs">
            <p className="text-lg sm:text-2xl font-black text-emerald-600">{strengths.length}</p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 sm:mt-1 leading-tight">
              {lang === 'km' ? 'ចំណុចខ្លាំង / ស្ទាត់' : 'Strengths / Mastered'}
            </p>
          </div>
        </div>
      )}

      {/* Controls: Tabs & Refresh Button */}
      {!loading && !error && hasActivePlan && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-200 pb-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('weakness')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'weakness'
                  ? 'bg-white text-red-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'km' ? 'ចំណុចខ្សោយ' : 'Weaknesses'}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'weakness' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {weakAreas.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('strength')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'strength'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{lang === 'km' ? 'ចំណុចខ្លាំង' : 'Strengths'}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'strength' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {strengths.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => fetchAnalysis()}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{lang === 'km' ? 'ធ្វើឲ្យទាន់សម័យ' : 'Refresh'}</span>
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-red-800">
            {lang === 'km' ? 'មិនអាចទាញយកទិន្នន័យបានទេ' : 'Failed to load weakness analysis'}
          </h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={() => fetchAnalysis()}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            {lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
          </button>
        </div>
      )}

      {/* TAB CONTENT: WEAKNESSES */}
      {!loading && !error && hasActivePlan && activeTab === 'weakness' && (
        <>
          {weakAreas.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {lang === 'km' ? 'មិនមានចំណុចខ្សោយក្នុងផែនការសិក្សានេះទេ ល្អណាស់!' : 'No Weak Areas in This Study Plan — Great Job!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'km'
                  ? 'អ្នកបានបំពេញការងារបានយ៉ាងល្អលើគ្រប់ប្រធានបទនៃផែនការសិក្សានេះ។ បន្តអនុវត្តកម្រងសំណួរដើម្បីរក្សាភាពស្ទាត់ជំនាញ។'
                  : 'You have performed very well across all topics in this study plan. Continue practicing to maintain your mastery.'}
              </p>
              <button
                onClick={() => setCurrentPage('practice')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
              >
                {lang === 'km' ? 'ចាប់ផ្តើមអនុវត្ត' : 'Start Practicing'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {weakAreas.map((w) => {
                const severity = w.priority || w.severityLevel || 'low';
                const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.low;
                const label = SEVERITY_LABEL[severity] || SEVERITY_LABEL.low;
                const accuracy = w.accuracyRate !== null ? Math.round(w.accuracyRate) : null;

                return (
                  <div
                    key={w.weakAreaId}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.badge}`}>
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{label[lang]}</span>
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                          {w.topicName || (lang === 'km' ? 'មេរៀន' : 'Topic')}
                        </h3>
                        {w.subjectName && (
                          <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{w.subjectName}</span>
                          </p>
                        )}
                      </div>

                      {accuracy !== null && (
                        <div className="text-right shrink-0">
                          <p className="text-xl sm:text-2xl font-black text-slate-900">{accuracy}%</p>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">
                            {lang === 'km' ? 'ភាពត្រឹមត្រូវ' : 'Accuracy'}
                          </p>
                        </div>
                      )}
                    </div>

                    {accuracy !== null && (
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${style.bar}`}
                          style={{ width: `${Math.min(100, Math.max(0, accuracy))}%` }}
                        />
                      </div>
                    )}

                    {w.recommendation && (
                      <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 leading-relaxed">
                        {w.recommendation}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {w.failedQuestionsCount} {lang === 'km' ? 'សំណួរខុស' : 'questions missed'}
                      </span>

                      {w.actionQuizId && (
                        <button
                          onClick={() => startQuizById(w.actionQuizId as number)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0a3263] hover:bg-[#082447] shadow-xs transition cursor-pointer"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>{lang === 'km' ? 'អនុវត្តឥឡូវនេះ' : 'Practice Now'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB CONTENT: STRENGTHS */}
      {!loading && !error && hasActivePlan && activeTab === 'strength' && (
        <>
          {strengths.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
              <Award className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {lang === 'km' ? 'មិនទាន់មានប្រធានបទស្ទាត់ជំនាញ (៧០% ឡើងទៅ) នៅឡើយទេ' : 'No Mastered Topics (70%+) Yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'km'
                  ? 'បន្តអនុវត្តកម្រងសំណួរ និងការប្រឡងសាកល្បង ដើម្បីបង្កើនភាពត្រឹមត្រូវលើប្រធានបទក្នុងផែនការសិក្សានេះ។'
                  : 'Keep practicing quizzes and mock exams in this study plan to reach 70% or higher accuracy.'}
              </p>
              <button
                onClick={() => setCurrentPage('practice')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
              >
                {lang === 'km' ? 'ចាប់ផ្តើមអនុវត្ត' : 'Start Practicing'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {strengths.map((s) => {
                const accuracy = s.accuracyRate !== null ? Math.round(s.accuracyRate) : 70;

                return (
                  <div
                    key={s.topicId}
                    className="bg-white rounded-2xl border border-emerald-100 p-4 sm:p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{lang === 'km' ? 'ស្ទាត់ជំនាញ' : 'Mastered'}</span>
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                          {s.topicName || (lang === 'km' ? 'មេរៀន' : 'Topic')}
                        </h3>
                        {s.subjectName && (
                          <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{s.subjectName}</span>
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xl sm:text-2xl font-black text-emerald-600">{accuracy}%</p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">
                          {lang === 'km' ? 'ភាពត្រឹមត្រូវ' : 'Accuracy'}
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, Math.max(0, accuracy))}%` }}
                      />
                    </div>

                    {s.recommendation && (
                      <p className="text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 leading-relaxed">
                        {s.recommendation}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {lang === 'km' ? 'កម្រិតស្ទាត់ជំនាញខ្ពស់' : 'High Mastery Level'}
                      </span>

                      {s.actionQuizId && (
                        <button
                          onClick={() => startQuizById(s.actionQuizId as number)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 shadow-xs transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === 'km' ? 'អនុវត្តពង្រឹងបន្ថែម' : 'Practice to Maintain'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeaknessPage;
