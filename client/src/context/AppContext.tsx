import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, ExamTarget, StudyTask, AppNotification, WeakArea, Announcement, Mentor, Quiz, MockExam, Question, SubjectScore, PracticeViewMode } from '../types';
import { mockStudyTasks, mockNotifications, mockWeakAreas, mockAnnouncements, mockMentors, mockQuizzes, mockExams } from '../data/mockData';
import { api } from '../utils/api';

export type ActivePage =
  | 'landing'
  | 'login'
  | 'register'
  | 'announcements'
  | 'dashboard'
  | 'announcement-detail'
  | 'requirements'
  | 'exam-info'
  | 'past-papers'
  | 'prepare-papers'
  | 'learning'
  | 'practice'
  | 'quiz'
  | 'mock-exam'
  | 'flashcards'
  | 'study-plan'
  | 'progress'
  | 'weakness'
  | 'mentors'
  | 'notifications'
  | 'profile';

const pageToPathMap: Record<ActivePage, string> = {
  landing: '/',
  login: '/login',
  register: '/register',
  announcements: '/announcements',
  dashboard: '/dashboard',
  'announcement-detail': '/announcements/detail',
  requirements: '/requirements',
  'exam-info': '/requirements',
  'past-papers': '/past-papers',
  'prepare-papers': '/prepare-papers',
  learning: '/learning',
  practice: '/practice',
  quiz: '/quiz',
  'mock-exam': '/practice',
  flashcards: '/flashcards',
  'study-plan': '/study-plan',
  progress: '/progress',
  weakness: '/weakness',
  mentors: '/mentors',
  notifications: '/notifications',
  profile: '/profile',
};

const pathToPageMap: Record<string, ActivePage> = {
  '/': 'landing',
  '/login': 'login',
  '/register': 'register',
  '/announcements': 'announcements',
  '/dashboard': 'dashboard',
  '/announcements/detail': 'announcement-detail',
  '/requirements': 'requirements',
  '/exam-info': 'exam-info',
  '/past-papers': 'past-papers',
  '/prepare-papers': 'prepare-papers',
  '/learning': 'learning',
  '/practice': 'practice',
  '/quiz': 'quiz',
  '/mock-exam': 'practice',
  '/flashcards': 'flashcards',
  '/study-plan': 'study-plan',
  '/mentors': 'mentors',
  '/notifications': 'notifications',
  '/profile': 'profile',
};

