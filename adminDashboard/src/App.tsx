import React, { useState, useEffect } from 'react';
import { Loader2, Shield, LogOut } from 'lucide-react';
import { useAuth, useUser, useClerk, SignInButton } from '@clerk/clerk-react';
import { uploadPaperToStorage, uploadAnnouncementToStorage } from './lib/supabase';
import { api, setTokenGetter } from './lib/api';

/* Types */
import {
  Tab,
  PastPaper,
  AnnouncementItem,
  UserItem,
  UploadStatus,
} from './types';

/* Hooks */
import { useMetadata } from './hooks/useMetadata';
import { usePapers } from './hooks/usePapers';
import { useAnnouncements } from './hooks/useAnnouncements';
import { useUsers } from './hooks/useUsers';

/* Layout Components */
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

/* Tab Components */
import { UploadPaperTab } from './components/tabs/UploadPaperTab';
import { PaperLibraryTab } from './components/tabs/PaperLibraryTab';
import { AnnouncementsTab } from './components/tabs/AnnouncementsTab';
import { UserManagementTab } from './components/tabs/UserManagementTab';

/* Modal Components */
import { PdfViewerModal } from './components/modals/PdfViewerModal';
import { AnnouncementViewModal } from './components/modals/AnnouncementViewModal';
import { AnnouncementModal } from './components/modals/AnnouncementModal';
import { UserViewModal } from './components/modals/UserViewModal';
import { UserModal } from './components/modals/UserModal';

