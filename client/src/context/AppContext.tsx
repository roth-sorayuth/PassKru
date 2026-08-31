import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, ExamTarget, StudyTask, AppNotification, WeakArea, Announcement, Mentor, Quiz, MockExam, Question } from '../types';
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
  | 'learning'
  | 'practice'
  | 'past-papers'
  | 'quiz'
  | 'mock-exam'
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
  learning: '/learning',
  quiz: '/quiz',
  'mock-exam': '/mock-exam',
  'study-plan': '/study-plan',
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
  '/learning': 'learning',
  '/quiz': 'quiz',
  '/mock-exam': 'mock-exam',
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
  bookmarkedQuestionIds: string[];
  toggleBookmarkQuestion: (questionId: string) => void;
  examCountdownDays: number;
  navigateToAnnouncement: (announcementId: string) => void;
  startQuizById: (quizId: string) => void;
  startMockExamById: (examId: string) => void;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (data: any) => Promise<void>;
  logoutUser: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mockAnnouncements: Announcement[];
}

const defaultUserProfile: UserProfile = {
  name: 'សុខ វិសាល (Sok Visal)',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  targetExam: 'nie',
  targetSubject: 'គរុកោសល្យ និងវប្បធម៌ទូទៅ (Pedagogy & General Culture)',
  dailyGoalMinutes: 60,
  streakDays: 14,
  completedQuestions: 248,
  averageScore: 78,
  studyHoursTotal: 42
};

const mapBackendUserToProfile = (backendUser: any): UserProfile => {
  return {
    name: `${backendUser.firstName} ${backendUser.lastName}`,
    avatar: backendUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${backendUser.firstName}`,
    targetExam: (backendUser.targetExamId === 1 ? 'nie' : backendUser.targetExamId === 2 ? 'rttc' : backendUser.targetExamId === 3 ? 'pttc' : 'nie') as ExamTarget,
    targetSubject: backendUser.targetSubject || 'គរុកោសល្យ និងវប្បធម៌ទូទៅ (Pedagogy & General Culture)',
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
          // Fetch additional user details (like role) from backend db
          const response = await api('/auth/me');
          const dbUser = response.user;
          
          if (dbUser.role === 'admin' && sessionStorage.getItem('viewAsUser') !== 'true') {
            window.location.href = `${window.location.protocol}//${window.location.hostname}:3001`;
            return; // Prevent setIsLoading(false) so the screen stays dark/loading while redirecting
          }
          
          if (dbUser.role !== 'admin') {
            sessionStorage.removeItem('viewAsUser');
          }

          setUserProfile({
            name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
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

  const startQuizById = (quizId: string) => {
    const found = mockQuizzes.find(q => q.id === quizId) || mockQuizzes[0];
    setActiveQuiz(found);
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startMockExamById = (examId: string) => {
    const found = mockExams.find(e => e.id === examId) || mockExams[0];
    setActiveMockExam(found);
    setCurrentPage('mock-exam');
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
        activeQuiz,
        setActiveQuiz,
        activeMockExam,
        setActiveMockExam,
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
