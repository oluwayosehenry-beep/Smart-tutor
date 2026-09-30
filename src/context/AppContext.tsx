import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  StudentLevel,
  ExamType,
  Subject,
  Topic,
  QuizAttemptRecord,
  TeacherClass,
  UserRole,
  StudyReminder,
  DayOfWeek,
} from '../types';
import { INITIAL_SUBJECTS } from '../data/curriculum';
import { checkServerStatus } from '../services/api';

type ViewMode =
  | 'home'
  | 'dashboard'
  | 'subjects'
  | 'aitutor'
  | 'lesson'
  | 'quiz'
  | 'practice'
  | 'progress'
  | 'nigerian-exams'
  | 'teacher'
  | 'schedule';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  subjects: Subject[];
  addSubject: (newSubject: Omit<Subject, 'id'>) => void;
  addTopicToSubject: (subjectId: string, newTopic: Omit<Topic, 'id' | 'subjectId'>) => void;
  activeSubject: Subject;
  setActiveSubject: (subject: Subject) => void;
  activeTopic: Topic;
  setActiveTopic: (topic: Topic) => void;
  selectTopicAndLaunch: (subjectId: string, topicId: string, view: 'lesson' | 'quiz' | 'practice' | 'aitutor') => void;
  
  // Progress & Stats
  quizHistory: QuizAttemptRecord[];
  recordQuizAttempt: (record: Omit<QuizAttemptRecord, 'id' | 'date'>) => void;
  markLessonCompleted: (topicId: string) => void;
  addStudyMinutes: (mins: number) => void;
  resetProgress: () => void;
  
  // Theme & Status
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  serverStatus: { status: string; hasApiKey: boolean; model: string };
  
  // Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'teacher-login';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'teacher-login') => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  configModalOpen: boolean;
  setConfigModalOpen: (open: boolean) => void;

  // Teacher Hub Data
  teacherClasses: TeacherClass[];
  addTeacherClass: (name: string, grade: string, subject: string) => void;
  addStudentToClass: (classId: string, studentName: string, studentEmail: string) => void;
  assignClassTask: (classId: string, title: string, subject: string, topic: string, type: 'Lesson' | 'Quiz' | 'Practice', dueDate: string) => void;

  // Study Schedule & Reminders
  studyReminders: StudyReminder[];
  addStudyReminder: (reminder: Omit<StudyReminder, 'id'>) => void;
  updateStudyReminder: (id: string, updates: Partial<StudyReminder>) => void;
  deleteStudyReminder: (id: string) => void;
  toggleStudyReminder: (id: string) => void;
  activeStudyAlert: StudyReminder | null;
  setActiveStudyAlert: (reminder: StudyReminder | null) => void;
  notificationPermission: NotificationPermission | 'unsupported';
  requestNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  triggerTestReminder: (reminder?: StudyReminder) => void;
  playStudyChime: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_001',
  name: 'Chidi Okafor',
  email: 'chidi.okafor@example.edu.ng',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  level: 'Senior Secondary School',
  targetExam: 'WAEC',
  streakDays: 4,
  totalStudyMinutes: 340,
  enrolledSubjectIds: ['math', 'physics', 'chemistry', 'english'],
  weakTopics: ['Trigonometry', 'Organic Chemistry'],
  strongTopics: ['Algebra', 'Mechanics', 'Atomic Structure'],
  completedLessonIds: ['math-algebra', 'phys-mechanics'],
};

const DEFAULT_QUIZ_HISTORY: QuizAttemptRecord[] = [
  {
    id: 'rec_1',
    title: 'Algebra & Quadratic Equations',
    subject: 'Mathematics',
    topic: 'Algebra',
    scorePercentage: 80,
    correctCount: 4,
    totalCount: 5,
    date: '2026-09-28',
    difficulty: 'Medium',
    examType: 'WAEC',
    timeSpentSeconds: 320,
    weaknessAreas: ['Discriminant calculations'],
    recommendations: ['Practice 3 more discriminant problems before advancing to calculus'],
  },
  {
    id: 'rec_2',
    title: 'Kinematics & Newton Laws',
    subject: 'Physics',
    topic: 'Mechanics',
    scorePercentage: 90,
    correctCount: 9,
    totalCount: 10,
    date: '2026-09-29',
    difficulty: 'Hard',
    examType: 'JAMB',
    timeSpentSeconds: 580,
    weaknessAreas: [],
    recommendations: ['Strong grasp of motion formulas! Ready for Momentum & Projectiles.'],
  },
];