export default function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const getInitialTab = (): Tab => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab') as Tab;
    if (t && ['upload', 'dashboard', 'prepare-papers', 'announcements', 'users'].includes(t)) {
      return t;
    }
    return 'dashboard';
  };

  const [tab, setTabState] = useState<Tab>(getInitialTab);
  const [filterExam, setFilterExamState] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('exam') || null;
  });

  const setTab = (newTab: Tab) => {
    setTabState(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    url.searchParams.delete('subject');
    window.history.pushState({}, '', url.toString());
  };

  const setFilterExam = (exam: string | null) => {
    setFilterExamState(exam);
    const url = new URL(window.location.href);
    if (exam) {
      url.searchParams.set('exam', exam);
    } else {
      url.searchParams.delete('exam');
    }
    url.searchParams.delete('subject');
    window.history.pushState({}, '', url.toString());
  };

  /* Listen to Browser Back / Forward Button (popstate) */
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab') as Tab;
      if (t && ['upload', 'dashboard', 'prepare-papers', 'announcements', 'users'].includes(t)) {
        setTabState(t);
      } else {
        setTabState('dashboard');
      }
      setFilterExamState(params.get('exam') || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* Dynamic Token Getter for API Client */
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  /* Verify Admin Role */
  useEffect(() => {
    async function checkRole() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setIsAdmin(false);
        return;
      }
      try {
        const res = await api.get<{ user: { role: string } }>('/auth/me');
        if (res?.user?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error verifying admin role:', err);
        setIsAdmin(false);
      }
    }
    checkRole();
  }, [isLoaded, isSignedIn]);

  /* Custom Hooks (Domain-specific data fetching) */
  const { exams, subjects, refetch: refetchMetadata } = useMetadata(Boolean(isAdmin));
  const { papers, loading: papersLoading, createPaper, deletePaper } = usePapers(Boolean(isAdmin));
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements(Boolean(isAdmin));
  const { users, createUser, updateUser, deleteUser } = useUsers(Boolean(isAdmin));

  /* Filter States */
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string | null>(null);

  /* Modal States */
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);

  /* Form states: Paper Upload */
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    subjectId: '',
    year: new Date().getFullYear(),
    paperType: 'past-paper',
    totalQuestions: '',
    hasAnswerKey: false,
  });
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState('');

  /* Form states: Announcement */
  const [announcementFile, setAnnouncementFile] = useState<File | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    examId: '',
    title: '',
    summary: '',
    content: '',
    category: 'recruitment',
    isUrgent: false,
  });
  const [announcementSubmitStatus, setAnnouncementSubmitStatus] = useState<UploadStatus>('idle');
  const [announcementError, setAnnouncementError] = useState('');

  /* Form states: User */
  const [userSubmitStatus, setUserSubmitStatus] = useState<UploadStatus>('idle');
  const [userError, setUserError] = useState('');
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'candidate',
    targetExamId: '',
    knowledgeLevel: 'beginner',
    dailyGoalMinutes: 30,
  });

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
    window.location.href = `${window.location.protocol}//${window.location.hostname}:3000?logout=true`;
  };

  /* Paper Handlers */
  const handlePaperSubmit = async (e: React.FormEvent, selectedExamId?: number, overrideSubjectId?: number) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }
    if (!form.title.trim()) {
      setUploadError('Paper title is required.');
      return;
    }
    const finalSubjectId = overrideSubjectId || Number(form.subjectId);
    if (!finalSubjectId || isNaN(finalSubjectId)) {
      setUploadError('Please select a subject.');
      return;
    }

    setUploadError('');
    setUploadStatus('uploading-storage');

    try {
      const { publicUrl, fileSize } = await uploadPaperToStorage(file);
      setUploadStatus('saving-db');

      await createPaper({
        title: form.title.trim(),
        examId: selectedExamId,
        subjectId: finalSubjectId,
        year: Number(form.year),
        fileUrl: publicUrl,
        fileSize,
        paperType: form.paperType,
        totalQuestions: form.totalQuestions ? Number(form.totalQuestions) : null,
        hasAnswerKey: form.hasAnswerKey,
      });

      setUploadStatus('success');
      setFile(null);
      setForm({
        title: '',
        subjectId: '',
        year: new Date().getFullYear(),
        paperType: 'past-paper',
        totalQuestions: '',
        hasAnswerKey: false,
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to upload paper.');
      setUploadStatus('error');
    }
  };

  const handlePaperDelete = async (paperId: number) => {
    if (!window.confirm('Are you sure you want to delete this past paper?')) return;
    try {
      await deletePaper(paperId);
    } catch (err: any) {
      alert(err.message || 'Failed to delete paper');
    }
  };

  /* Announcement Handlers */
  const openNewAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementFile(null);
    setAnnouncementForm({
      examId: exams[0]?.examId ? String(exams[0].examId) : '',
      title: '',
      summary: '',
      content: '',
      category: 'recruitment',
      isUrgent: false,
    });
    setAnnouncementError('');
    setAnnouncementSubmitStatus('idle');
    setIsAnnouncementModalOpen(true);
  };

  const openEditAnnouncementModal = (ann: AnnouncementItem) => {
    setEditingAnnouncement(ann);
    setAnnouncementFile(null);
    setAnnouncementForm({
      examId: String(ann.examId),
      title: ann.title || '',
      summary: ann.summary || '',
      content: ann.content || '',
      category: ann.category || 'recruitment',
      isUrgent: Boolean(ann.isUrgent),
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
      let attachmentPayload: any[] = [];

      if (announcementFile) {
        const { publicUrl, fileSize } = await uploadAnnouncementToStorage(announcementFile);
        attachmentPayload.push({
          name: announcementFile.name,
          url: publicUrl,
          pdfUrl: publicUrl,
          size: fileSize,
          type: announcementFile.type,
        });
      } else if (editingAnnouncement?.attachments) {
        attachmentPayload = Array.isArray(editingAnnouncement.attachments)
          ? editingAnnouncement.attachments
          : [editingAnnouncement.attachments];
      }

      setAnnouncementSubmitStatus('saving-db');

      const payload = {
        examId: Number(announcementForm.examId),
        title: announcementForm.title.trim(),
        summary: announcementForm.summary.trim() || null,
        content: announcementForm.content.trim() || null,
        category: announcementForm.category,
        isUrgent: announcementForm.isUrgent,
        attachments: attachmentPayload.length > 0 ? attachmentPayload : null,
      };

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.announcementId, payload);
      } else {
        await createAnnouncement(payload);
      }

      setAnnouncementSubmitStatus('success');
      setIsAnnouncementModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save announcement:', err);
      setAnnouncementError(err.message || 'Failed to save announcement.');
      setAnnouncementSubmitStatus('error');
    }
  };

  const handleAnnouncementDelete = async (announcementId: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(announcementId);
    } catch (err: any) {
      alert(err.message || 'Failed to delete announcement');
    }
  };

  /* User Handlers */
  const openNewUserModal = () => {
    setEditingUser(null);
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'candidate',
      targetExamId: '',
      knowledgeLevel: 'beginner',
      dailyGoalMinutes: 30,
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
      targetExamId: u.targetExamId ? String(u.targetExamId) : '',
      knowledgeLevel: u.knowledgeLevel || 'beginner',
      dailyGoalMinutes: u.dailyGoalMinutes || 30,
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
        email: userForm.email.trim(),
        phoneNumber: userForm.phoneNumber.trim() || null,
        role: userForm.role,
        targetExamId: userForm.targetExamId ? Number(userForm.targetExamId) : null,
        knowledgeLevel: userForm.knowledgeLevel,
        dailyGoalMinutes: Number(userForm.dailyGoalMinutes) || 30,
      };

      if (editingUser) {
        await updateUser(editingUser.userId, payload);
      } else {
        await createUser(payload);
      }

      setUserSubmitStatus('success');
      setIsUserModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save user:', err);
      setUserError(err.message || 'Failed to save user.');
      setUserSubmitStatus('error');
    }
  };

  const handleUserDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  /* Loading State */
  if (!isLoaded || (isSignedIn && isAdmin === null)) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-slate-800">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a3263] mb-3" />
        <p className="text-sm font-semibold text-slate-600">Verifying administrator permissions...</p>
      </div>
    );
  }

  /* Unauthenticated */
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#eef4fc] border border-[#dbe6f5] flex items-center justify-center mx-auto shadow-xs">
            <img src="/PassKru-logo.svg" alt="PassKru Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#0f3360]">PassKru Admin</h1>
            <p className="text-xs text-slate-500">Sign in with authorized administrator credentials to manage exams and past papers</p>
          </div>
          <div className="pt-2">
            <SignInButton mode="modal">
              <button className="w-full py-3 bg-[#0a3263] hover:bg-[#0f3360] text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer">
                Sign In to Admin Portal
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  /* Not Admin */
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-500">Your account does not have administrator privileges for PassKru Portal.</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign out & Return to Client
          </button>
        </div>
      </div>
    );
  }

  /* Filtered Data Lists */
  const filteredPapers = papers.filter((p) => {
    const matchSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject?.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      String(p.year).includes(search);

    const matchExam =
      !filterExam ||
      p.subject?.exam?.examName === filterExam ||
      p.subject?.exam?.examType === filterExam;

    const matchType = !filterType || p.paperType === filterType;

    return matchSearch && matchExam && matchType;
  });

  const filteredAnnouncements = announcements.filter((a) => {
    return (
      announcementSearch === '' ||
      a.title.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      (a.summary && a.summary.toLowerCase().includes(announcementSearch.toLowerCase())) ||
      (a.content && a.content.toLowerCase().includes(announcementSearch.toLowerCase())) ||
      (a.exam?.examName && a.exam.examName.toLowerCase().includes(announcementSearch.toLowerCase()))
    );
  });

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      userSearch === '' ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phoneNumber && u.phoneNumber.includes(userSearch));

    const matchRole = !userRoleFilter || u.role === userRoleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        tab={tab}
        setTab={setTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={handleLogout}
        userEmail={user?.primaryEmailAddress?.emailAddress}
      />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <Header
          tab={tab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          userInitial={user?.firstName?.[0] || 'A'}
        />

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {tab === 'upload' && (
            <UploadPaperTab
              exams={exams}
              subjects={subjects}
              file={file}
              setFile={setFile}
              form={form}
              setForm={setForm}
              uploadStatus={uploadStatus}
              uploadError={uploadError}
              onSubmit={handlePaperSubmit}
              onGoToLibrary={() => setTab('dashboard')}
              onRefreshMetadata={refetchMetadata}
            />
          )}

          {tab === 'dashboard' && (
            <PaperLibraryTab
              papers={papers}
              exams={exams}
              subjects={subjects}
              mode="past-paper"
              title="វិញ្ញាសាចាស់ៗ"
              filteredPapers={filteredPapers}
              loading={papersLoading}
              search={search}
              setSearch={setSearch}
              filterExam={filterExam}
              setFilterExam={setFilterExam}
              filterType={filterType}
              setFilterType={setFilterType}
              onUploadNew={() => setTab('upload')}
              onPreviewPdf={(url) => setPreviewPdfUrl(url)}
              onDeletePaper={handlePaperDelete}
              onRefreshMetadata={refetchMetadata}
            />
          )}

          {tab === 'prepare-papers' && (
            <PaperLibraryTab
              papers={papers}
              exams={exams}
              subjects={subjects}
              mode="prepare-paper"
              title="វិញ្ញាសាត្រៀម"
              filteredPapers={filteredPapers}
              loading={papersLoading}
              search={search}
              setSearch={setSearch}
              filterExam={filterExam}
              setFilterExam={setFilterExam}
              filterType={filterType}
              setFilterType={setFilterType}
              onUploadNew={() => setTab('upload')}
              onPreviewPdf={(url) => setPreviewPdfUrl(url)}
              onDeletePaper={handlePaperDelete}
              onRefreshMetadata={refetchMetadata}
            />
          )}

          {tab === 'announcements' && (
            <AnnouncementsTab
              announcements={announcements}
              filteredAnnouncements={filteredAnnouncements}
              search={announcementSearch}
              setSearch={setAnnouncementSearch}
              onCreateNew={openNewAnnouncementModal}
              onEdit={openEditAnnouncementModal}
              onDelete={handleAnnouncementDelete}
              onViewNotice={(ann) => setViewingAnnouncement(ann)}
              onPreviewPdf={(url) => setPreviewPdfUrl(url)}
            />
          )}

          {tab === 'users' && (
            <UserManagementTab
              users={users}
              exams={exams}
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              onCreateNewUser={openNewUserModal}
              onEditUser={openEditUserModal}
              onViewUser={(u) => setViewingUser(u)}
              onDeleteUser={handleUserDelete}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <PdfViewerModal
        url={previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
      />

      <AnnouncementViewModal
        announcement={viewingAnnouncement}
        onClose={() => setViewingAnnouncement(null)}
        onDelete={handleAnnouncementDelete}
        onPreviewPdf={(url) => setPreviewPdfUrl(url)}
      />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        editingAnnouncement={editingAnnouncement}
        exams={exams}
        announcementForm={announcementForm}
        setAnnouncementForm={setAnnouncementForm}
        announcementFile={announcementFile}
        setAnnouncementFile={setAnnouncementFile}
        announcementError={announcementError}
        announcementSubmitStatus={announcementSubmitStatus}
        onSubmit={handleAnnouncementSubmit}
      />

      <UserViewModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onDelete={handleUserDelete}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        editingUser={editingUser}
        exams={exams}
        userForm={userForm}
        setUserForm={setUserForm}
        userError={userError}
        userSubmitStatus={userSubmitStatus}
        onSubmit={handleUserSubmit}
      />
    </div>
  );
}