interface AppContextType {
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  studyTasks: StudyTask[];
  toggleTaskCompletion: (taskId: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  weakAreas: WeakArea[];
  selectedAnnouncement: Announcement | null;
  setSelectedAnnouncement: (announcement: Announcement | null) => void;
  selectedMentor: Mentor | null;
  setSelectedMentor: (mentor: Mentor | null) => void;
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  activeMockExam: MockExam | null;
  setActiveMockExam: (exam: MockExam | null) => void;
  selectedPracticeSubject: string | null;
  setSelectedPracticeSubject: (subject: string | null) => void;
  selectedPracticeSubjectId: string | null;
  setSelectedPracticeSubjectId: (id: string | null) => void;
  practiceViewMode: PracticeViewMode;
  setPracticeViewMode: (mode: PracticeViewMode) => void;
  subjectScores: Record<string, SubjectScore>;
  saveSubjectScore: (params: {
    subjectId?: string;
    subjectName?: string;
    category: 'quiz' | 'mock-exam';
    round?: 1 | 2;
    score: number;
  }) => void;
  // Real database ids for the backend-backed quiz/mock-exam flow. Null means
  // "no specific one selected" — the page then shows its picker instead.
  activeQuizId: number | null;
  setActiveQuizId: (quizId: number | null) => void;
  activeMockExamId: number | null;
  setActiveMockExamId: (mockExamId: number | null) => void;
  bookmarkedQuestionIds: string[];
  toggleBookmarkQuestion: (questionId: string) => void;
  examCountdownDays: number;
  navigateToAnnouncement: (announcementId: string) => void;
  startQuizById: (quizId: number | string) => void;
  startMockExamById: (examId: number | string) => void;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (data: any) => Promise<void>;
  logoutUser: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mockAnnouncements: Announcement[];
}

const defaultUserProfile: UserProfile = {
  name: 'សុខ វិសាល (Sok Visal)',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  targetExam: 'nie',
  targetSubject: 'វប្បធម៌ទូទៅ (General Culture)',
  dailyGoalMinutes: 60,
  streakDays: 14,
  completedQuestions: 248,
  averageScore: 78,
  studyHoursTotal: 42
};

const mapBackendUserToProfile = (backendUser: any): UserProfile => {
  return {
    name: `${backendUser.firstName} ${backendUser.lastName}`,
    email: backendUser.email || '',
    avatar: backendUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${backendUser.firstName}`,
    targetExam: (backendUser.targetExamId === 1 ? 'nie' : backendUser.targetExamId === 2 ? 'rttc' : backendUser.targetExamId === 3 ? 'pttc' : 'nie') as ExamTarget,
    targetSubject: backendUser.targetSubject || 'វប្បធម៌ទូទៅ (General Culture)',
    dailyGoalMinutes: backendUser.dailyGoalMinutes || 30,
    streakDays: backendUser.streakDays || 0,
    completedQuestions: backendUser.completedQuestions || 0,
    averageScore: Number(backendUser.averageScore) || 0,
    studyHoursTotal: Number(backendUser.studyHoursTotal) || 0,
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded: isAuthLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPageState] = useState<ActivePage>(() => {
    return pathToPageMap[location.pathname] || 'landing';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(mockStudyTasks);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>(mockWeakAreas);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(mockAnnouncements[0]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(mockMentors[0]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(mockQuizzes[0]);
  const [activeMockExam, setActiveMockExam] = useState<MockExam | null>(mockExams[0]);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [activeMockExamId, setActiveMockExamId] = useState<number | null>(null);
  const [selectedPracticeSubject, setSelectedPracticeSubject] = useState<string | null>(null);
  const [selectedPracticeSubjectId, setSelectedPracticeSubjectId] = useState<string | null>(null);
  const [practiceViewMode, setPracticeViewMode] = useState<PracticeViewMode>('hub');
  const [subjectScores, setSubjectScores] = useState<Record<string, SubjectScore>>(() => {
    try {
      const saved = localStorage.getItem('passkru_subject_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveSubjectScore = useCallback(({
    subjectId,
    subjectName,
    category,
    round,
    score,
  }: {
    subjectId?: string;
    subjectName?: string;
    category: 'quiz' | 'mock-exam';
    round?: 1 | 2;
    score: number;
  }) => {
    setSubjectScores((prev) => {
      const nextScores = { ...prev };
      const keys = [subjectId, subjectName].filter(Boolean) as string[];
      for (const key of keys) {
        const existing = nextScores[key] || {};
        const updated: SubjectScore = { ...existing, lastUpdated: new Date().toISOString() };
        if (category === 'quiz') {
          updated.quizScore = score;
        } else if (category === 'mock-exam') {
          if (round === 2) {
            updated.mockExamR2Score = score;
          } else {
            updated.mockExamR1Score = score;
          }
        }
        nextScores[key] = updated;
      }
      try {
        localStorage.setItem('passkru_subject_scores', JSON.stringify(nextScores));
      } catch (err) {
        console.error('Failed to save subject scores to localStorage', err);
      }
      return nextScores;
    });
  }, []);

  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(['q-ped-01']);

  // Synchronize setCurrentPage with React Router navigate
  const setCurrentPage = useCallback((page: ActivePage) => {
    setCurrentPageState(page);
    const targetPath = pageToPathMap[page] || '/';
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [location.pathname, navigate]);

  // Synchronize URL change back to currentPage state
  useEffect(() => {
    const matchedPage = pathToPageMap[location.pathname];
    if (matchedPage && matchedPage !== currentPage) {
      setCurrentPageState(matchedPage);
    }
  }, [location.pathname]);

  // Calculated Days to Exam (Target: Oct 25, 2026)
  const examCountdownDays = 67;

  // Handle URL query parameters (logout, viewAsUser)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      logoutUser();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (params.get('viewAsUser') === 'true') {
      sessionStorage.setItem('viewAsUser', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isSignedIn]);

  // Sync auth state with Clerk
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && clerkUser) {
        setIsLoading(true);
        try {
          // Check viewAsUser from URL query parameter or session storage
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('viewAsUser') === 'true') {
            sessionStorage.setItem('viewAsUser', 'true');
          }
          const isViewingAsUser = sessionStorage.getItem('viewAsUser') === 'true';

          // Fetch additional user details (like role) from backend db
          const response = await api('/auth/me');
          const dbUser = response.user;
          
          if (dbUser.role === 'admin' && !isViewingAsUser) {
            // If just logging in, or not explicitly viewing as user, force admin dashboard
            if (currentPage === 'login' || currentPage === 'register') {
              window.location.href = `${window.location.protocol}//${window.location.hostname}:3001`;
              return;
            }
          }
          
          if (dbUser.role !== 'admin') {
            sessionStorage.removeItem('viewAsUser');
          }

