import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockPastPapers } from '../data/mockData';
import { PastPaper, ExamTarget } from '../types';
import { api } from '../utils/api';
import { supabase } from '../utils/supabase';
import {
  FileText,
  Search,
  Filter,
  Download,
  Play,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  X,
  Upload,
  Loader2,
  ShieldCheck
} from 'lucide-react';

export const PastPapersPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage, startMockExamById, userProfile } = useApp();

  const [papers, setPapers] = useState<PastPaper[]>(mockPastPapers);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload fields
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [hasAnswerKey, setHasAnswerKey] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewingPaper, setViewingPaper] = useState<PastPaper | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  // Fetch papers from backend
  const fetchPapers = async () => {
    try {
      const res = await api('/papers');
      if (res.success && res.papers) {
        const backendPapers = res.papers.map((p: any) => ({
          id: String(p.paperId),
          title: { km: p.title, en: p.title },
          targetExam: (p.subject?.exam?.targetCode?.toLowerCase() || 'nie') as ExamTarget,
          subject: p.subject?.subjectName || 'General',
          subjectKm: p.subject?.subjectName || 'ទូទៅ',
          year: p.year,
          session: p.session,
          fileSize: p.fileSize || '0.0 MB',
          hasAnswerKey: p.hasAnswerKey,
          totalQuestions: p.totalQuestions || 0,
          fileUrl: p.fileUrl,
          questions: [] // Seed empty questions for backend archives
        }));

        setPapers(prev => {
          const combined = [...backendPapers, ...prev];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          return unique;
        });
      }
    } catch (err) {
      console.error("Failed to load backend papers:", err);
    }
  };

  // Fetch subjects for select dropdown
  const fetchSubjects = async () => {
    try {
      const res = await api('/subjects');
      if (res.success && res.subjects) {
        setSubjects(res.subjects);
      }
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  };

  useEffect(() => {
    fetchPapers();
    if (userProfile?.role === 'admin') {
      fetchSubjects();
    }
  }, [userProfile?.role]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !title || !subjectId) {
      alert("Please enter a title, select a subject, and choose a PDF file.");
      return;
    }

    setUploading(true);
    setStatusMsg(lang === 'km' ? 'កំពុងបញ្ចូលឯកសារទៅកាន់ Supabase Storage...' : 'Uploading PDF to Supabase Storage...');

    try {
      const fileExt = pdfFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      const filePath = `papers/${fileName}`;

      // Upload file directly to Supabase storage bucket 'past papers'
      const { data, error: uploadError } = await supabase.storage
        .from('past papers')
        .upload(filePath, pdfFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Retrieve public HTTPS URL
      const { data: { publicUrl } } = supabase.storage
        .from('past papers')
        .getPublicUrl(filePath);

      setStatusMsg(lang === 'km' ? 'កំពុងរក្សាទុកព័ត៌មានទៅកាន់ database...' : 'Saving past paper info to database...');

      const sizeInMB = `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`;

      const res = await api('/papers', {
        method: 'POST',
        body: {
          subjectId: parseInt(subjectId, 10),
          year: year ? parseInt(year, 10) : null,
          title,
          session,
          fileUrl: publicUrl,
          fileSize: sizeInMB,
          hasAnswerKey,
          totalQuestions: totalQuestions ? parseInt(totalQuestions, 10) : null
        }
      });

      if (res.success) {
        setStatusMsg(lang === 'km' ? 'រក្សាទុកជោគជ័យ!' : 'Past paper uploaded and saved successfully!');
        // Reset states
        setTitle('');
        setSubjectId('');
        setYear('');
        setSession('');
        setTotalQuestions('');
        setHasAnswerKey(false);
        setPdfFile(null);
        // Refresh list
        await fetchPapers();
        setTimeout(() => {
          setShowUploadForm(false);
          setStatusMsg('');
        }, 1500);
      } else {
        throw new Error(res.message || "Failed to register paper on backend");
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg(lang === 'km' ? `កំហុស៖ ${err.message}` : `Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const targets = [
    { id: 'all', label: { km: 'គ្រប់ក្របខណ្ឌ', en: 'All Exams' } },
    { id: 'nie', label: { km: 'NIE (គ្រូវិទ្យាល័យ)', en: 'NIE' } },
    { id: 'rttc', label: { km: 'RTTC (គ្រូអនុ)', en: 'RTTC' } },
    { id: 'pttc', label: { km: 'PTTC (គ្រូបឋម)', en: 'PTTC' } },
  ];

  const years = ['all', '2025', '2024', '2023', '2022', '2020'];

  const filteredPapers = papers.filter(paper => {
    const matchesTarget = selectedTarget === 'all' || paper.targetExam === selectedTarget;
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
    const titleStr = paper.title?.[lang] || paper.title?.km || '';
    const matchesSearch =
      titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (paper.subjectKm || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTarget && matchesYear && matchesSearch;
  });

  const handleStartPracticePaper = (paper: PastPaper) => {
    setCurrentPage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (userProfile?.role === 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <span>{lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រងអភិបាល (Admin Dashboard)' : 'Admin Dashboard Operations'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {lang === 'km' ? 'បញ្ចូលវិញ្ញាសាប្រឡងគ្រូថ្មី' : 'Upload New Past Papers'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {lang === 'km'
              ? 'ឯកសារនឹងត្រូវបញ្ចូលទៅ Supabase Storage និងកត់ត្រាចូលក្នុងប្រព័ន្ធទិន្នន័យ។'
              : 'Files will be stored directly in Supabase Storage and registered in the database.'}
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUploadSubmit} className="w-full bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-sm animate-scaleUp">
          {statusMsg && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-2">
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ចំណងជើងវិញ្ញាសា *' : 'Paper Title *'}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. NIE Pedagogy 2026"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា/ឯកទេស *' : 'Select Subject *'}</label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                required
              >
                <option value="">-- {lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Choose Subject'} --</option>
                {subjects.map((sub: any) => (
                  <option key={sub.subjectId} value={sub.subjectId}>
                    {sub.subjectName} ({sub.exam?.examName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ឆ្នាំប្រឡង' : 'Examination Year'}</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g. 2026"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'សម័យប្រឡង / វគ្គ' : 'Session / Exam Period'}</label>
              <input
                type="text"
                value={session}
                onChange={e => setSession(e.target.value)}
                placeholder="e.g. សម័យប្រឡង៖ តុលា ២០២៦"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ចំនួនសំណួរសរុប' : 'Total Questions'}</label>
              <input
                type="number"
                value={totalQuestions}
                onChange={e => setTotalQuestions(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center pt-6 pl-2">
              <input
                type="checkbox"
                id="hasAnswerKey"
                checked={hasAnswerKey}
                onChange={e => setHasAnswerKey(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="hasAnswerKey" className="ml-2 text-sm font-bold text-slate-700 cursor-pointer">
                {lang === 'km' ? 'មានគន្លឹះចម្លើយ និងការពន្យល់' : 'Includes Answer Key / Explanations'}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ជ្រើសរើសឯកសារ PDF *' : 'Select PDF File *'}</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition hover:border-indigo-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    {pdfFile ? pdfFile.name : (lang === 'km' ? 'ចុចទីនេះដើម្បីជ្រើសរើស ឬទាញទម្លាក់ឯកសារ PDF' : 'Click to select or drag & drop PDF')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PDF file only up to 15MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'km' ? 'កំពុងបញ្ចូល...' : 'Uploading...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'បញ្ចូលវិញ្ញាសា' : 'Upload Past Paper'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <FileText className="w-4 h-4" />
          <span>{lang === 'km' ? 'បណ្ណសារវិញ្ញាសាផ្លូវការ' : 'Official Examination Archives'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'វិញ្ញាសាប្រឡងគ្រូឆ្នាំចាស់ៗ (២០១៨ - ២០២៥)' : 'Past National Teacher Exam Papers'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'បណ្តុំវិញ្ញាសាជាក់ស្តែង ជាមួយគន្លឹះចម្លើយ និងការពន្យល់គរុកោសល្យក្បោះក្បាយ ដើម្បីហ្វឹកហាត់កម្រិតសមត្ថភាព។'
            : 'Explore real past examination papers with verified pedagogical solution keys, step-by-step explanations, and interactive modes.'}
        </p>
      </div>

      {/* Admin Operations Panel */}
      {userProfile?.role === 'admin' && (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200 gap-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រងអភិបាល (Admin Dashboard)' : 'Admin Dashboard Operations'}</span>
            </span>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
            >
              {showUploadForm ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              <span>
                {showUploadForm 
                  ? (lang === 'km' ? 'បិទផ្ទាំងបញ្ចូលវិញ្ញាសា' : 'Close Upload Panel') 
                  : (lang === 'km' ? 'បញ្ចូលវិញ្ញាសាថ្មី' : 'Upload Past Paper')}
              </span>
            </button>
          </div>

          {showUploadForm && (
            <form onSubmit={handleUploadSubmit} className="w-full bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-sm animate-scaleUp">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">
                  {lang === 'km' ? 'បញ្ចូលវិញ្ញាសាប្រឡងគ្រូថ្មី' : 'Upload New Past Paper'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'km' ? 'ឯកសារនឹងត្រូវបញ្ចូលទៅ Supabase Storage និងកត់ត្រាចូលក្នុងប្រព័ន្ធទិន្នន័យ។' : 'Files will be stored directly in Supabase Storage and registered in the database.'}
                </p>
              </div>

              {statusMsg && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{statusMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ចំណងជើងវិញ្ញាសា *' : 'Paper Title *'}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. NIE Pedagogy 2026"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា/ឯកទេស *' : 'Select Subject *'}</label>
                  <select
                    value={subjectId}
                    onChange={e => setSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    required
                  >
                    <option value="">-- {lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Choose Subject'} --</option>
                    {subjects.map((sub: any) => (
                      <option key={sub.subjectId} value={sub.subjectId}>
                        {sub.subjectName} ({sub.exam?.examName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ឆ្នាំប្រឡង' : 'Examination Year'}</label>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'សម័យប្រឡង / វគ្គ' : 'Session / Exam Period'}</label>
                  <input
                    type="text"
                    value={session}
                    onChange={e => setSession(e.target.value)}
                    placeholder="e.g. សម័យប្រឡង៖ តុលា ២០២៦"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ចំនួនសំណួរសរុប' : 'Total Questions'}</label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={e => setTotalQuestions(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex items-center pt-6 pl-2">
                  <input
                    type="checkbox"
                    id="hasAnswerKey"
                    checked={hasAnswerKey}
                    onChange={e => setHasAnswerKey(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="hasAnswerKey" className="ml-2 text-sm font-bold text-slate-700 cursor-pointer">
                    {lang === 'km' ? 'មានគន្លឹះចម្លើយ និងការពន្យល់' : 'Includes Answer Key / Explanations'}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{lang === 'km' ? 'ជ្រើសរើសឯកសារ PDF *' : 'Select PDF File *'}</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition hover:border-indigo-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-600">
                        {pdfFile ? pdfFile.name : (lang === 'km' ? 'ចុចទីនេះដើម្បីជ្រើសរើស ឬទាញទម្លាក់ឯកសារ PDF' : 'Click to select or drag & drop PDF')}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">PDF file only up to 15MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setPdfFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  disabled={uploading}
                >
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{lang === 'km' ? 'កំពុងបញ្ចូល...' : 'Uploading...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'បញ្ចូលវិញ្ញាសា' : 'Upload Past Paper'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'km' ? 'ស្វែងរកវិញ្ញាសា...' : 'Search past papers...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Exam Target Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full md:w-auto">
            {targets.map(tgt => (
              <button
                key={tgt.id}
                onClick={() => setSelectedTarget(tgt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedTarget === tgt.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tgt.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-3">
          <span className="text-slate-500 font-semibold mr-1">{t('filterByYear')}:</span>
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                selectedYear === yr
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {yr === 'all' ? (lang === 'km' ? 'គ្រប់ឆ្នាំ' : 'All Years') : `ឆ្នាំ ${yr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPapers.map(paper => (
          <div
            key={paper.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                  {paper.targetExam} • {paper.year}
                </span>
                <span className="text-xs font-medium text-slate-500">{paper.session}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {paper.title?.[lang] || paper.title?.km || ''}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{paper.totalQuestions} {lang === 'km' ? 'សំណួរ' : 'questions'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'km' ? 'មានគន្លឹះចម្លើយ' : 'Answer key included'}</span>
                </span>
                <span>•</span>
                <span>{paper.fileSize}</span>
              </div>
            </div>

            {/* Action Buttons: View Paper, View Answers, Practice */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewingPaper(paper);
                    setShowAnswerKey(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'មើលវិញ្ញាសា' : 'View Paper'}</span>
                </button>

                <button
                  onClick={() => {
                    setViewingPaper(paper);
                    setShowAnswerKey(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('viewAnswerKey')}</span>
                </button>
              </div>

              <button
                onClick={() => handleStartPracticePaper(paper)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{lang === 'km' ? 'អនុវត្តភ្លាម' : 'Practice'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paper View Modal */}
      {viewingPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">
                  {viewingPaper.targetExam.toUpperCase()} • ឆ្នាំ {viewingPaper.year}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{viewingPaper?.title?.[lang] || viewingPaper?.title?.km || ''}</h2>
              </div>
              <button
                onClick={() => setViewingPaper(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Answer Key Switch */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">
                {lang === 'km' ? 'បង្ហាញគន្លឹះចម្លើយ និងការពន្យល់' : 'Show Answer Keys & Solutions'}
              </span>
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  showAnswerKey
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {showAnswerKey ? (lang === 'km' ? 'បើកចម្លើយ' : 'Answers ON') : (lang === 'km' ? 'បិទចម្លើយ' : 'Answers OFF')}
              </button>
            </div>

            {/* Sample Questions in paper */}
            <div className="space-y-6">
              {(viewingPaper.questions || []).map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {lang === 'km' ? `សំណួរទី ${idx + 1}` : `Question ${idx + 1}`}
                    </span>
                    <span className="text-xs text-slate-500">{lang === 'km' ? q.topicKm : q.topic}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-900">{q.question?.[lang] || q.question?.km || ''}</p>

                  <div className="space-y-1.5 pl-2">
                    {q.options?.map(opt => {
                      const isCorrect = opt.id === q.correctAnswerId;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
                            showAnswerKey && isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{opt.id.toUpperCase()}. {opt.text?.[lang] || opt.text?.km || ''}</span>
                          {showAnswerKey && isCorrect && (
                            <span className="text-[11px] text-emerald-700 font-bold">✓ {lang === 'km' ? 'ចម្លើយត្រឹមត្រូវ' : 'Correct'}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {showAnswerKey && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
                      <p className="font-bold">{t('explanation')}:</p>
                      <p>{q.explanation?.[lang] || q.explanation?.km || ''}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setViewingPaper(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {t('close')}
              </button>
              <button
                onClick={() => {
                  setViewingPaper(null);
                  handleStartPracticePaper(viewingPaper);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                {lang === 'km' ? 'ចាប់ផ្តើមធ្វើក្នុង Practice Mode' : 'Start Interactive Practice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
