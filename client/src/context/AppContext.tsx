import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ExamTarget, StudyTask, AppNotification, WeakArea, Announcement, Mentor, Quiz, MockExam, Question } from '../types';
import { mockStudyTasks, mockNotifications, mockWeakAreas, mockAnnouncements, mockMentors, mockQuizzes, mockExams } from '../data/mockData';
import { api } from '../utils/api';

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'exam-info'
  | 'announcement-detail'
  | 'requirements'
  | 'learning'
  | 'past-papers'
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
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
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
    role: backendUser.role || 'candidate',
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<ActivePage>('landing');
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
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState<boolean>(false);

  // Calculated Days to Exam (Target: Oct 25, 2026)
  const examCountdownDays = 67;

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api('/auth/me');
          if (res.success && res.user) {
            const profile = mapBackendUserToProfile(res.user);
            setUserProfile(profile);
            setIsLoggedIn(true);
            setCurrentPage(profile.role === 'admin' ? 'past-papers' : 'dashboard');
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setCurrentPage('landing');
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setCurrentPage('landing');
        }
      } else {
        setIsLoggedIn(false);
        setCurrentPage('landing');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        const profile = mapBackendUserToProfile(res.user);
        setUserProfile(profile);
        setIsLoggedIn(true);
        setCurrentPage(profile.role === 'admin' ? 'past-papers' : 'dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  };

  const registerUser = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api('/auth/register', {
        method: 'POST',
        body: data,
      });
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        setUserProfile(mapBackendUserToProfile(res.user));
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(defaultUserProfile);
    setCurrentPage('landing');
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
        isLoginModalOpen,
        setLoginModalOpen,
        isRegisterModalOpen,
        setRegisterModalOpen,
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
