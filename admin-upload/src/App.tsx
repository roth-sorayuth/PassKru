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
  Database,
  Cloud,
  X,
  FilePlus2,
  Eye,
  LogOut,
  Megaphone,
  Plus,
  Pencil,
  Calendar,
  Paperclip,
  Tag,
  Flame,
  Bell,
  Sparkles,
  Clock,
  Users,
  UserPlus,
  UserCheck,
  Shield,
  Mail,
  Phone,
  GraduationCap,
  Award,
} from 'lucide-react';
import { uploadPaperToStorage, uploadAnnouncementToStorage } from './lib/supabase';
import { api, setApiToken, setTokenGetter } from './lib/api';
import { useAuth, useUser, useClerk, SignInButton } from '@clerk/clerk-react';

/* ─────────────────────────────────────────── types ── */
interface UserItem {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  avatarUrl?: string | null;
  targetExamId?: number | null;
  targetSubject?: string | null;
  knowledgeLevel?: string | null;
  dailyGoalMinutes?: number;
  streakDays?: number;
  completedQuestions?: number;
  averageScore?: string | number;
  studyHoursTotal?: string | number;
  createdAt: string;
  clerkId?: string | null;
  targetExam?: {
    examId: number;
    examName: string;
    category?: string | null;
    examType?: string | null;
  } | null;
  _count?: {
    attempts?: number;
    notifications?: number;
    studyPlans?: number;
  };
}
interface Subject {
  subjectId: number;
  subjectName: string;
  examId: number;
  exam?: { examName: string; examType: string | null };
}