          setUserProfile({
            name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            email: dbUser.email || clerkUser.primaryEmailAddress?.emailAddress || '',
            avatar: clerkUser.imageUrl || defaultUserProfile.avatar,
            targetExam: dbUser.targetExamId === 1 ? 'nie' : dbUser.targetExamId === 2 ? 'rttc' : dbUser.targetExamId === 3 ? 'pttc' : defaultUserProfile.targetExam,
            targetSubject: dbUser.targetSubject || defaultUserProfile.targetSubject,
            dailyGoalMinutes: dbUser.dailyGoalMinutes || defaultUserProfile.dailyGoalMinutes,
            streakDays: dbUser.streakDays || defaultUserProfile.streakDays,
            completedQuestions: dbUser.completedQuestions || defaultUserProfile.completedQuestions,
            averageScore: dbUser.averageScore ? Number(dbUser.averageScore) : defaultUserProfile.averageScore,
            studyHoursTotal: dbUser.studyHoursTotal ? Number(dbUser.studyHoursTotal) : defaultUserProfile.studyHoursTotal,
            role: dbUser.role,
          });
          
          setIsLoggedIn(true);

          if (currentPage === 'login' || currentPage === 'register' || currentPage === 'landing') {
            setCurrentPage('dashboard');
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to sync user role from DB, falling back to Clerk details:", error);
          setUserProfile({
            name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            avatar: clerkUser.imageUrl || defaultUserProfile.avatar,
            targetExam: defaultUserProfile.targetExam,
            targetSubject: defaultUserProfile.targetSubject,
            dailyGoalMinutes: defaultUserProfile.dailyGoalMinutes,
            streakDays: defaultUserProfile.streakDays,
            completedQuestions: defaultUserProfile.completedQuestions,
            averageScore: defaultUserProfile.averageScore,
            studyHoursTotal: defaultUserProfile.studyHoursTotal,
            role: 'candidate',
          });
          setIsLoggedIn(true);
          if (currentPage === 'login' || currentPage === 'register' || currentPage === 'landing') {
            setCurrentPage('dashboard');
          }
          setIsLoading(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };

    if (isAuthLoaded) {
      syncUser();
    }
  }, [isSignedIn, isAuthLoaded, clerkUser]);

  const loginUser = async (email: string, password: string) => {
    // AuthPage directly uses useSignIn
  };

  const registerUser = async (data: any) => {
    // AuthPage directly uses useSignUp
  };

  const logoutUser = async () => {
    setIsLoading(true);
    sessionStorage.removeItem('viewAsUser');
    try {
      await signOut();
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
    setUserProfile(defaultUserProfile);
    setCurrentPage('landing');
    setIsLoading(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setStudyTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const toggleBookmarkQuestion = (questionId: string) => {
    setBookmarkedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const navigateToAnnouncement = (announcementId: string) => {
    const found = mockAnnouncements.find(a => a.id === announcementId);
    if (found) {
      setSelectedAnnouncement(found);
      setCurrentPage('announcement-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Numeric ids come from the real database (a course task's quizId, a quiz
   * picker); legacy string ids still resolve against the mock dataset so
   * older callers keep working. A non-numeric id just clears the selection,
   * which lands the user on the quiz picker rather than a wrong quiz.
   */
  const startQuizById = (quizId: number | string) => {
    const numericId = typeof quizId === 'number' ? quizId : Number(quizId);
    if (Number.isFinite(numericId)) {
      setActiveQuizId(numericId);
    } else {
      setActiveQuizId(null);
      const found = mockQuizzes.find(q => q.id === quizId) || mockQuizzes[0];
      setActiveQuiz(found);
    }
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startMockExamById = (examId: number | string) => {
    const numericId = typeof examId === 'number' ? examId : Number(examId);
    if (Number.isFinite(numericId)) {
      setActiveMockExamId(numericId);
    } else {
      setActiveMockExamId(null);
      const found = mockExams.find(e => e.id === examId) || mockExams[0];
      setActiveMockExam(found);
    }
    setCurrentPage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isLoggedIn,
        setIsLoggedIn,
        userProfile,
        setUserProfile,
        studyTasks,
        toggleTaskCompletion,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        weakAreas,
        selectedAnnouncement,
        setSelectedAnnouncement,
        selectedMentor,
        setSelectedMentor,
        activeQuizId,
        setActiveQuizId,
        activeMockExamId,
        setActiveMockExamId,
        activeQuiz,
        setActiveQuiz,
        activeMockExam,
        setActiveMockExam,
        selectedPracticeSubject,
        setSelectedPracticeSubject,
        selectedPracticeSubjectId,
        setSelectedPracticeSubjectId,
        practiceViewMode,
        setPracticeViewMode,
        subjectScores,
        saveSubjectScore,
        bookmarkedQuestionIds,
        toggleBookmarkQuestion,
        examCountdownDays,
        navigateToAnnouncement,
        startQuizById,
        startMockExamById,
        loginUser,
        registerUser,
        logoutUser,
        isLoading,
        setIsLoading,
        mockAnnouncements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
