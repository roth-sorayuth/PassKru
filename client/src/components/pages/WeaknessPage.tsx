import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { getWeakAreas, WeakAreaApi } from '../../services/weaknessService';
import {
  AlertTriangle,
  Target,
  TrendingDown,
  BookOpen,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
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

  const [weakAreas, setWeakAreas] = useState<WeakAreaApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeakAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWeakAreas();
      if (res?.success && Array.isArray(res.weakAreas)) {
        setWeakAreas(res.weakAreas);
      } else {
        setWeakAreas([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch weak areas:', err);
      setError(err?.message || 'Could not load weakness analysis from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeakAreas();
  }, [fetchWeakAreas]);

  const highCount = weakAreas.filter(w => w.priority === 'high').length;
  const mediumCount = weakAreas.filter(w => w.priority === 'medium').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <TrendingDown className="w-4 h-4" />
          <span>{lang === 'km' ? 'ការវិភាគចំណុចខ្សោយ' : 'Weakness Analysis'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'ចំណុចខ្សោយត្រូវពង្រឹងបន្ថែម' : 'Topics That Need Your Attention'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'បង្កើតឡើងដោយស្វ័យប្រវត្តិពីលទ្ធផលកម្រងសំណួរ និងការប្រឡងសាកល្បងរបស់អ្នក។'
            : 'Automatically generated from your quiz and mock exam attempt history.'}
        </p>
      </div>

      {/* Summary strip */}
      {!loading && !error && weakAreas.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-2xs">
            <p className="text-2xl font-black text-slate-900">{weakAreas.length}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              {lang === 'km' ? 'ចំណុចខ្សោយសរុប' : 'Total Weak Topics'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-red-200 p-4 text-center shadow-2xs">
            <p className="text-2xl font-black text-red-600">{highCount}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              {lang === 'km' ? 'ខ្សោយខ្លាំង' : 'High Priority'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-amber-200 p-4 text-center shadow-2xs">
            <p className="text-2xl font-black text-amber-600">{mediumCount}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              {lang === 'km' ? 'មធ្យម' : 'Medium Priority'}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => fetchWeakAreas()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{lang === 'km' ? 'ធ្វើឲ្យទាន់សម័យ' : 'Refresh'}</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
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
            onClick={() => fetchWeakAreas()}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            {lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && weakAreas.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {lang === 'km' ? 'មិនមានចំណុចខ្សោយទេ ល្អណាស់!' : 'No Weak Areas Found — Great Job!'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'km'
              ? 'ធ្វើកម្រងសំណួរ ឬការប្រឡងសាកល្បងបន្ថែម ដើម្បីឲ្យប្រព័ន្ធវិភាគចំណុចខ្សោយរបស់អ្នក។'
              : 'Take more quizzes or mock exams so the system can analyze your performance.'}
          </p>
          <button
            onClick={() => setCurrentPage('practice')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
          >
            {lang === 'km' ? 'ចាប់ផ្តើមអនុវត្ត' : 'Start Practicing'}
          </button>
        </div>
      )}

      {/* Weak areas list */}
      {!loading && !error && weakAreas.length > 0 && (
        <div className="space-y-4">
          {weakAreas.map(w => {
            const severity = w.priority || w.severityLevel || 'low';
            const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.low;
            const label = SEVERITY_LABEL[severity] || SEVERITY_LABEL.low;
            const accuracy = w.accuracyRate !== null ? Math.round(w.accuracyRate) : null;

            return (
              <div
                key={w.weakAreaId}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.badge}`}>
                      <AlertTriangle className="w-3 h-3" />
                      {label[lang]}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {w.topicName || (lang === 'km' ? 'មេរៀន' : 'Topic')}
                    </h3>
                    {w.subjectName && (
                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {w.subjectName}
                      </p>
                    )}
                  </div>

                  {accuracy !== null && (
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-slate-900">{accuracy}%</p>
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
    </div>
  );
};

export default WeaknessPage;