const INITIAL_TEACHER_CLASSES: TeacherClass[] = [
  {
    id: 'cls_1',
    name: 'SS3 Science Alpha',
    grade: 'Senior Secondary 3',
    subject: 'Mathematics & Physics',
    students: [
      {
        id: 'st_1',
        name: 'Chidi Okafor',
        email: 'chidi.okafor@example.edu.ng',
        level: 'Senior Secondary School',
        lessonsCompleted: 8,
        averageScore: 85,
        recentActivity: '2 hours ago',
        status: 'excelling',
        flaggedTopics: ['Trigonometry'],
      },
      {
        id: 'st_2',
        name: 'Amina Bello',
        email: 'amina.bello@example.edu.ng',
        level: 'Senior Secondary School',
        lessonsCompleted: 6,
        averageScore: 68,
        recentActivity: 'Yesterday',
        status: 'needs-help',
        flaggedTopics: ['Organic Chemistry', 'Calculus'],
      },
      {
        id: 'st_3',
        name: 'Emeka Nwosu',
        email: 'emeka.nwosu@example.edu.ng',
        level: 'Senior Secondary School',
        lessonsCompleted: 10,
        averageScore: 92,
        recentActivity: '30 mins ago',
        status: 'excelling',
        flaggedTopics: [],
      },
    ],
    assignments: [
      {
        id: 'asg_1',
        title: 'WAEC Prep: Quadratic Equations & Circle Geometry',
        subject: 'Mathematics',
        topic: 'Algebra',
        type: 'Quiz',
        dueDate: '2026-10-05',
        assignedClass: 'SS3 Science Alpha',
        submissionCount: 2,
        totalStudents: 3,
      },
    ],
  },
];

const DEFAULT_STUDY_REMINDERS: StudyReminder[] = [
  {
    id: 'rem_1',
    subjectId: 'math',
    subjectName: 'Mathematics',
    topicId: 'math-algebra',
    topicName: 'Algebra & Quadratic Equations',
    time: '17:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    durationMinutes: 30,
    enabled: true,
    frequency: 'daily',
    examGoal: 'WAEC / JAMB Prep',
    notes: 'Solve 5 practice problems and review discriminant formulas.',
  },
  {
    id: 'rem_2',
    subjectId: 'physics',
    subjectName: 'Physics',
    topicId: 'phys-mechanics',
    topicName: 'Mechanics & Newton Laws',
    time: '18:30',
    days: ['Tue', 'Thu', 'Sat'],
    durationMinutes: 45,
    enabled: true,
    frequency: 'weekly',
    examGoal: 'JAMB CBT Pacing',
    notes: 'Kinematics formulas drill and timed question simulation.',
  },
  {
    id: 'rem_3',
    subjectId: 'english',
    subjectName: 'English',
    topicId: 'eng-grammar',
    topicName: 'Grammar & Concord',
    time: '19:45',
    days: ['Mon', 'Wed', 'Sat'],
    durationMinutes: 25,
    enabled: true,
    frequency: 'weekly',
    examGoal: 'General English',
    notes: 'Subject-verb concord and essay writing techniques.',
  },
];