interface Exam {
  examId: number;
  examName: string;
  examType?: string | null;
  category?: string | null;
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

interface AnnouncementItem {
  announcementId: number;
  examId: number;
  title: string;
  summary: string | null;
  content: string | null;
  publishDate: string;
  category: string | null;
  isUrgent: boolean;
  attachments?: any;
  exam?: { 
    examId: number; 
    examName: string;
    examType?: string | null;
  };
}

type Tab = 'upload' | 'dashboard' | 'announcements' | 'users';
type UploadStatus = 'idle' | 'uploading-storage' | 'saving-db' | 'success' | 'error';

/* ─────────────────────────────────────────── helpers ── */
function formatBytes(str: string | null) {
  return str ?? '—';
}

function getCategoryBadge(category: string | null) {
  switch (category?.toLowerCase()) {
    case 'recruitment':
      return { label: 'Recruitment', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'schedule':
      return { label: 'Schedule', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    case 'eligibility':
      return { label: 'Eligibility', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
    case 'result':
      return { label: 'Result', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'guideline':
      return { label: 'Guideline', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'exam':
      return { label: 'Exam Info', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    case 'reminder':
      return { label: 'Reminder', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    case 'tip':
      return { label: 'Exam Tip', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
    default:
      return { label: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General', bg: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
  }
}

function getCategoryTheme(category: string | null) {
  switch (category?.toLowerCase()) {
    case 'recruitment':
      return { 
        eyebrow: 'RECRUITMENT', 
        textColor: 'text-amber-400', 
        lineColor: 'bg-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
      };
    case 'schedule':
      return { 
        eyebrow: 'EXAM SCHEDULE', 
        textColor: 'text-blue-400', 
        lineColor: 'bg-blue-400',
        badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
      };
    case 'eligibility':
      return { 
        eyebrow: 'ELIGIBILITY & CONDITIONS', 
        textColor: 'text-cyan-400', 
        lineColor: 'bg-cyan-400',
        badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
      };
    case 'result':
      return { 
        eyebrow: 'EXAM RESULTS', 
        textColor: 'text-emerald-400', 
        lineColor: 'bg-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
      };
    case 'guideline':
      return { 
        eyebrow: 'GUIDELINES & INSTRUCTIONS', 
        textColor: 'text-purple-400', 
        lineColor: 'bg-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20'
      };
    default:
      return { 
        eyebrow: (category || 'ANNOUNCEMENT').toUpperCase(), 
        textColor: 'text-rose-500', 
        lineColor: 'bg-rose-500',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
      };
  }
}

interface DeadlineInfo {
  dateStr: string;
  formattedDate: string;
  daysRemaining: number;
  status: 'urgent' | 'closing_soon' | 'active' | 'expired';
  label: string;
  badgeBg: string;
  examDate?: string | null;
}

function getDeadlineInfo(ann: AnnouncementItem): DeadlineInfo | null {
  let dateVal: string | null = null;
  let examDateVal: string | null = null;
  
  // 1. Check structured metadata in attachments
  if (ann.attachments && typeof ann.attachments === 'object') {
    if (!Array.isArray(ann.attachments)) {
      if ((ann.attachments as any).deadlineDate) dateVal = (ann.attachments as any).deadlineDate;
      if ((ann.attachments as any).examDate) examDateVal = (ann.attachments as any).examDate;
    } else if (Array.isArray(ann.attachments)) {
      const meta = ann.attachments.find((item: any) => item?.deadlineDate || item?.examDate || item?.type === 'meta');
      if (meta?.deadlineDate) dateVal = meta.deadlineDate;
      if (meta?.examDate) examDateVal = meta.examDate;
    }
  }

  // 2. Fallback: Parse date from summary or content if contains YYYY-MM-DD or standard keywords
  if (!dateVal && (ann.summary || ann.content)) {
    const text = `${ann.summary || ''} ${ann.content || ''}`;
    const isoMatch = text.match(/\b(202[4-9]-\d{2}-\d{2})\b/);
    if (isoMatch) {
      dateVal = isoMatch[1];
    }
  }

  if (!dateVal) return null;

  try {
    const deadline = new Date(dateVal);
    if (isNaN(deadline.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDay = new Date(deadline);
    deadlineDay.setHours(0, 0, 0, 0);

    const diffTime = deadlineDay.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (daysRemaining < 0) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'expired',
        label: 'Deadline Passed',
        badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        examDate: examDateVal,
      };
    } else if (daysRemaining === 0) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'urgent',
        label: 'Ends Today!',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse',
        examDate: examDateVal,
      };
    } else if (daysRemaining <= 3) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'urgent',
        label: `${daysRemaining}d left (Closing Soon)`,
        badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        examDate: examDateVal,
      };
    } else if (daysRemaining <= 7) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'closing_soon',
        label: `${daysRemaining}d remaining`,
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        examDate: examDateVal,
      };
    } else {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'active',
        label: `${daysRemaining} days left`,
        badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        examDate: examDateVal,
      };
    }
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────── App ── */
export default function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (err) {
      console.error("Sign out error:", err);
    }
    window.location.href = `${window.location.protocol}//${window.location.hostname}:3000?logout=true`;
  };

  const [tab, setTab] = useState<Tab>('upload');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  /* Papers filter state */
  const [search, setSearch] = useState('');
  const [filterExam, setFilterExam] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  /* Announcements filter state */
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementFilterExam, setAnnouncementFilterExam] = useState<string | null>(null);
  const [announcementFilterCategory, setAnnouncementFilterCategory] = useState<string | null>(null);

  /* Users filter state */
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string | null>(null);
  const [userExamFilter, setUserExamFilter] = useState<string | null>(null);

  /* Modals */
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<AnnouncementItem | null>(null);

  /* User Modals & Form State */
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);
  const [userSubmitStatus, setUserSubmitStatus] = useState<UploadStatus>('idle');
  const [userError, setUserError] = useState('');

  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'candidate',
  });

  /* Announcement Form */
  const [announcementForm, setAnnouncementForm] = useState({
    examId: '',
    title: '',
    summary: '',
    content: '',
    category: 'recruitment',
    isUrgent: false,
    deadlineDate: '',
    examDate: '',
    attachmentUrl: '',
  });
  const [announcementFile, setAnnouncementFile] = useState<File | null>(null);
  const [announcementSubmitStatus, setAnnouncementSubmitStatus] = useState<UploadStatus>('idle');
  const [announcementError, setAnnouncementError] = useState('');

  /* upload paper form state */
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
    if (getToken) {
      setTokenGetter(getToken);
    }
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
      const [subRes, paperRes, annRes, examRes, userRes] = await Promise.all([
        api.get<{ subjects: Subject[] }>('/subjects').catch(() => null),
        api.get<{ papers: PastPaper[] }>('/papers').catch(() => null),
        api.get<{ announcements: AnnouncementItem[] }>('/announcements').catch(() => null),
        api.get<{ exams: Exam[] }>('/exams').catch(() => null),
        api.get<{ users: UserItem[] }>('/users').catch(() => null),
      ]);
      if (subRes?.subjects) setSubjects(subRes.subjects);
      if (paperRes?.papers) setPapers(paperRes.papers);
      if (annRes?.announcements) setAnnouncements(annRes.announcements);
      if (examRes?.exams) setExams(examRes.exams);
      if (userRes?.users) setUsers(userRes.users);
    } catch (err) {
      console.error('Fetch failed:', err);
    }
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── file drag & drop for papers ── */
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

  /* ── submit paper ── */
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

  /* ── announcements actions ── */
  const openNewAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementFile(null);
    setAnnouncementForm({
      examId: exams[0]?.examId?.toString() || (subjects[0]?.examId?.toString() || '1'),
      title: '',
      summary: '',
      content: '',
      category: 'recruitment',
      isUrgent: false,
      deadlineDate: '',
      examDate: '',
      attachmentUrl: '',
    });
    setAnnouncementError('');
    setAnnouncementSubmitStatus('idle');
    setIsAnnouncementModalOpen(true);
  };

  const openEditAnnouncementModal = (ann: AnnouncementItem) => {
    setEditingAnnouncement(ann);
    setAnnouncementFile(null);
    let existingUrl = '';
    let existingDeadline = '';
    let existingExamDate = '';

    if (Array.isArray(ann.attachments)) {
      const fileAtt = ann.attachments.find((att: any) => att?.url);
      if (fileAtt?.url) existingUrl = fileAtt.url;

      const meta = ann.attachments.find((item: any) => item?.deadlineDate || item?.examDate || item?.type === 'meta');
      if (meta?.deadlineDate) existingDeadline = meta.deadlineDate;
      if (meta?.examDate) existingExamDate = meta.examDate;
    } else if (typeof ann.attachments === 'string') {
      existingUrl = ann.attachments;
    }

    setAnnouncementForm({
      examId: String(ann.examId),
      title: ann.title || '',
      summary: ann.summary || '',
      content: ann.content || '',
      category: ann.category || 'recruitment',
      isUrgent: Boolean(ann.isUrgent),
      deadlineDate: existingDeadline,
      examDate: existingExamDate,
      attachmentUrl: existingUrl,
    });
    setAnnouncementError('');
    setAnnouncementSubmitStatus('idle');
    setIsAnnouncementModalOpen(true);
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title.trim()) {
      setAnnouncementError('Title is required.');
      return;
    }
    if (!announcementForm.examId) {
      setAnnouncementError('Please select a target exam.');
      return;
    }

    setAnnouncementError('');
    setAnnouncementSubmitStatus('uploading-storage');

    try {
      const metaObj = {
        type: 'meta',
        deadlineDate: announcementForm.deadlineDate ? announcementForm.deadlineDate.trim() : null,
        examDate: announcementForm.examDate ? announcementForm.examDate.trim() : null,
      };

      let attachmentPayload: any[] = [];

      if (announcementFile) {
        const { publicUrl, fileSize } = await uploadAnnouncementToStorage(announcementFile);
        attachmentPayload.push({
          name: announcementFile.name,
          url: publicUrl,
          size: fileSize,
        });
      } else if (announcementForm.attachmentUrl.trim()) {
        attachmentPayload.push({
          name: 'Attached Document',
          url: announcementForm.attachmentUrl.trim(),
          size: 'External file',
        });
      } else if (editingAnnouncement?.attachments && Array.isArray(editingAnnouncement.attachments)) {
        const existingFiles = editingAnnouncement.attachments.filter((att: any) => att?.url);
        attachmentPayload.push(...existingFiles);
      }

      // Add deadline & exam schedule metadata
      attachmentPayload.push(metaObj);

      setAnnouncementSubmitStatus('saving-db');

      const payload = {
        examId: Number(announcementForm.examId),
        title: announcementForm.title.trim(),
        summary: announcementForm.summary.trim() || null,
        content: announcementForm.content.trim() || null,
        category: announcementForm.category || 'announcement',
        isUrgent: announcementForm.isUrgent,
        attachments: attachmentPayload,
      };

      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement.announcementId}`, payload);
      } else {
        await api.post('/announcements', payload);
      }

      setAnnouncementSubmitStatus('success');
      setIsAnnouncementModalOpen(false);
      setEditingAnnouncement(null);
      setAnnouncementFile(null);

      // Refresh announcements
      const res = await api.get<{ announcements: AnnouncementItem[] }>('/announcements');
      if (res?.announcements) setAnnouncements(res.announcements);
    } catch (err: unknown) {
      setAnnouncementSubmitStatus('error');
      setAnnouncementError(err instanceof Error ? err.message : 'Failed to save announcement.');
      console.error(err);
    }
  };

  const handleAnnouncementDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a.announcementId !== id));
      if (viewingAnnouncement?.announcementId === id) {
        setViewingAnnouncement(null);
      }
    } catch (err) {
      console.error('Delete announcement failed:', err);
      alert('Failed to delete announcement. Check console for details.');
    }
  };

  /* ── user actions ── */
  const openNewUserModal = () => {
    setEditingUser(null);
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'candidate',
    });
    setUserError('');
    setUserSubmitStatus('idle');
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: UserItem) => {
    setEditingUser(u);
    setUserForm({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email || '',
      phoneNumber: u.phoneNumber || '',
      role: u.role || 'candidate',
    });
    setUserError('');
    setUserSubmitStatus('idle');
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.firstName.trim() || !userForm.lastName.trim() || !userForm.email.trim()) {
      setUserError('First name, last name, and email are required.');
      return;
    }

    setUserError('');
    setUserSubmitStatus('saving-db');

    try {
      const payload = {
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        email: userForm.email.trim().toLowerCase(),
        phoneNumber: userForm.phoneNumber.trim() || null,
        role: userForm.role,
      };

      if (editingUser) {
        await api.put(`/users/${editingUser.userId}`, payload);
      } else {
        await api.post('/users', payload);
      }

      setUserSubmitStatus('success');
      setIsUserModalOpen(false);
      setEditingUser(null);

      // Refresh users
      const res = await api.get<{ users: UserItem[] }>('/users');
      if (res?.users) setUsers(res.users);
    } catch (err: unknown) {
      setUserSubmitStatus('error');
      setUserError(err instanceof Error ? err.message : 'Failed to save user.');
      console.error(err);
    }
  };

  const handleUserDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? All their progress records and data will be removed.')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.userId !== userId));
      if (viewingUser?.userId === userId) setViewingUser(null);
    } catch (err) {
      console.error('Delete user failed:', err);
      alert('Failed to delete user. Check console for details.');
    }
  };

  /* ── filtered users ── */
  const filteredUsers = users.filter(u => {
    if (userRoleFilter && u.role?.toLowerCase() !== userRoleFilter.toLowerCase()) return false;
    if (userExamFilter && String(u.targetExamId) !== userExamFilter && u.targetExam?.examName !== userExamFilter) return false;
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phoneNumber && u.phoneNumber.includes(q)) ||
      (u.targetExam?.examName && u.targetExam.examName.toLowerCase().includes(q))
    );
  });

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

  /* ── filtered announcements ── */
  const filteredAnnouncements = announcements.filter(a => {
    if (announcementFilterExam && a.exam?.examName !== announcementFilterExam && a.exam?.examType !== announcementFilterExam) return false;
    if (announcementFilterCategory) {
      if (announcementFilterCategory === 'urgent') {
        if (!a.isUrgent) return false;
      } else if (a.category?.toLowerCase() !== announcementFilterCategory.toLowerCase()) {
        return false;
      }
    }
    if (!announcementSearch) return true;
    const q = announcementSearch.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.summary && a.summary.toLowerCase().includes(q)) ||
      (a.content && a.content.toLowerCase().includes(q)) ||
      (a.exam?.examName && a.exam.examName.toLowerCase().includes(q)) ||
      (a.category && a.category.toLowerCase().includes(q))
    );
  });

  /* ─────────────────────────────────────────── render ── */
  if (!isLoaded || (isSignedIn && isAdmin === null)) {
    return <div className="flex h-screen items-center justify-center bg-[#08090B] text-white">Loading PassKru Admin...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#08090B] text-white space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
        <div className="flex items-center gap-3 mt-4">
          <a href={`${window.location.protocol}//${window.location.hostname}:3000`} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-white transition border border-slate-700 text-sm">
            Back to User Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-xl font-bold transition text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
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
              <p className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {([
            { id: 'upload' as Tab, label: 'Upload Paper', icon: FilePlus2 },
            { id: 'dashboard' as Tab, label: 'Paper Library', icon: LayoutDashboard },
            { id: 'announcements' as Tab, label: 'Announcements', icon: Megaphone },
            { id: 'users' as Tab, label: 'Manage Users', icon: Users },
          ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-[#8E929E] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-[#5A5E6B]'}`} />
                {item.label}
                {item.id === 'announcements' && announcements.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {announcements.length}
                  </span>
                )}
                {item.id === 'users' && users.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {users.length}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
            <a
              href={`${window.location.protocol}//${window.location.hostname}:3000?viewAsUser=true`}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8E929E] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#5A5E6B]" />
              Back to User Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer text-left"
              title="Log out and return to landing page"
            >
              <LogOut className="w-4 h-4 text-rose-400/70" />
              Log Out
            </button>
          </div>
        </nav>

        {/* Status footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#5A5E6B]">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span><span className="text-emerald-400 font-bold">{papers.length}</span> papers · <span className="text-indigo-400 font-bold">{announcements.length}</span> notices</span>
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
              Admin Mode
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
              {tab === 'upload' ? 'Upload Past Paper' : tab === 'dashboard' ? 'Paper Library' : tab === 'announcements' ? 'Manage Announcements' : 'User Management'}
            </h1>
            <p className="text-[11px] text-[#5A5E6B]">
              {tab === 'upload'
                ? 'Upload PDF → Supabase Storage · Save metadata → PostgreSQL'
                : tab === 'dashboard'
                ? 'All past papers currently stored in the database'
                : tab === 'announcements'
                ? 'Create, update, and broadcast official exam announcements to candidates'
                : 'Create, update roles, manage study targets, and monitor registered candidates'}
            </p>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto">

          {/* ═══════════════════════════════ UPLOAD PAPER TAB ═══════════════════════════ */}
          {tab === 'upload' && (
            <div className="space-y-6">

              {/* Success banner */}
              {uploadStatus === 'success' && lastUploaded && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4 animate-in fade-in-50 duration-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-300">Paper uploaded successfully!</p>
                    <p className="text-xs text-emerald-400/80 mt-0.5">
                      "{lastUploaded.title}" is now available to students.
                    </p>
                    {lastUploaded.fileUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => setPreviewPdfUrl(lastUploaded.fileUrl)}
                          className="text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview PDF
                        </button>
                        <a
                          href={lastUploaded.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400/70 hover:text-emerald-300 flex items-center gap-1 transition"
                        >
                          Open in new tab <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setUploadStatus('idle')}
                    className="text-[#5A5E6B] hover:text-white p-1 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error banner */}
              {uploadStatus === 'error' && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-rose-300">Upload failed</p>
                    <p className="text-xs text-rose-400/80 mt-0.5">{uploadError}</p>
                  </div>
                  <button
                    onClick={() => setUploadStatus('idle')}
                    className="text-[#5A5E6B] hover:text-white p-1 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Drag-and-drop zone */}
                <div>
                  <label className="block text-xs font-semibold text-[#8E929E] mb-2 uppercase tracking-wider">
                    PDF Document <span className="text-rose-400">*</span>
                  </label>
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                        : file
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={onFileChange}
                    />

                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-white">{file.name}</p>
                        <p className="text-xs text-[#5A5E6B]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · Click or drag to replace
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-indigo-400" />
                        </div>
                        <p className="text-sm font-bold text-white">Drop your PDF here, or <span className="text-indigo-400">browse</span></p>
                        <p className="text-xs text-[#5A5E6B]">Only PDF files up to 50MB are supported</p>
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
                    placeholder="e.g. 2024 Grade 12 National Exam - Mathematics"
                    className="w-full px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 outline-none transition"
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
                        className="w-full appearance-none px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9 cursor-pointer"
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
                        className="w-full appearance-none px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9 disabled:opacity-50 cursor-pointer"
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
                        className="w-full appearance-none px-4 py-3 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9 cursor-pointer"
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
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${form.hasAnswerKey ? 'bg-indigo-600' : 'bg-[#1A1D24]'}`}
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
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
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
              </form>
            </div>
          )}

          {/* ═══════════════════════════════ PAPER LIBRARY TAB ═══════════════════════════ */}
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

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2 pb-3 border-b border-white/5">
                <button 
                  onClick={() => setFilterType(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${!filterType ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                  All Types
                </button>
                <button 
                  onClick={() => setFilterType('past-paper')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${filterType === 'past-paper' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                  Past Papers
                </button>
                <button 
                  onClick={() => setFilterType('prepare-paper')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${filterType === 'prepare-paper' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                  Prepare Papers
                </button>
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
                        {paper.fileUrl && paper.fileUrl.startsWith('http') ? (
                          <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none transition-transform duration-500 group-hover:scale-[0.26]">
                            <iframe 
                              src={`${paper.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                              className="w-full h-full border-none"
                              title={`Thumbnail for ${paper.title}`}
                            />
                          </div>
                        ) : (
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
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(paper.paperId);
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg text-xs font-bold text-[#5A5E6B] hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Delete Paper"
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

          {/* ═══════════════════════════════ ANNOUNCEMENTS TAB ═══════════════════════════ */}
          {tab === 'announcements' && (
            <div className="space-y-6">
              
              {/* Top Action & Exam Stat Cards */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-400" />
                    Official Announcements
                  </h2>
                  <p className="text-xs text-[#8E929E]">
                    Broadcast exam schedules, recruitment updates, guidelines, and urgent notices
                  </p>
                </div>
                <button
                  onClick={openNewAnnouncementModal}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Post New Announcement
                </button>
              </div>

              {/* Big Exam Filter Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  onClick={() => setAnnouncementFilterExam(null)}
                  className={`bg-[#0D0F12] rounded-2xl p-4 cursor-pointer transition-all border-2 ${!announcementFilterExam ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <p className={`text-xs font-medium mb-1 ${!announcementFilterExam ? 'text-indigo-400' : 'text-[#5A5E6B]'}`}>All Exams</p>
                  <p className={`text-3xl font-black ${!announcementFilterExam ? 'text-white' : 'text-[#8E929E]'}`}>{announcements.length}</p>
                </div>
                {['Elementary Exam', 'Secondary Exam', 'High School Exam'].map(examName => {
                  const count = announcements.filter(a => a.exam?.examName === examName || a.exam?.examType === examName).length;
                  const active = announcementFilterExam === examName;
                  return (
                    <div 
                      key={examName}
                      onClick={() => setAnnouncementFilterExam(examName)}
                      className={`bg-[#0D0F12] rounded-2xl p-4 cursor-pointer transition-all border-2 ${active ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <p className={`text-xs font-medium mb-1 truncate ${active ? 'text-indigo-400' : 'text-[#5A5E6B]'}`} title={examName}>{examName}</p>
                      <p className={`text-3xl font-black ${active ? 'text-white' : 'text-[#8E929E]'}`}>{count}</p>
                    </div>
                  );
                })}
              </div>

              {/* Category Pills Filter */}
              <div className="flex flex-wrap gap-2 pb-3 border-b border-white/5">
                {[
                  { id: null, label: 'All Categories' },
                  { id: 'urgent', label: '🔥 Urgent Only' },
                  { id: 'recruitment', label: 'Recruitment' },
                  { id: 'schedule', label: 'Schedule' },
                  { id: 'eligibility', label: 'Eligibility' },
                  { id: 'result', label: 'Result' },
                  { id: 'guideline', label: 'Guideline' },
                ].map(cat => {
                  const active = announcementFilterCategory === cat.id;
                  return (
                    <button 
                      key={cat.id || 'all'}
                      onClick={() => setAnnouncementFilterCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        active 
                          ? cat.id === 'urgent'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                            : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                          : 'bg-white/5 text-[#8E929E] border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
                <input
                  type="text"
                  value={announcementSearch}
                  onChange={e => setAnnouncementSearch(e.target.value)}
                  placeholder="Search announcements by title, summary, or content…"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D0F12] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              {/* Announcement List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="text-center py-20 text-[#5A5E6B] bg-[#0D0F12]/50 border border-white/5 rounded-2xl">
                  <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400" />
                  <p className="text-sm font-semibold text-white">No announcements found</p>
                  <p className="text-xs mt-1 text-[#8E929E]">Post your first exam announcement to broadcast updates to candidates.</p>
                  <button
                    onClick={openNewAnnouncementModal}
                    className="mt-4 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    + Post Announcement
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAnnouncements.map(ann => {
                    const theme = getCategoryTheme(ann.category);
                    const deadlineInfo = getDeadlineInfo(ann);
                    const formattedDate = ann.publishDate 
                      ? new Date(ann.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Recently';
                    
                    let pdfUrl: string | null = null;
                    if (Array.isArray(ann.attachments) && ann.attachments[0]?.url) {
                      pdfUrl = ann.attachments[0].url;
                    } else if (typeof ann.attachments === 'string' && ann.attachments.startsWith('http')) {
                      pdfUrl = ann.attachments;
                    }

                    return (
                      <div
                        key={ann.announcementId}
                        className="group relative flex flex-col justify-between bg-[#0B0D11] border border-white/[0.08] hover:border-indigo-500/40 rounded-3xl p-7 sm:p-9 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                      >
                        {/* Geometric circular concentric background arc graphics */}
                        <div className="absolute right-[-10%] top-[-20%] w-[380px] h-[380px] pointer-events-none select-none opacity-20 group-hover:opacity-35 transition-opacity duration-500">
                          <svg viewBox="0 0 400 400" className="w-full h-full text-white/10 fill-none stroke-current" strokeWidth="2.5">
                            <circle cx="200" cy="200" r="80" />
                            <circle cx="200" cy="200" r="130" />
                            <circle cx="200" cy="200" r="180" />
                            <circle cx="200" cy="200" r="230" strokeDasharray="6 6" />
                          </svg>
                        </div>
                        {/* Ambient gradient glow */}
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-600/[0.04] blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                          {/* Eyebrow Category Header with Accent Line */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-black tracking-[0.25em] uppercase ${theme.textColor}`}>
                                  {theme.eyebrow}
                                </span>
                                {ann.isUrgent && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                                    <Flame className="w-3 h-3 fill-rose-400" /> URGENT
                                  </span>
                                )}
                              </div>
                              <div className={`w-9 h-[3px] rounded-full ${theme.lineColor}`} />
                            </div>

                            <div className="flex items-center gap-2">
                              {ann.exam?.examName && (
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.06] text-slate-300 border border-white/10 backdrop-blur-md">
                                  {ann.exam.examName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Big Hero Title */}
                          <h3 
                            onClick={() => setViewingAnnouncement(ann)}
                            className="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-200 transition-colors tracking-tight leading-[1.25] cursor-pointer"
                          >
                            {ann.title}
                          </h3>

                          {/* Content Summary / Excerpt */}
                          <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-normal">
                            {ann.summary || ann.content || 'Official Examination Announcement details and candidate guidelines.'}
                          </p>

                          {/* Deadline & Key Dates Highlight Box */}
                          {deadlineInfo && (
                            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${deadlineInfo.badgeBg} bg-black/40 backdrop-blur-md`}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                                  <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Deadline</p>
                                  <p className="text-sm sm:text-base font-black text-white">{deadlineInfo.formattedDate}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-black/60 border border-white/10 text-white shadow-sm flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                  {deadlineInfo.label}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer with Metadata & Actions */}
                        <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              Published: <strong className="text-slate-300">{formattedDate}</strong>
                            </span>
                            {pdfUrl && (
                              <button
                                onClick={() => setPreviewPdfUrl(pdfUrl)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition cursor-pointer"
                              >
                                <Paperclip className="w-3.5 h-3.5" /> View PDF Document
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingAnnouncement(ann)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Full
                            </button>
                            <button
                              onClick={() => openEditAnnouncementModal(ann)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                              title="Edit Announcement"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleAnnouncementDelete(ann.announcementId)}
                              className="p-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition flex items-center justify-center cursor-pointer"
                              title="Delete Announcement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════ USER MANAGEMENT TAB ═══════════════════════════ */}
          {tab === 'users' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Top Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Registered Users & Candidates
                  </h2>
                  <p className="text-xs text-[#8E929E] mt-0.5">
                    Manage system users, assign administrator privileges, and view learning engagement
                  </p>
                </div>

                <button
                  onClick={openNewUserModal}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" /> Add New User
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#0D0F12] border border-white/5 space-y-1">
                  <p className="text-[11px] font-semibold text-[#8E929E] uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-black text-white">{users.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#0D0F12] border border-white/5 space-y-1">
                  <p className="text-[11px] font-semibold text-[#8E929E] uppercase tracking-wider">Candidates</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {users.filter(u => u.role?.toLowerCase() === 'candidate').length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#0D0F12] border border-white/5 space-y-1">
                  <p className="text-[11px] font-semibold text-[#8E929E] uppercase tracking-wider">Administrators</p>
                  <p className="text-2xl font-black text-indigo-400">
                    {users.filter(u => u.role?.toLowerCase() === 'admin').length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#0D0F12] border border-white/5 space-y-1">
                  <p className="text-[11px] font-semibold text-[#8E929E] uppercase tracking-wider">Active Targets</p>
                  <p className="text-2xl font-black text-amber-400">
                    {users.filter(u => u.targetExamId).length}
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5E6B]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, phone, or exam..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-xs text-white placeholder-[#5A5E6B] focus:outline-none focus:border-emerald-500/50 transition"
                  />
                  {userSearch && (
                    <button onClick={() => setUserSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A5E6B] hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setUserRoleFilter(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      userRoleFilter === null ? 'bg-emerald-600 text-white' : 'bg-white/5 text-[#8E929E] hover:text-white'
                    }`}
                  >
                    All Roles
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('candidate')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      userRoleFilter === 'candidate' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-[#8E929E] hover:text-white'
                    }`}
                  >
                    Candidates
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('admin')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      userRoleFilter === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-[#8E929E] hover:text-white'
                    }`}
                  >
                    Admins
                  </button>

                  {exams.length > 0 && (
                    <div className="relative">
                      <select
                        value={userExamFilter || ''}
                        onChange={e => setUserExamFilter(e.target.value || null)}
                        className="px-3 py-1.5 bg-[#0D0F12] border border-white/10 rounded-xl text-xs text-[#8E929E] focus:text-white focus:outline-none cursor-pointer"
                      >
                        <option value="">All Exams</option>
                        {exams.map(ex => (
                          <option key={ex.examId} value={String(ex.examId)}>{ex.examName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Users List / Grid */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-[#0D0F12] border border-white/5 rounded-2xl space-y-3">
                  <Users className="w-10 h-10 text-[#5A5E6B] mx-auto" />
                  <p className="text-sm font-semibold text-white">No users found</p>
                  <p className="text-xs text-[#5A5E6B]">Try adjusting your search query or role filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map(u => {
                    const initials = `${u.firstName?.charAt(0) || ''}${u.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
                    const isAdminRole = u.role?.toLowerCase() === 'admin';
                    const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

                    return (
                      <div
                        key={u.userId}
                        className="bg-[#0D0F12] border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 transition-all hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between group space-y-4"
                      >
                        <div className="space-y-3">
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt={u.firstName} className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0" />
                              ) : (
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md ${
                                  isAdminRole ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                                }`}>
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                                  {u.firstName} {u.lastName}
                                </p>
                                <p className="text-xs text-[#8E929E] truncate flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#5A5E6B] shrink-0" />
                                  <span className="truncate">{u.email}</span>
                                </p>
                              </div>
                            </div>

                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shrink-0 flex items-center gap-1 ${
                              isAdminRole 
                                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {isAdminRole ? <Shield className="w-3 h-3 text-indigo-400" /> : <GraduationCap className="w-3 h-3 text-emerald-400" />}
                              {u.role || 'candidate'}
                            </span>
                          </div>

                          {/* Role Specific Info Strip */}
                          {isAdminRole ? (
                            <div className="p-3.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center gap-2.5">
                              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-indigo-300">System Administrator</p>
                                <p className="text-[10px] text-indigo-200/70">Full publishing & management permissions</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-[#111317] rounded-xl border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-[#5A5E6B] font-medium">Target Exam:</span>
                                <span className="text-white font-semibold truncate max-w-[170px]">
                                  {u.targetExam?.examName || 'Candidate Account'}
                                </span>
                              </div>
                              {u.phoneNumber && (
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#5A5E6B] font-medium">Phone:</span>
                                  <span className="text-slate-300 font-medium">{u.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-[#5A5E6B]">Joined {joinedDate}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setViewingUser(u)}
                              className="p-1.5 text-xs text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="p-1.5 text-xs text-[#8E929E] hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition cursor-pointer"
                              title="Edit User"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleUserDelete(u.userId)}
                              className="p-1.5 text-xs text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ── CREATE / EDIT USER MODAL ── */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111317]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                {editingUser ? 'Edit User Profile' : 'Create New User'}
              </h3>
              <button 
                onClick={() => setIsUserModalOpen(false)} 
                className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {userError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{userError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8E929E]">First Name *</label>
                  <input
                    type="text"
                    required
                    value={userForm.firstName}
                    onChange={e => setUserForm({ ...userForm, firstName: e.target.value })}
                    placeholder="e.g. Sokha"
                    className="w-full px-3.5 py-2 bg-[#111317] border border-white/10 rounded-xl text-xs text-white placeholder-[#5A5E6B] focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8E929E]">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={userForm.lastName}
                    onChange={e => setUserForm({ ...userForm, lastName: e.target.value })}
                    placeholder="e.g. Chan"
                    className="w-full px-3.5 py-2 bg-[#111317] border border-white/10 rounded-xl text-xs text-white placeholder-[#5A5E6B] focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8E929E]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="e.g. sokha.chan@example.com"
                  className="w-full px-3.5 py-2 bg-[#111317] border border-white/10 rounded-xl text-xs text-white placeholder-[#5A5E6B] focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8E929E]">Phone Number</label>
                  <input
                    type="text"
                    value={userForm.phoneNumber}
                    onChange={e => setUserForm({ ...userForm, phoneNumber: e.target.value })}
                    placeholder="e.g. 012 345 678"
                    className="w-full px-3.5 py-2 bg-[#111317] border border-white/10 rounded-xl text-xs text-white placeholder-[#5A5E6B] focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8E929E]">User Role *</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#111317] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="candidate">Candidate (Student)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Role Info Box */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                userForm.role === 'admin' 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
              }`}>
                {userForm.role === 'admin' ? (
                  <>
                    <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Administrator:</strong> Can access the Admin Dashboard, manage past papers, publish announcements, and manage system users.</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Candidate:</strong> Standard user account for students taking quizzes, practicing papers, and viewing announcements.</span>
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userSubmitStatus === 'saving-db'}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {userSubmitStatus === 'saving-db' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {editingUser ? 'Update User' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW USER DETAILS MODAL ── */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingUser(null)} />
          <div className="relative w-full max-w-lg bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111317]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                User Profile & Learning Overview
              </h3>
              <button onClick={() => setViewingUser(null)} className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${
                  viewingUser.role?.toLowerCase() === 'admin' ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                }`}>
                  {`${viewingUser.firstName?.charAt(0) || ''}${viewingUser.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{viewingUser.firstName} {viewingUser.lastName}</h4>
                  <p className="text-xs text-[#8E929E]">{viewingUser.email}</p>
                  {viewingUser.phoneNumber && (
                    <p className="text-xs text-[#5A5E6B] mt-0.5">📞 {viewingUser.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#111317] rounded-xl border border-white/5">
                  <p className="text-[10px] text-[#5A5E6B] uppercase font-bold">Role & Permissions</p>
                  <p className="text-xs font-bold text-white mt-1 capitalize">{viewingUser.role || 'candidate'}</p>
                </div>
                <div className="p-3 bg-[#111317] rounded-xl border border-white/5">
                  <p className="text-[10px] text-[#5A5E6B] uppercase font-bold">Authentication</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1">{viewingUser.clerkId ? 'Clerk Synced' : 'Database Account'}</p>
                </div>
              </div>

              {viewingUser.role?.toLowerCase() === 'admin' ? (
                <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                    <Shield className="w-4 h-4" /> System Administrator Permissions
                  </div>
                  <p className="text-xs text-indigo-200/80 leading-relaxed">
                    This account possesses full administrator rights to manage past papers, publish exam announcements, and manage user roles and accounts.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[#111317] rounded-xl border border-white/5 space-y-2">
                  <p className="text-xs font-bold text-white">Target Examination</p>
                  <p className="text-sm font-semibold text-emerald-300">
                    {viewingUser.targetExam?.examName || 'Candidate Account'}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/10 bg-[#111317] flex items-center justify-between">
              <button
                onClick={() => handleUserDelete(viewingUser.userId)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete User
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const u = viewingUser;
                    setViewingUser(null);
                    openEditUserModal(u);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Profile
                </button>
                <button
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT ANNOUNCEMENT MODAL ── */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAnnouncementModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111317]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button 
                onClick={() => setIsAnnouncementModalOpen(false)} 
                className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAnnouncementSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Error Box */}
              {announcementError && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{announcementError}</span>
                </div>
              )}

              {/* Target Exam & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8E929E] mb-1.5 uppercase tracking-wider">
                    Target Exam <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={announcementForm.examId}
                      onChange={e => setAnnouncementForm(f => ({ ...f, examId: e.target.value }))}
                      className="w-full appearance-none px-4 py-2.5 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9 cursor-pointer"
                    >
                      <option value="">— Select Target Exam —</option>
                      {exams.length > 0 ? (
                        exams.map(ex => (
                          <option key={ex.examId} value={ex.examId}>
                            {ex.examName}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="1">Elementary Exam (PTTC)</option>
                          <option value="2">Secondary Exam (RTTC)</option>
                          <option value="3">High School Exam (NIE)</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5A5E6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E929E] mb-1.5 uppercase tracking-wider">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={announcementForm.category}
                      onChange={e => setAnnouncementForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full appearance-none px-4 py-2.5 bg-[#111317] border border-white/8 rounded-xl text-sm text-white focus:border-indigo-500/60 outline-none transition pr-9 cursor-pointer"
                    >
                      <option value="recruitment">Recruitment (ជ្រើសរើសគ្រូបង្រៀន)</option>
                      <option value="schedule">Exam Schedule (កាលវិភាគប្រឡង)</option>
                      <option value="eligibility">Eligibility & Requirements (លក្ខខណ្ឌជ្រើសរើស)</option>
                      <option value="result">Exam Results (លទ្ធផលប្រឡង)</option>
                      <option value="guideline">Guidelines & Instructions (សេចក្តីណែនាំ)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5A5E6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#8E929E] mb-1.5 uppercase tracking-wider">
                  Announcement Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Official Examination Schedule for 2026 Pedagogy Entrance"
                  className="w-full px-4 py-2.5 bg-[#111317] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 outline-none transition"
                />
              </div>

              {/* Deadlines & Important Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111317] p-4 rounded-xl border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-indigo-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={announcementForm.deadlineDate}
                    onChange={e => setAnnouncementForm(f => ({ ...f, deadlineDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0D0F12] border border-white/10 rounded-xl text-xs text-white focus:border-indigo-500/60 outline-none transition"
                  />
                  <p className="text-[10px] text-[#5A5E6B] mt-1">Displays live countdown & alerts candidate</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Exam / Event Date
                  </label>
                  <input
                    type="date"
                    value={announcementForm.examDate}
                    onChange={e => setAnnouncementForm(f => ({ ...f, examDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0D0F12] border border-white/10 rounded-xl text-xs text-white focus:border-indigo-500/60 outline-none transition"
                  />
                  <p className="text-[10px] text-[#5A5E6B] mt-1">Target date of official examination</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-[#8E929E] mb-1.5 uppercase tracking-wider">
                  Summary / Highlight
                </label>
                <textarea
                  rows={2}
                  value={announcementForm.summary}
                  onChange={e => setAnnouncementForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="Brief 1-2 sentence overview shown in notifications and cards…"
                  className="w-full px-4 py-2.5 bg-[#111317] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 outline-none transition resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-[#8E929E] mb-1.5 uppercase tracking-wider">
                  Full Announcement Content
                </label>
                <textarea
                  rows={5}
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Detailed announcement information, requirements, steps, venue, and notes…"
                  className="w-full px-4 py-2.5 bg-[#111317] border border-white/8 rounded-xl text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 outline-none transition resize-y"
                />
              </div>

              {/* Urgent Toggle Switch */}
              <div className="flex items-center justify-between bg-[#111317] border border-white/8 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${announcementForm.isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-[#5A5E6B]'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Urgent Announcement</p>
                    <p className="text-xs text-[#5A5E6B]">Highlight as high priority and broadcast as critical notification</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAnnouncementForm(f => ({ ...f, isUrgent: !f.isUrgent }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${announcementForm.isUrgent ? 'bg-rose-600' : 'bg-[#1A1D24]'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${announcementForm.isUrgent ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* Attachment File / Link */}
              <div>
                <label className="block text-xs font-semibold text-[#8E929E] mb-1.5 uppercase tracking-wider">
                  Attached PDF Document (Optional)
                </label>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-1 border border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] rounded-xl px-4 py-3 text-center cursor-pointer transition">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) setAnnouncementFile(f);
                        }}
                      />
                      {announcementFile ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          {announcementFile.name} ({(announcementFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      ) : (
                        <span className="text-xs text-[#8E929E] flex items-center justify-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-indigo-400" />
                          Upload PDF to Supabase Storage
                        </span>
                      )}
                    </label>
                    {announcementFile && (
                      <button
                        type="button"
                        onClick={() => setAnnouncementFile(null)}
                        className="p-3 bg-white/5 hover:bg-rose-500/20 text-[#5A5E6B] hover:text-rose-400 rounded-xl transition cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Or external URL */}
                  <div className="relative">
                    <input
                      type="url"
                      value={announcementForm.attachmentUrl}
                      onChange={e => setAnnouncementForm(f => ({ ...f, attachmentUrl: e.target.value }))}
                      placeholder="Or paste external PDF URL link (https://...)"
                      className="w-full px-4 py-2 bg-[#111317] border border-white/8 rounded-xl text-xs text-white placeholder-[#5A5E6B] focus:border-indigo-500/60 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#8E929E] hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={announcementSubmitStatus === 'uploading-storage' || announcementSubmitStatus === 'saving-db'}
                  className={`px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition cursor-pointer flex items-center gap-2 ${
                    announcementSubmitStatus === 'uploading-storage' || announcementSubmitStatus === 'saving-db' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {announcementSubmitStatus === 'uploading-storage' && (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading attachment…</>
                  )}
                  {announcementSubmitStatus === 'saving-db' && (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving announcement…</>
                  )}
                  {(announcementSubmitStatus === 'idle' || announcementSubmitStatus === 'success' || announcementSubmitStatus === 'error') && (
                    editingAnnouncement ? 'Save Changes' : 'Broadcast Announcement'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── VIEW ANNOUNCEMENT DETAIL MODAL ── */}
      {viewingAnnouncement && (() => {
        const modalDeadline = getDeadlineInfo(viewingAnnouncement);
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingAnnouncement(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111317]">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadge(viewingAnnouncement.category).bg}`}>
                  {getCategoryBadge(viewingAnnouncement.category).label}
                </span>
                {viewingAnnouncement.isUrgent && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-rose-400" /> URGENT
                  </span>
                )}
                {modalDeadline && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${modalDeadline.badgeBg}`}>
                    <Clock className="w-3 h-3" /> {modalDeadline.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ann = viewingAnnouncement;
                    setViewingAnnouncement(null);
                    openEditAnnouncementModal(ann);
                  }}
                  className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewingAnnouncement(null)} 
                  className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <h2 className="text-xl font-extrabold text-white leading-snug">
                  {viewingAnnouncement.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#5A5E6B] mt-2">
                  <span>Target: <strong className="text-[#8E929E]">{viewingAnnouncement.exam?.examName || 'All Candidates'}</strong></span>
                  <span>•</span>
                  <span>Published: <strong className="text-[#8E929E]">{new Date(viewingAnnouncement.publishDate).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Deadlines & Timeline Callout Card */}
              {modalDeadline && (
                <div className="p-4 bg-gradient-to-r from-indigo-950/40 to-violet-950/40 border border-indigo-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" /> Key Schedule & Deadlines
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${modalDeadline.badgeBg}`}>
                      {modalDeadline.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-[#0D0F12]/80 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] font-semibold text-[#8E929E] uppercase">Application Deadline</p>
                      <p className="text-sm font-bold text-white mt-0.5">{modalDeadline.formattedDate}</p>
                    </div>

                    {modalDeadline.examDate && (
                      <div className="bg-[#0D0F12]/80 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] font-semibold text-[#8E929E] uppercase">Exam / Event Date</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {new Date(modalDeadline.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {viewingAnnouncement.summary && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">Summary</p>
                  <p className="text-sm text-indigo-100/90 leading-relaxed">{viewingAnnouncement.summary}</p>
                </div>
              )}

              {viewingAnnouncement.content && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#8E929E] uppercase tracking-wider">Announcement Details</p>
                  <div className="text-sm text-[#E2E4E9] whitespace-pre-wrap leading-relaxed bg-[#111317] p-4 rounded-xl border border-white/5">
                    {viewingAnnouncement.content}
                  </div>
                </div>
              )}

              {/* Attachments view */}
              {viewingAnnouncement.attachments && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-[#8E929E] uppercase tracking-wider">Attached Files</p>
                  {Array.isArray(viewingAnnouncement.attachments) ? (
                    viewingAnnouncement.attachments
                      .filter((att: any) => att?.url)
                      .map((att: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#111317] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-white">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="font-medium">{att.name || 'Document'}</span>
                        </div>
                        {att.url && (
                          <button
                            onClick={() => setPreviewPdfUrl(att.url)}
                            className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View PDF
                          </button>
                        )}
                      </div>
                    ))
                  ) : typeof viewingAnnouncement.attachments === 'string' && viewingAnnouncement.attachments.startsWith('http') ? (
                    <div className="flex items-center justify-between p-3 bg-[#111317] border border-white/5 rounded-xl">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="font-medium">Attached PDF</span>
                      </div>
                      <button
                        onClick={() => setPreviewPdfUrl(viewingAnnouncement.attachments)}
                        className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View PDF
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-[#111317] flex items-center justify-between">
              <button
                onClick={() => handleAnnouncementDelete(viewingAnnouncement.announcementId)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Announcement
              </button>
              <button
                onClick={() => setViewingAnnouncement(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        );
      })()}

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
                <button onClick={() => setPreviewPdfUrl(null)} className="p-1.5 text-[#8E929E] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer" title="Close preview">
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
