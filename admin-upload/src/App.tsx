import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
  BookOpen,
  LayoutDashboard,
  ChevronDown,
  Search,
  RefreshCw,
  Database,
  Cloud,
  X,
  FilePlus2,
  Eye,
} from 'lucide-react';
import { uploadPaperToStorage } from './lib/supabase';
import { api, setApiToken } from './lib/api';
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';

/* ─────────────────────────────────────────── types ── */
interface Subject {
  subjectId: number;
  subjectName: string;
  examId: number;
  exam?: { examName: string; examType: string | null };
}

interface PastPaper {
  paperId: number;
  subjectId: number;
  year: number;
  title: string;
  fileUrl: string | null;
  fileSize: string | null;
  hasAnswerKey: boolean;
  totalQuestions: number | null;
  paperType?: string;
  subject?: { 
    subjectName: string;
    exam?: { examName: string; examType: string | null; category: string | null };
  };
}

type Tab = 'dashboard' | 'upload';
type UploadStatus = 'idle' | 'uploading-storage' | 'saving-db' | 'success' | 'error';

/* ─────────────────────────────────────────── helpers ── */
function formatBytes(str: string | null) {
  return str ?? '—';
}

/* ─────────────────────────────────────────── App ── */
export default function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [tab, setTab] = useState<Tab>('upload');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterExam, setFilterExam] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  /* upload form state */
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    examCategory: '',
    subjectId: '',
    year: new Date().getFullYear(),
    hasAnswerKey: false,
    totalQuestions: '',
    paperType: 'past-paper',
  });

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState('');
  const [lastUploaded, setLastUploaded] = useState<PastPaper | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  
  /* ── auth check ── */
  useEffect(() => {
    const checkRole = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          setApiToken(token);
          const meRes = await api.get<{ user: { role: string } }>('/auth/me');
          setIsAdmin(meRes?.user?.role === 'admin');
        } catch (err) {
          console.error("Error fetching user role:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(null);
        setApiToken(null);
      }
    };
    if (isLoaded) checkRole();
  }, [isSignedIn, isLoaded, getToken]);

  /* ── fetch data ── */
  const fetchAll = useCallback(async () => {
    if (!isAdmin) return; // Only fetch if admin
    setLoading(true);
    try {
      const [subRes, paperRes] = await Promise.all([
        api.get<{ subjects: Subject[] }>('/subjects'),
        api.get<{ papers: PastPaper[] }>('/papers'),
      ]);
      if (subRes?.subjects) setSubjects(subRes.subjects);
      if (paperRes?.papers) setPapers(paperRes.papers);
    } catch (err) {
      console.error('Fetch failed:', err);
    }
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => { fetchAll(); }, [fetchAll]);


  /* ── file drag & drop ── */
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
    else alert('Only PDF files are accepted.');
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setUploadError('Title is required.'); return; }
    if (!form.subjectId) { setUploadError('Please select a subject.'); return; }
    if (!file) { setUploadError('Please select a PDF file.'); return; }

    setUploadError('');
    setUploadStatus('uploading-storage');

    try {
      // 1 ─ Upload PDF to Supabase Storage
      const { publicUrl, fileSize } = await uploadPaperToStorage(file);

      // 2 ─ Save metadata to database
      setUploadStatus('saving-db');
      const payload = {
        subjectId: Number(form.subjectId),
        title: form.title.trim(),
        year: Number(form.year),
        fileUrl: publicUrl,
        fileSize,
        hasAnswerKey: form.hasAnswerKey,
        totalQuestions: form.totalQuestions ? Number(form.totalQuestions) : null,
        paperType: form.paperType,
      };

      const res = await api.post<{ paper: PastPaper }>('/papers', payload);

      setUploadStatus('success');
      setLastUploaded(res.paper);

      // Reset form & refresh list
      setForm({ title: '', examCategory: '', subjectId: '', year: new Date().getFullYear(), hasAnswerKey: false, totalQuestions: '', paperType: 'past-paper' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh paper list
      const paperRes = await api.get<{ papers: PastPaper[] }>('/papers');
      if (paperRes?.papers) setPapers(paperRes.papers);

    } catch (err: unknown) {
      setUploadStatus('error');
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Check console for details.');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this paper record from the database?')) return;
    try {
      await api.delete(`/papers/${id}`);
      setPapers(prev => prev.filter(p => p.paperId !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  /* ── filtered papers ── */
  const filteredPapers = papers.filter(p => {
    if (filterExam && p.subject?.exam?.examName !== filterExam && p.subject?.exam?.examType !== filterExam) return false;
    if (filterType && p.paperType !== filterType) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.subject?.subjectName?.toLowerCase().includes(q) ||
      String(p.year).includes(q)
    );
  });

  /* ─────────────────────────────────────────── render ── */
  if (!isLoaded || (isSignedIn && isAdmin === null)) {
    return <div className="flex h-screen items-center justify-center bg-[#08090B] text-white">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#08090B] text-white space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Admin Upload Dashboard</h1>
        <p className="text-slate-400">You must be signed in as an admin to access this dashboard.</p>
        <div className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer transition">
          <SignInButton mode="modal">Sign In</SignInButton>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#08090B] text-white space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-2" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-400">You do not have the required admin permissions.</p>
        <a href={`${window.location.protocol}//${window.location.hostname}:3000`} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-white transition border border-slate-700">
          Back to User Site
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#08090B] text-[#E2E4E9] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-[#0D0F12] border-r border-white/5 flex flex-col">
        {/* Brand */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">PassKru</p>
              <p className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">Upload Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {([
            { id: 'upload' as Tab, label: 'Upload Paper', icon: FilePlus2 },
            { id: 'dashboard' as Tab, label: 'Paper Library', icon: LayoutDashboard },
          ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-[#8E929E] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-[#5A5E6B]'}`} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/5">
            <a
              href={`${window.location.protocol}//${window.location.hostname}:3000?viewAsUser=true`}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8E929E] hover:bg-white/5 hover:text-white transition-all"
            >
              <ExternalLink className="w-4 h-4 text-[#5A5E6B]" />
              Back to User Dashboard
            </a>
          </div>
        </nav>

        {/* Status footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#5A5E6B]">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span><span className="text-emerald-400 font-bold">{papers.length}</span> papers in DB</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5A5E6B]">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Supabase Storage</span>
            {import.meta.env.VITE_SUPABASE_URL ? (
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CONNECTED</span>
            ) : (
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">NO KEY</span>
            )}
          </div>
          <div className="pt-1">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-500/5 border border-amber-500/10 px-2 py-1 rounded-lg block text-center">
              Dev / Testing Mode
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#08090B]/80 backdrop-blur-md border-b border-white/5 px-8 h-14 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-white">
              {tab === 'upload' ? 'Upload Past Paper' : 'Paper Library'}
            </h1>
            <p className="text-[11px] text-[#5A5E6B]">
              {tab === 'upload'
                ? 'Upload PDF → Supabase Storage · Save metadata → PostgreSQL'
                : 'All past papers currently stored in the database'}
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 text-xs text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </header>

        <main className="p-8 max-w-4xl mx-auto">

          {/* ═══════════════════════════════ UPLOAD TAB ═══════════════════════════ */}
          {tab === 'upload' && (
            <div className="space-y-6">

              {/* Success banner */}
              {uploadStatus === 'success' && lastUploaded && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-300">Paper uploaded successfully!</p>
                    <p className="text-xs text-[#8E929E] mt-0.5 truncate">
                      <span className="text-white font-semibold">{lastUploaded.title}</span>
                      {' '}· paperId: <span className="text-indigo-400 font-mono">{lastUploaded.paperId}</span>
                    </p>
                    {lastUploaded.fileUrl && (
                      <a
                        href={lastUploaded.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View stored PDF in Supabase
                      </a>
                    )}
                  </div>
                  <button onClick={() => setUploadStatus('idle')} className="text-[#5A5E6B] hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error banner */}
              {uploadStatus === 'error' && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-rose-300">Upload failed</p>
                    <p className="text-xs text-[#8E929E] mt-0.5">{uploadError}</p>
                  </div>
                  <button onClick={() => setUploadStatus('idle')} className="text-[#5A5E6B] hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload form card */}
              <form
                onSubmit={handleSubmit}
                className="bg-[#0D0F12] border border-white/8 rounded-3xl p-7 shadow-xl space-y-6"
              >
                {/* PDF Drop Zone */}
                <div>
                  <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                    PDF File <span className="text-rose-400">*</span>
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all group ${
                      isDragOver
                        ? 'border-indigo-500 bg-indigo-500/5'
                        : file
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={onFileChange}
                    />

                    {file ? (
                      <div className="space-y-2">
                        <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                          <FileText className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{file.name}</p>
                          <p className="text-xs text-[#5A5E6B] mt-1">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB · application/pdf
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold mt-1"
                        >
                          <X className="w-3 h-3" /> Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                          <Upload className="w-7 h-7 text-[#5A5E6B] group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Drop PDF here or <span className="text-indigo-400">click to browse</span>
                          </p>
                          <p className="text-xs text-[#5A5E6B] mt-1">PDF files only · Max 50 MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                    Paper Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. NIE Teacher Exam 2024 — Pedagogy (with Answer Key)"
                    className="w-full px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 outline-none transition"
                  />
                </div>

                {/* Exam Category, Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                      Exam Category <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.examCategory}
                        onChange={e => setForm(f => ({ ...f, examCategory: e.target.value, subjectId: '' }))}
                        className="w-full appearance-none px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9"
                      >
                        <option value="">— Select exam category —</option>
                        <option value="Elementary Exam">Elementary Exam</option>
                        <option value="Secondary Exam">Secondary Exam</option>
                        <option value="High School Exam">High School Exam</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#5A5E6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                      Subject <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.subjectId}
                        onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                        className="w-full appearance-none px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9 disabled:opacity-50"
                        disabled={!form.examCategory && subjects.length > 0}
                      >
                        <option value="">— Select subject —</option>
                        {subjects.length > 0 ? (
                          subjects.filter(s => form.examCategory ? (s.exam?.examName === form.examCategory || s.exam?.examType === form.examCategory) : true).map(s => (
                            <option key={s.subjectId} value={s.subjectId}>
                              {s.subjectName}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="1">Mathematics (ID 1)</option>
                            <option value="2">Physics (ID 2)</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#5A5E6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Type, Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                      Paper Type
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.paperType}
                        onChange={e => setForm(f => ({ ...f, paperType: e.target.value }))}
                        className="w-full appearance-none px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9"
                      >
                        <option value="past-paper">Past Paper</option>
                        <option value="prepare-paper">Prepare Paper</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#5A5E6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                      Exam Year
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={2030}
                      value={form.year}
                      onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition"
                    />
                  </div>
                </div>

                {/* Total Questions */}
                <div>
                  <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.totalQuestions}
                    onChange={e => setForm(f => ({ ...f, totalQuestions: e.target.value }))}
                    placeholder="e.g. 50"
                    className="w-full px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 outline-none transition"
                  />
                </div>

                {/* Has Answer Key toggle */}
                <div className="flex items-center justify-between bg-[#111317] border border-white/8 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Includes Answer Key</p>
                    <p className="text-xs text-[#5A5E6B]">Mark if this PDF contains the official answer sheet</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, hasAnswerKey: !f.hasAnswerKey }))}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.hasAnswerKey ? 'bg-indigo-600' : 'bg-[#1A1D24]'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.hasAnswerKey ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                {/* Inline form error */}
                {uploadError && uploadStatus !== 'error' && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                  </p>
                )}

                {/* Upload button */}
                <button
                  type="submit"
                  disabled={uploadStatus === 'uploading-storage' || uploadStatus === 'saving-db'}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all ${
                    uploadStatus === 'uploading-storage' || uploadStatus === 'saving-db'
                      ? 'bg-indigo-600/50 cursor-not-allowed text-indigo-200'
                      : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {uploadStatus === 'uploading-storage' && (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading to Supabase Storage…</>
                  )}
                  {uploadStatus === 'saving-db' && (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving metadata to database…</>
                  )}
                  {(uploadStatus === 'idle' || uploadStatus === 'success' || uploadStatus === 'error') && (
                    <><Upload className="w-4 h-4" /> Upload Paper</>
                  )}
                </button>

                {/* Flow explanation */}
                <div className="flex items-center gap-3 justify-center text-xs text-[#5A5E6B] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                    <span>PDF → Supabase Storage</span>
                  </div>
                  <span className="text-white/20">→</span>
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Public URL → PostgreSQL</span>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════ LIBRARY TAB ═══════════════════════════ */}
          {tab === 'dashboard' && (
            <div className="space-y-5">
              {/* Big Exam Filter Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  onClick={() => setFilterExam(null)}
                  className={`bg-[#0D0F12] rounded-2xl p-4 cursor-pointer transition-all border-2 ${!filterExam ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <p className={`text-xs font-medium mb-1 ${!filterExam ? 'text-indigo-400' : 'text-[#5A5E6B]'}`}>All Exams</p>
                  <p className={`text-3xl font-black ${!filterExam ? 'text-white' : 'text-[#8E929E]'}`}>{papers.length}</p>
                </div>
                {['Elementary Exam', 'Secondary Exam', 'High School Exam'].map(examName => {
                  const count = papers.filter(p => p.subject?.exam?.examName === examName || p.subject?.exam?.examType === examName).length;
                  const active = filterExam === examName;
                  return (
                    <div 
                      key={examName}
                      onClick={() => setFilterExam(examName)}
                      className={`bg-[#0D0F12] rounded-2xl p-4 cursor-pointer transition-all border-2 ${active ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <p className={`text-xs font-medium mb-1 truncate ${active ? 'text-indigo-400' : 'text-[#5A5E6B]'}`} title={examName}>{examName}</p>
                      <p className={`text-3xl font-black ${active ? 'text-white' : 'text-[#8E929E]'}`}>{count}</p>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="space-y-3">
                
                {/* Type Filter */}
                <div className="flex flex-wrap gap-2 pb-3 border-b border-white/5">
                  <button 
                    onClick={() => setFilterType(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!filterType ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'}`}
                  >
                    All Types
                  </button>
                  <button 
                    onClick={() => setFilterType('past-paper')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterType === 'past-paper' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'}`}
                  >
                    Past Papers
                  </button>
                  <button 
                    onClick={() => setFilterType('prepare-paper')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterType === 'prepare-paper' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'}`}
                  >
                    Prepare Papers
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, subject, or year…"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D0F12] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              {/* Paper list */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : filteredPapers.length === 0 ? (
                <div className="text-center py-20 text-[#5A5E6B]">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No papers found</p>
                  <p className="text-xs mt-1">Upload your first paper to see it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredPapers.map(paper => (
                    <div
                      key={paper.paperId}
                      className="group relative flex flex-col bg-[#0D0F12] border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer"
                      onClick={() => {
                        if (paper.fileUrl && paper.fileUrl.startsWith('http')) {
                          setPreviewPdfUrl(paper.fileUrl);
                        }
                      }}
                    >
                      {/* Thumbnail Area */}
                      <div className="aspect-[3/4] w-full bg-[#E2E4E9] relative flex flex-col items-center justify-center border-b border-white/5 overflow-hidden">
                        
                        {/* Live PDF Content Thumbnail via scaled iframe */}
                        {paper.fileUrl && paper.fileUrl.startsWith('http') ? (
                          <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none transition-transform duration-500 group-hover:scale-[0.26]">
                            <iframe 
                              src={`${paper.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                              className="w-full h-full border-none"
                              title={`Thumbnail for ${paper.title}`}
                            />
                          </div>
                        ) : (
                          // Fallback if no URL
                          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                            <FileText className="w-8 h-8 text-indigo-400" />
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-indigo-900/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                           <div className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20 mb-2 shadow-xl">
                             <Eye className="w-4 h-4" /> Click to read
                           </div>
                           <h4 className="text-[11px] font-bold text-white text-center px-4 line-clamp-3">
                             {paper.title}
                           </h4>
                        </div>

                        {/* Top Right Badges */}
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-30">
                          {paper.paperType === 'prepare-paper' && (
                            <div className="bg-violet-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                              PREPARE
                            </div>
                          )}
                          {paper.hasAnswerKey && (
                            <div className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                              KEY
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <p className="text-xs text-[#8E929E] font-medium flex items-center justify-between">
                            <span>Year {paper.year}</span>
                            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-[#5A5E6B]">#{paper.paperId}</span>
                          </p>
                          <p className="text-[10px] text-[#5A5E6B] mt-1 flex items-center justify-between">
                            <span>{paper.subject?.exam?.examName || 'No Exam Category'}</span>
                            <span>{formatBytes(paper.fileSize)}</span>
                          </p>
                        </div>
                        
                        {/* Delete Button (Stops propagation to avoid opening preview) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(paper.paperId);
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg text-xs font-bold text-[#5A5E6B] hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── PDF Preview Modal ── */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewPdfUrl(null)} />
          <div className="relative w-full max-w-5xl h-[85vh] bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#111317]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Document Preview
              </h3>
              <div className="flex items-center gap-2">
                <a href={previewPdfUrl} target="_blank" rel="noreferrer" className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition" title="Open in new tab">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => setPreviewPdfUrl(null)} className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition" title="Close preview">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-[#1A1D24]">
              <iframe
                src={`${previewPdfUrl}#view=FitH`}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