export function playStudyChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const startTime = ctx.currentTime + idx * 0.12;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch (e) {
    console.warn('Audio chime muted or blocked:', e);
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('smarttutor_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [activeSubject, setActiveSubject] = useState<Subject>(subjects[0]);
  const [activeTopic, setActiveTopic] = useState<Topic>(subjects[0].topics[0]);

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smarttutor_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [quizHistory, setQuizHistory] = useState<QuizAttemptRecord[]>(() => {
    const saved = localStorage.getItem('smarttutor_quiz_history');
    return saved ? JSON.parse(saved) : DEFAULT_QUIZ_HISTORY;
  });

  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>(() => {
    const saved = localStorage.getItem('smarttutor_teacher_classes');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_CLASSES;
  });

  // Study Reminders State
  const [studyReminders, setStudyReminders] = useState<StudyReminder[]>(() => {
    const saved = localStorage.getItem('smarttutor_study_schedule');
    return saved ? JSON.parse(saved) : DEFAULT_STUDY_REMINDERS;
  });

  const [activeStudyAlert, setActiveStudyAlert] = useState<StudyReminder | null>(null);

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('smarttutor_dark') === 'true';
  });

  const [serverStatus, setServerStatus] = useState<{ status: string; hasApiKey: boolean; model: string }>({
    status: 'checking',
    hasApiKey: false,
    model: 'gemini-3.8-flash',
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'teacher-login'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Check server status on mount
  useEffect(() => {
    checkServerStatus().then((res) => {
      setServerStatus(res);
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smarttutor_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('smarttutor_quiz_history', JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem('smarttutor_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('smarttutor_teacher_classes', JSON.stringify(teacherClasses));
  }, [teacherClasses]);

  useEffect(() => {
    localStorage.setItem('smarttutor_study_schedule', JSON.stringify(studyReminders));
  }, [studyReminders]);

  useEffect(() => {
    localStorage.setItem('smarttutor_dark', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Request browser notification permission
  const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  };

  // Trigger Study Notification (Both Web Notification & In-App Alert Modal with Chime)
  const triggerNotification = (reminder: StudyReminder) => {
    playStudyChime();
    setActiveStudyAlert(reminder);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(`⏰ SmartTutor AI: Time to Study ${reminder.subjectName}!`, {
          body: `Focus: ${reminder.topicName} (${reminder.durationMinutes} mins scheduled). Let's achieve your goals!`,
          icon: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
        });
        notif.onclick = () => {
          window.focus();
          selectTopicAndLaunch(reminder.subjectId, reminder.topicId || '', 'lesson');
        };
      } catch (err) {
        console.warn('Browser Notification API error:', err);
      }
    }
  };

  const triggerTestReminder = (customReminder?: StudyReminder) => {
    const reminderToTest = customReminder || studyReminders[0] || {
      id: 'test_rem',
      subjectId: 'math',
      subjectName: 'Mathematics',
      topicId: 'math-algebra',
      topicName: 'Algebra & Quadratic Equations',
      time: '12:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      durationMinutes: 30,
      enabled: true,
      frequency: 'daily',
      examGoal: 'WAEC / JAMB Prep',
      notes: 'Test notification check',
    };
    triggerNotification(reminderToTest);
  };

  // Background reminder timer: checks every 10 seconds against current local time and day
  useEffect(() => {
    const dayMap: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = dayMap[now.getDay()];
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const todayDate = now.toISOString().split('T')[0];

      studyReminders.forEach((rem) => {
        if (!rem.enabled) return;

        // Check if day matches
        const matchesDay = rem.days.includes(currentDay) || rem.frequency === 'daily';
        const matchesTime = rem.time === currentTime;
        const alreadyNotifiedThisMinute = rem.lastNotifiedDate === `${todayDate} ${currentTime}`;

        if (matchesDay && matchesTime && !alreadyNotifiedThisMinute) {
          triggerNotification(rem);

          // Mark last notified to avoid repeated alerts in the same minute
          setStudyReminders((prev) =>
            prev.map((r) =>
              r.id === rem.id
                ? { ...r, lastNotifiedDate: `${todayDate} ${currentTime}` }
                : r
            )
          );
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [studyReminders]);

  const addStudyReminder = (newReminderData: Omit<StudyReminder, 'id'>) => {
    const newRem: StudyReminder = {
      ...newReminderData,
      id: `rem_${Date.now()}`,
    };
    setStudyReminders((prev) => [...prev, newRem]);
  };

  const updateStudyReminder = (id: string, updates: Partial<StudyReminder>) => {
    setStudyReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteStudyReminder = (id: string) => {
    setStudyReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleStudyReminder = (id: string) => {
    setStudyReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addSubject = (newSubjectData: Omit<Subject, 'id'>) => {
    const newSub: Subject = {
      ...newSubjectData,
      id: `subj_${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  const addTopicToSubject = (subjectId: string, newTopicData: Omit<Topic, 'id' | 'subjectId'>) => {
    const newTop: Topic = {
      ...newTopicData,
      id: `top_${Date.now()}`,
      subjectId,
    };
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          return { ...sub, topics: [...sub.topics, newTop] };
        }
        return sub;
      })
    );
  };

  const selectTopicAndLaunch = (
    subjectId: string,
    topicId: string,
    view: 'lesson' | 'quiz' | 'practice' | 'aitutor'
  ) => {
    const foundSubject = subjects.find((s) => s.id === subjectId) || subjects[0];
    const foundTopic = foundSubject.topics.find((t) => t.id === topicId) || foundSubject.topics[0];
    setActiveSubject(foundSubject);
    setActiveTopic(foundTopic);
    setCurrentView(view);
  };

  const recordQuizAttempt = (record: Omit<QuizAttemptRecord, 'id' | 'date'>) => {
    const newRecord: QuizAttemptRecord = {
      ...record,
      id: `quiz_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setQuizHistory((prev) => [newRecord, ...prev]);

    // Update student progress & weak/strong areas
    setCurrentUser((prev) => {
      const isWeak = record.scorePercentage < 70;
      const isStrong = record.scorePercentage >= 80;

      let updatedWeak = [...prev.weakTopics];
      let updatedStrong = [...prev.strongTopics];

      if (isWeak && !updatedWeak.includes(record.topic)) {
        updatedWeak.push(record.topic);
        updatedStrong = updatedStrong.filter((t) => t !== record.topic);
      } else if (isStrong) {
        if (!updatedStrong.includes(record.topic)) updatedStrong.push(record.topic);
        updatedWeak = updatedWeak.filter((t) => t !== record.topic);
      }

      return {
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + Math.round(record.timeSpentSeconds / 60),
        weakTopics: updatedWeak,
        strongTopics: updatedStrong,
      };
    });
  };

  const markLessonCompleted = (topicId: string) => {
    setCurrentUser((prev) => {
      if (prev.completedLessonIds.includes(topicId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, topicId],
        totalStudyMinutes: prev.totalStudyMinutes + 20,
      };
    });
  };

  const addStudyMinutes = (mins: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + mins,
    }));
  };

  const resetProgress = () => {
    setQuizHistory([]);
    setCurrentUser((prev) => ({
      ...prev,
      completedLessonIds: [],
      weakTopics: [],
      strongTopics: [],
      totalStudyMinutes: 0,
      streakDays: 1,
    }));
  };

  const addTeacherClass = (name: string, grade: string, subject: string) => {
    const newClass: TeacherClass = {
      id: `cls_${Date.now()}`,
      name,
      grade,
      subject,
      students: [],
      assignments: [],
    };
    setTeacherClasses((prev) => [...prev, newClass]);
  };

  const addStudentToClass = (classId: string, studentName: string, studentEmail: string) => {
    setTeacherClasses((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            students: [
              ...c.students,
              {
                id: `st_${Date.now()}`,
                name: studentName,
                email: studentEmail,
                level: currentUser.level,
                lessonsCompleted: 0,
                averageScore: 0,
                recentActivity: 'Just enrolled',
                status: 'active',
                flaggedTopics: [],
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const assignClassTask = (
    classId: string,
    title: string,
    subject: string,
    topic: string,
    type: 'Lesson' | 'Quiz' | 'Practice',
    dueDate: string
  ) => {
    setTeacherClasses((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            assignments: [
              ...c.assignments,
              {
                id: `asg_${Date.now()}`,
                title,
                subject,
                topic,
                type,
                dueDate,
                assignedClass: c.name,
                submissionCount: 0,
                totalStudents: c.students.length,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        subjects,
        addSubject,
        addTopicToSubject,
        activeSubject,
        setActiveSubject,
        activeTopic,
        setActiveTopic,
        selectTopicAndLaunch,
        quizHistory,
        recordQuizAttempt,
        markLessonCompleted,
        addStudyMinutes,
        resetProgress,
        isDarkMode,
        toggleDarkMode,
        serverStatus,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        profileModalOpen,
        setProfileModalOpen,
        configModalOpen,
        setConfigModalOpen,
        teacherClasses,
        addTeacherClass,
        addStudentToClass,
        assignClassTask,
        studyReminders,
        addStudyReminder,
        updateStudyReminder,
        deleteStudyReminder,
        toggleStudyReminder,
        activeStudyAlert,
        setActiveStudyAlert,
        notificationPermission,
        requestNotificationPermission,
        triggerTestReminder,
        playStudyChime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
