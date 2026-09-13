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
  QuestionItem,
  QuizAdminItem,
  MockExamAdminItem,
  MentorItem,
  MentorStatus,
} from './types';

/* Hooks */
import { useMetadata } from './hooks/useMetadata';
import { usePapers } from './hooks/usePapers';
import { useAnnouncements } from './hooks/useAnnouncements';
import { useUsers } from './hooks/useUsers';
import { useTopics } from './hooks/useTopics';
import { useQuestions } from './hooks/useQuestions';
import { useQuizzes } from './hooks/useQuizzes';
import { useMockExams } from './hooks/useMockExams';
import { useMentors } from './hooks/useMentors';

/* Services (used directly for one-off fetches outside the standard list hooks) */
import { quizService } from './services/quizService';

/* Layout Components */
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

/* Tab Components */
import { UploadPaperTab } from './components/tabs/UploadPaperTab';
import { PaperLibraryTab } from './components/tabs/PaperLibraryTab';
import { AnnouncementsTab } from './components/tabs/AnnouncementsTab';
import { UserManagementTab } from './components/tabs/UserManagementTab';
import { QuestionBankTab } from './components/tabs/QuestionBankTab';
import { MockExamBuilderTab, BuilderSubMode } from './components/tabs/MockExamBuilderTab';
import { MentorModerationTab, formatMentorSubjects } from './components/tabs/MentorModerationTab';

/* Modal Components */
import { PdfViewerModal } from './components/modals/PdfViewerModal';
import { AnnouncementViewModal } from './components/modals/AnnouncementViewModal';
import { AnnouncementModal } from './components/modals/AnnouncementModal';
import { UserViewModal } from './components/modals/UserViewModal';
import { UserModal } from './components/modals/UserModal';
import { QuestionModal, QuestionFormState, emptyQuestionForm, questionFormMathProblems } from './components/modals/QuestionModal';
import { QuizModal, QuizFormState, emptyQuizForm } from './components/modals/QuizModal';
import { MockExamModal, MockExamFormState, emptyMockExamForm } from './components/modals/MockExamModal';
import { MockExamSectionsModal } from './components/modals/MockExamSectionsModal';
import { QuestionPickerModal } from './components/modals/QuestionPickerModal';
import { MentorModal, MentorFormState, emptyMentorForm } from './components/modals/MentorModal';

export default function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const VALID_TABS: Tab[] = ['upload', 'dashboard', 'prepare-papers', 'announcements', 'users', 'questions', 'mock-exams', 'mentors'];

  const getInitialTab = (): Tab => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab') as Tab;
    if (t && VALID_TABS.includes(t)) {
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
      if (t && VALID_TABS.includes(t)) {
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
  const { topics } = useTopics(Boolean(isAdmin));
  const {
    questions,
    loading: questionsLoading,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  } = useQuestions(Boolean(isAdmin));
  const {
    quizzes,
    loading: quizzesLoading,
    refetch: refetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  } = useQuizzes(Boolean(isAdmin));
  const {
    mockExams,
    loading: mockExamsLoading,
    refetch: refetchMockExams,
    createMockExam,
    updateMockExam,
    deleteMockExam,
  } = useMockExams(Boolean(isAdmin));

  /* Filter States */
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string | null>(null);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState<string | null>(null);
  const [questionTypeFilter, setQuestionTypeFilter] = useState<string | null>(null);
  const [builderSubMode, setBuilderSubMode] = useState<BuilderSubMode>('mock-exams');
  const [mockExamSearch, setMockExamSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [mentorSearch, setMentorSearch] = useState('');
  const [mentorStatusFilter, setMentorStatusFilter] = useState<MentorStatus | 'all'>('all');

  const {
    mentors,
    loading: mentorsLoading,
    createMentor,
    updateMentor,
    updateMentorStatus,
    deleteMentor,
  } = useMentors(Boolean(isAdmin), { status: mentorStatusFilter });

  /* Modal States */
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizAdminItem | null>(null);
  const [isMockExamModalOpen, setIsMockExamModalOpen] = useState(false);
  const [editingMockExam, setEditingMockExam] = useState<MockExamAdminItem | null>(null);
  const [sectionsModalMockExam, setSectionsModalMockExam] = useState<MockExamAdminItem | null>(null);
  const [quizQuestionsTarget, setQuizQuestionsTarget] = useState<QuizAdminItem | null>(null);
  const [quizQuestionsInitialIds, setQuizQuestionsInitialIds] = useState<number[]>([]);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<MentorItem | null>(null);

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
    aboutExamWhen: '',
    aboutExamWhere: '',
    aboutExamSubjects: '',
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

  /* Form states: Question Bank */
  const [questionSubmitStatus, setQuestionSubmitStatus] = useState<UploadStatus>('idle');
  const [questionError, setQuestionError] = useState('');
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(emptyQuestionForm());

  /* Form states: Quiz */
  const [quizSubmitStatus, setQuizSubmitStatus] = useState<UploadStatus>('idle');
  const [quizError, setQuizError] = useState('');
  const [quizForm, setQuizForm] = useState<QuizFormState>(emptyQuizForm());

  /* Form states: Mock Exam */
  const [mockExamSubmitStatus, setMockExamSubmitStatus] = useState<UploadStatus>('idle');
  const [mockExamError, setMockExamError] = useState('');
  const [mockExamForm, setMockExamForm] = useState<MockExamFormState>(emptyMockExamForm());

  /* Form states: Mentor */
  const [mentorSubmitStatus, setMentorSubmitStatus] = useState<UploadStatus>('idle');
  const [mentorError, setMentorError] = useState('');
  const [mentorForm, setMentorForm] = useState<MentorFormState>(emptyMentorForm());

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
    const clientUrl = (import.meta.env.VITE_CLIENT_URL || `${window.location.protocol}//${window.location.hostname || 'localhost'}:3000`).replace(/\/+$/, '');
    window.location.href = `${clientUrl}?logout=true`;
  };

  /* Paper Handlers */
  const handlePaperSubmit = async (e: React.FormEvent, selectedExamId?: number, overrideSubjectId?: number) => {
    e.preventDefault();
    if (!file) {
      setUploadError('សូមជ្រើសរើសឯកសារ PDF ដើម្បីបង្ហោះ។');
      return;
    }
    if (!form.title.trim()) {
      setUploadError('សូមបញ្ចូលចំណងជើងវិញ្ញាសា។');
      return;
    }
    const finalSubjectId = overrideSubjectId || Number(form.subjectId);
    if (!finalSubjectId || isNaN(finalSubjectId)) {
      setUploadError('សូមជ្រើសរើសមុខវិជ្ជា។');
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
      setUploadError(err.message || 'ការបង្ហោះវិញ្ញាសាបានបរាជ័យ។');
      setUploadStatus('error');
    }
  };

  const handlePaperDelete = async (paperId: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបវិញ្ញាសានេះមែនទេ?')) return;
    try {
      await deletePaper(paperId);
    } catch (err: any) {
      alert(err.message || 'ការលុបវិញ្ញាសាបានបរាជ័យ');
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
      aboutExamWhen: '',
      aboutExamWhere: '',
      aboutExamSubjects: '',
    });
    setAnnouncementError('');
    setAnnouncementSubmitStatus('idle');
    setIsAnnouncementModalOpen(true);
  };

  const openEditAnnouncementModal = (ann: AnnouncementItem) => {
    setEditingAnnouncement(ann);
    setAnnouncementFile(null);
    const about = ann.aboutExam;
    const whenVal = about?.when || about?.examDate || '';
    const whereVal = about?.where || about?.examLocation || '';
    const subjectsVal = Array.isArray(about?.whatSubject)
      ? about.whatSubject.join(', ')
      : (about?.whatSubject || about?.examSubjects || '');

    setAnnouncementForm({
      examId: String(ann.examId),
      title: ann.title || '',
      summary: ann.summary || '',
      content: ann.content || '',
      category: ann.category || 'recruitment',
      isUrgent: Boolean(ann.isUrgent),
      aboutExamWhen: whenVal,
      aboutExamWhere: whereVal,
      aboutExamSubjects: subjectsVal,
    });
    setAnnouncementError('');
    setAnnouncementSubmitStatus('idle');
    setIsAnnouncementModalOpen(true);
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title.trim()) {
      setAnnouncementError('សូមបញ្ចូលចំណងជើងសេចក្តីជូនដំណឹង។');
      return;
    }
    if (!announcementForm.examId) {
      setAnnouncementError('សូមជ្រើសរើសការប្រឡងគោលដៅ។');
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

      const hasAboutExam =
        announcementForm.aboutExamWhen.trim() ||
        announcementForm.aboutExamWhere.trim() ||
        announcementForm.aboutExamSubjects.trim();

      const aboutExam = hasAboutExam
        ? {
            when: announcementForm.aboutExamWhen.trim() || null,
            where: announcementForm.aboutExamWhere.trim() || null,
            whatSubject: announcementForm.aboutExamSubjects.trim() || null,
          }
        : null;

      const payload = {
        examId: Number(announcementForm.examId),
        title: announcementForm.title.trim(),
        summary: announcementForm.summary.trim() || null,
        content: announcementForm.content.trim() || null,
        category: announcementForm.category,
        isUrgent: announcementForm.isUrgent,
        attachments: attachmentPayload.length > 0 ? attachmentPayload : null,
        aboutExam,
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
      setAnnouncementError(err.message || 'ការរក្សាទុកសេចក្តីជូនដំណឹងបានបរាជ័យ។');
      setAnnouncementSubmitStatus('error');
    }
  };

  const handleAnnouncementDelete = async (announcementId: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបសេចក្តីជូនដំណឹងនេះមែនទេ?')) return;
    try {
      await deleteAnnouncement(announcementId);
    } catch (err: any) {
      alert(err.message || 'ការលុបសេចក្តីជូនដំណឹងបានបរាជ័យ');
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
      setUserError('សូមបញ្ចូលគោត្តនាម នាម និងអ៊ីមែល។');
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
      setUserError(err.message || 'ការរក្សាទុកព័ត៌មានអ្នកប្រើប្រាស់បានបរាជ័យ។');
      setUserSubmitStatus('error');
    }
  };

  const handleUserDelete = async (userId: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ?')) return;
    try {
      await deleteUser(userId);
    } catch (err: any) {
      alert(err.message || 'ការលុបអ្នកប្រើប្រាស់បានបរាជ័យ');
    }
  };

  /* Question Bank Handlers */
  const openNewQuestionModal = () => {
    setEditingQuestion(null);
    setQuestionForm(emptyQuestionForm());
    setQuestionError('');
    setQuestionSubmitStatus('idle');
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (q: QuestionItem) => {
    setEditingQuestion(q);
    setQuestionForm({
      subjectId: q.subjectId ? String(q.subjectId) : '',
      topicId: String(q.topicId),
      questionText: q.questionText || '',
      questionType: q.questionType || 'multiple-choice',
      difficultyLevel: q.difficultyLevel || 'medium',
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      referenceNote: q.referenceNote || '',
      options:
        q.options && q.options.length > 0
          ? q.options.map((o) => ({ optionText: o.optionText, isCorrect: o.isCorrect }))
          : [
              { optionText: '', isCorrect: true },
              { optionText: '', isCorrect: false },
            ],
    });
    setQuestionError('');
    setQuestionSubmitStatus('idle');
    setIsQuestionModalOpen(true);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.topicId) {
      setQuestionError('សូមជ្រើសរើសមុខវិជ្ជា និងប្រធានបទ។');
      return;
    }
    if (!questionForm.questionText.trim()) {
      setQuestionError('សូមបញ្ចូលខ្លឹមសារសំណួរ។');
      return;
    }
    const isShortAnswer = questionForm.questionType === 'short-answer';
    if (isShortAnswer && !questionForm.correctAnswer.trim()) {
      setQuestionError('សូមបញ្ចូលចម្លើយត្រឹមត្រូវសម្រាប់សំណួរឆ្លើយខ្លី។');
      return;
    }
    if (!isShortAnswer) {
      const validOptions = questionForm.options.filter((o) => o.optionText.trim());
      if (validOptions.length < 2) {
        setQuestionError('សូមបញ្ចូលជម្រើសចម្លើយយ៉ាងហោចណាស់ ២។');
        return;
      }
      if (!validOptions.some((o) => o.isCorrect)) {
        setQuestionError('សូមជ្រើសរើសយកជម្រើសមួយជាចម្លើយត្រឹមត្រូវ។');
        return;
      }
    }

    // Formulas KaTeX can't typeset show to students as raw text; make that a deliberate choice.
    const mathProblems = questionFormMathProblems(questionForm);
    if (
      mathProblems.length &&
      !window.confirm(
        `${mathProblems.length} formula${mathProblems.length === 1 ? '' : 's'} can't be displayed as math and will show as typed:\n\n${mathProblems.join('\n')}\n\nSave anyway?`
      )
    ) {
      return;
    }

    setQuestionError('');
    setQuestionSubmitStatus('saving-db');

    try {
      const payload = {
        topicId: Number(questionForm.topicId),
        questionText: questionForm.questionText.trim(),
        questionType: questionForm.questionType,
        difficultyLevel: questionForm.difficultyLevel || null,
        correctAnswer: isShortAnswer ? questionForm.correctAnswer.trim() : null,
        explanation: questionForm.explanation.trim() || null,
        referenceNote: questionForm.referenceNote.trim() || null,
        options: isShortAnswer
          ? []
          : questionForm.options
              .filter((o) => o.optionText.trim())
              .map((o) => ({ optionText: o.optionText.trim(), isCorrect: o.isCorrect })),
      };

      if (editingQuestion) {
        await updateQuestion(editingQuestion.questionId, payload);
      } else {
        await createQuestion(payload);
      }

      setQuestionSubmitStatus('success');
      setIsQuestionModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save question:', err);
      setQuestionError(err.message || 'ការរក្សាទុកសំណួរបានបរាជ័យ។');
      setQuestionSubmitStatus('error');
    }
  };

  const handleQuestionDelete = async (id: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបសំណួរនេះមែនទេ?')) return;
    try {
      await deleteQuestion(id);
    } catch (err: any) {
      alert(err.message || 'ការលុបសំណួរបានបរាជ័យ');
    }
  };

  /* Quiz Handlers */
  const openNewQuizModal = () => {
    setEditingQuiz(null);
    setQuizForm(emptyQuizForm());
    setQuizError('');
    setQuizSubmitStatus('idle');
    setIsQuizModalOpen(true);
  };

  const openEditQuizModal = (q: QuizAdminItem) => {
    setEditingQuiz(q);
    setQuizForm({
      subjectId: String(q.subjectId),
      title: q.title || '',
      difficultyLevel: q.difficultyLevel || 'medium',
      durationMinutes: q.durationMinutes ? String(q.durationMinutes) : '',
    });
    setQuizError('');
    setQuizSubmitStatus('idle');
    setIsQuizModalOpen(true);
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      setQuizError('សូមបញ្ចូលចំណងជើង Quiz។');
      return;
    }
    if (!quizForm.subjectId) {
      setQuizError('សូមជ្រើសរើសមុខវិជ្ជា។');
      return;
    }

    setQuizError('');
    setQuizSubmitStatus('saving-db');

    try {
      const payload = {
        subjectId: Number(quizForm.subjectId),
        title: quizForm.title.trim(),
        difficultyLevel: quizForm.difficultyLevel || null,
        durationMinutes: quizForm.durationMinutes ? Number(quizForm.durationMinutes) : null,
      };

      if (editingQuiz) {
        await updateQuiz(editingQuiz.quizId, payload);
      } else {
        await createQuiz(payload);
      }

      setQuizSubmitStatus('success');
      setIsQuizModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save quiz:', err);
      setQuizError(err.message || 'ការរក្សាទុក Quiz បានបរាជ័យ។');
      setQuizSubmitStatus('error');
    }
  };

  const handleQuizDelete = async (id: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុប Quiz នេះមែនទេ?')) return;
    try {
      await deleteQuiz(id);
    } catch (err: any) {
      alert(err.message || 'ការលុប Quiz បានបរាជ័យ');
    }
  };

  const openQuizQuestionsPicker = async (quiz: QuizAdminItem) => {
    try {
      const detail = await quizService.getQuiz(quiz.quizId);
      setQuizQuestionsInitialIds(detail.questions.map((q) => q.questionId));
      setQuizQuestionsTarget(quiz);
    } catch (err: any) {
      alert(err.message || 'ការទាញយកសំណួរ Quiz បានបរាជ័យ');
    }
  };

  /* Mock Exam Handlers */
  const openNewMockExamModal = () => {
    setEditingMockExam(null);
    setMockExamForm(emptyMockExamForm());
    setMockExamError('');
    setMockExamSubmitStatus('idle');
    setIsMockExamModalOpen(true);
  };

  const openEditMockExamModal = (m: MockExamAdminItem) => {
    setEditingMockExam(m);
    setMockExamForm({
      examId: String(m.examId),
      title: m.title || '',
      description: m.description || '',
      year: m.year ? String(m.year) : '',
      durationMinutes: m.durationMinutes ? String(m.durationMinutes) : '',
      totalMarks: m.totalMarks !== null && m.totalMarks !== undefined ? String(m.totalMarks) : '',
      passingMarks: m.passingMarks !== null && m.passingMarks !== undefined ? String(m.passingMarks) : '',
    });
    setMockExamError('');
    setMockExamSubmitStatus('idle');
    setIsMockExamModalOpen(true);
  };

  const handleMockExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockExamForm.title.trim()) {
      setMockExamError('សូមបញ្ចូលចំណងជើងវិញ្ញាសាសាកល្បង។');
      return;
    }
    if (!mockExamForm.examId) {
      setMockExamError('សូមជ្រើសរើសការប្រឡងគោលដៅ។');
      return;
    }

    setMockExamError('');
    setMockExamSubmitStatus('saving-db');

    try {
      const payload = {
        examId: Number(mockExamForm.examId),
        title: mockExamForm.title.trim(),
        description: mockExamForm.description.trim() || null,
        year: mockExamForm.year ? Number(mockExamForm.year) : null,
        durationMinutes: mockExamForm.durationMinutes ? Number(mockExamForm.durationMinutes) : null,
        totalMarks: mockExamForm.totalMarks ? Number(mockExamForm.totalMarks) : null,
        passingMarks: mockExamForm.passingMarks ? Number(mockExamForm.passingMarks) : null,
      };

      if (editingMockExam) {
        await updateMockExam(editingMockExam.mockExamId, payload);
      } else {
        await createMockExam(payload);
      }

      setMockExamSubmitStatus('success');
      setIsMockExamModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save mock exam:', err);
      setMockExamError(err.message || 'ការរក្សាទុកវិញ្ញាសាសាកល្បងបានបរាជ័យ។');
      setMockExamSubmitStatus('error');
    }
  };

  const handleMockExamDelete = async (id: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបវិញ្ញាសាសាកល្បងនេះមែនទេ? វានឹងលុបផ្នែកទាំងអស់នៃវិញ្ញាសានេះផងដែរ។')) return;
    try {
      await deleteMockExam(id);
    } catch (err: any) {
      alert(err.message || 'ការលុបវិញ្ញាសាសាកល្បងបានបរាជ័យ');
    }
  };

  /* Mentor Handlers */
  const openNewMentorModal = () => {
    setEditingMentor(null);
    setMentorForm(emptyMentorForm());
    setMentorError('');
    setMentorSubmitStatus('idle');
    setIsMentorModalOpen(true);
  };

  const openEditMentorModal = (m: MentorItem) => {
    setEditingMentor(m);
    const subjectsList = formatMentorSubjects(m.subjects);
    setMentorForm({
      firstName: m.firstName || '',
      lastName: m.lastName || '',
      title: m.title || '',
      roleLabel: m.roleLabel || '',
      avatarUrl: m.avatarUrl || '',
      experienceYears: m.experienceYears ? String(m.experienceYears) : '',
      bio: m.bio || '',
      hourlyRate: m.hourlyRate || '',
      socialTelegram: m.socialTelegram || '',
      subjects: subjectsList.join(', '),
      availability: m.availability || '',
      status: m.status,
    });
    setMentorError('');
    setMentorSubmitStatus('idle');
    setIsMentorModalOpen(true);
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.firstName.trim() || !mentorForm.lastName.trim()) {
      setMentorError('សូមបញ្ចូលគោត្តនាម និងនាម។');
      return;
    }

    setMentorError('');
    setMentorSubmitStatus('saving-db');

    try {
      const payload = {
        firstName: mentorForm.firstName.trim(),
        lastName: mentorForm.lastName.trim(),
        title: mentorForm.title.trim() || null,
        roleLabel: mentorForm.roleLabel.trim() || null,
        avatarUrl: mentorForm.avatarUrl.trim() || null,
        experienceYears: mentorForm.experienceYears ? Number(mentorForm.experienceYears) : null,
        bio: mentorForm.bio.trim() || null,
        hourlyRate: mentorForm.hourlyRate.trim() || null,
        socialTelegram: mentorForm.socialTelegram.trim() || null,
        subjects: mentorForm.subjects
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        availability: mentorForm.availability.trim() || null,
        status: mentorForm.status,
      };

      if (editingMentor) {
        await updateMentor(editingMentor.mentorId, payload);
      } else {
        await createMentor(payload);
      }

      setMentorSubmitStatus('success');
      setIsMentorModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save mentor:', err);
      setMentorError(err.message || 'ការរក្សាទុកគណនីគ្រូបង្រៀនបានបរាជ័យ។');
      setMentorSubmitStatus('error');
    }
  };

  const handleMentorDelete = async (id: number) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបគណនីគ្រូបង្រៀននេះមែនទេ?')) return;
    try {
      await deleteMentor(id);
    } catch (err: any) {
      alert(err.message || 'ការលុបគណនីគ្រូបង្រៀនបានបរាជ័យ');
    }
  };

  const handleMentorSetStatus = async (id: number, status: MentorStatus) => {
    try {
      await updateMentorStatus(id, status);
    } catch (err: any) {
      alert(err.message || 'ការធ្វើបច្ចុប្បន្នភាពស្ថានភាពគ្រូបង្រៀនបានបរាជ័យ');
    }
  };

  /* Loading State */
  if (!isLoaded || (isSignedIn && isAdmin === null)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="relative flex flex-col items-center justify-center space-y-4">
          <img 
            src="/PassKru-logo.svg" 
            alt="PassKru" 
            className="w-32 h-32 object-contain animate-pulse"
          />
          <div className="w-7 h-7 border-3 border-black/10 border-t-black rounded-full animate-spin" />
        </div>
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
            <p className="text-xs text-slate-500">សូមចូលប្រើប្រាស់ដោយប្រើគណនីអ្នកគ្រប់គ្រងដែលមានការអនុញ្ញាតដើម្បីគ្រប់គ្រងការប្រឡង និងវិញ្ញាសា</p>
          </div>
          <div className="pt-2">
            <SignInButton mode="modal">
              <button className="w-full py-3 bg-[#0a3263] hover:bg-[#0f3360] text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer">
                ចូលប្រើប្រាស់ប្រព័ន្ធ Admin
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
            <h2 className="text-xl font-bold text-slate-900">ការចូលប្រើប្រាស់ត្រូវបានកម្រិត</h2>
            <p className="text-xs text-slate-500">គណនីរបស់អ្នកមិនមានសិទ្ធិជាអ្នកគ្រប់គ្រងប្រព័ន្ធ PassKru ឡើយ។</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> ចាកចេញ និងត្រឡប់ទៅទំព័រដើម
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

  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      questionSearch === '' || q.questionText.toLowerCase().includes(questionSearch.toLowerCase());
    const matchSubject = !questionSubjectFilter || String(q.subjectId) === questionSubjectFilter;
    const matchType = !questionTypeFilter || q.questionType === questionTypeFilter;
    return matchSearch && matchSubject && matchType;
  });

  const filteredMockExams = mockExams.filter((m) => {
    return mockExamSearch === '' || m.title.toLowerCase().includes(mockExamSearch.toLowerCase());
  });

  const filteredQuizzes = quizzes.filter((q) => {
    return quizSearch === '' || q.title.toLowerCase().includes(quizSearch.toLowerCase());
  });

  const filteredMentors = mentors.filter((m) => {
    return (
      mentorSearch === '' ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      (m.title && m.title.toLowerCase().includes(mentorSearch.toLowerCase())) ||
      (m.roleLabel && m.roleLabel.toLowerCase().includes(mentorSearch.toLowerCase()))
    );
  });

  /* Topics scoped to the subject currently selected in the question form */
  const topicsForQuestionForm = questionForm.subjectId
    ? topics.filter((t) => String(t.subjectId) === questionForm.subjectId)
    : [];

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

          {tab === 'questions' && (
            <QuestionBankTab
              subjects={subjects}
              filteredQuestions={filteredQuestions}
              questionSearch={questionSearch}
              setQuestionSearch={setQuestionSearch}
              questionSubjectFilter={questionSubjectFilter}
              setQuestionSubjectFilter={setQuestionSubjectFilter}
              questionTypeFilter={questionTypeFilter}
              setQuestionTypeFilter={setQuestionTypeFilter}
              onCreateNew={openNewQuestionModal}
              onEdit={openEditQuestionModal}
              onDelete={handleQuestionDelete}
              loading={questionsLoading}
            />
          )}

          {tab === 'mock-exams' && (
            <MockExamBuilderTab
              subMode={builderSubMode}
              setSubMode={setBuilderSubMode}
              filteredMockExams={filteredMockExams}
              mockExamSearch={mockExamSearch}
              setMockExamSearch={setMockExamSearch}
              mockExamsLoading={mockExamsLoading}
              onCreateMockExam={openNewMockExamModal}
              onEditMockExam={openEditMockExamModal}
              onDeleteMockExam={handleMockExamDelete}
              onManageSections={(m) => setSectionsModalMockExam(m)}
              filteredQuizzes={filteredQuizzes}
              quizSearch={quizSearch}
              setQuizSearch={setQuizSearch}
              quizzesLoading={quizzesLoading}
              onCreateQuiz={openNewQuizModal}
              onEditQuiz={openEditQuizModal}
              onDeleteQuiz={handleQuizDelete}
              onAssignQuizQuestions={openQuizQuestionsPicker}
            />
          )}

          {tab === 'mentors' && (
            <MentorModerationTab
              filteredMentors={filteredMentors}
              mentorSearch={mentorSearch}
              setMentorSearch={setMentorSearch}
              mentorStatusFilter={mentorStatusFilter}
              setMentorStatusFilter={setMentorStatusFilter}
              loading={mentorsLoading}
              onCreateNew={openNewMentorModal}
              onEdit={openEditMentorModal}
              onDelete={handleMentorDelete}
              onSetStatus={handleMentorSetStatus}
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

      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        editingQuestion={editingQuestion}
        subjects={subjects}
        topics={topicsForQuestionForm}
        questionForm={questionForm}
        setQuestionForm={setQuestionForm}
        questionError={questionError}
        questionSubmitStatus={questionSubmitStatus}
        onSubmit={handleQuestionSubmit}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        editingQuiz={editingQuiz}
        subjects={subjects}
        quizForm={quizForm}
        setQuizForm={setQuizForm}
        quizError={quizError}
        quizSubmitStatus={quizSubmitStatus}
        onSubmit={handleQuizSubmit}
      />

      <MockExamModal
        isOpen={isMockExamModalOpen}
        onClose={() => setIsMockExamModalOpen(false)}
        editingMockExam={editingMockExam}
        exams={exams}
        mockExamForm={mockExamForm}
        setMockExamForm={setMockExamForm}
        mockExamError={mockExamError}
        mockExamSubmitStatus={mockExamSubmitStatus}
        onSubmit={handleMockExamSubmit}
      />

      <MockExamSectionsModal
        isOpen={sectionsModalMockExam !== null}
        onClose={() => setSectionsModalMockExam(null)}
        mockExam={sectionsModalMockExam}
        subjects={subjects}
        onChanged={refetchMockExams}
      />

      <QuestionPickerModal
        isOpen={quizQuestionsTarget !== null}
        onClose={() => setQuizQuestionsTarget(null)}
        subjectId={quizQuestionsTarget?.subjectId ?? null}
        subjectName={quizQuestionsTarget?.subjectName}
        initialSelectedIds={quizQuestionsInitialIds}
        title="Assign Questions to Quiz"
        onSave={async (questionIds) => {
          if (!quizQuestionsTarget) return;
          await quizService.setQuizQuestions(quizQuestionsTarget.quizId, questionIds);
          await refetchQuizzes();
        }}
      />

      <MentorModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
        editingMentor={editingMentor}
        mentorForm={mentorForm}
        setMentorForm={setMentorForm}
        mentorError={mentorError}
        mentorSubmitStatus={mentorSubmitStatus}
        onSubmit={handleMentorSubmit}
      />
    </div>
  );
}
