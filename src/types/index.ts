export type StudentLevel =
  | 'Primary School'
  | 'Junior Secondary School'
  | 'Senior Secondary School'
  | 'University'
  | 'Professional/Adult Learning';

export type ExamType =
  | 'None'
  | 'WAEC'
  | 'NECO'
  | 'JAMB'
  | 'Common Entrance'
  | 'University Entrance';

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  level: StudentLevel;
  targetExam: ExamType;
  streakDays: number;
  totalStudyMinutes: number;
  enrolledSubjectIds: string[];
  weakTopics: string[];
  strongTopics: string[];
  completedLessonIds: string[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
  subtopics?: string[];
  examRelevance?: string[];
}

export interface Subject {
  id: string;
  name: string;
  iconName: string;
  category: 'Mathematics' | 'Languages' | 'Sciences' | 'Social Sciences' | 'Custom';
  description: string;
  accentColor: string;
  topics: Topic[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  subject?: string;
  topic?: string;
  isHint?: boolean;
  suggestions?: string[];
  source?: 'gemini' | 'curriculum-engine' | 'system';
}

export interface WorkedExample {
  problem: string;
  stepByStepSolution: string[];
  keyTakeaway: string;
}

export interface InteractiveQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  hint: string;
  explanation: string;
}

export interface PracticeExercise {
  exercise: string;
  hint: string;
  solution: string;
}

export interface ShortQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HomeworkItem {
  task: string;
  guidance: string;
}

export interface InteractiveLesson {
  title: string;
  subject: string;
  level: string;
  estimatedMinutes: number;
  objectives: string[];
  introduction: string;
  explanation: string;
  workedExamples: WorkedExample[];
  interactiveQuestions: InteractiveQuestion[];
  practiceExercises: PracticeExercise[];
  shortQuiz: ShortQuizItem[];
  summary: string[];
  homework: HomeworkItem[];
}

export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'tf' | 'short';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  hint?: string;
  explanation: string;
  userAnswer?: number | string;
  isCorrect?: boolean;
}

export interface QuizSet {
  title: string;
  subject?: string;
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examType?: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizAttemptRecord {
  id: string;
  title: string;
  subject: string;
  topic: string;
  scorePercentage: number;
  correctCount: number;
  totalCount: number;
  date: string;
  difficulty: string;
  examType: string;
  timeSpentSeconds: number;
  weaknessAreas: string[];
  recommendations: string[];
}

export interface PracticeProblem {
  id: number;
  title: string;
  question: string;
  hints: string[];
  options?: string[];
  correctIndex?: number;
  stepByStepSolution: string[];
  keyTakeaway: string;
}

export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  level: StudentLevel;
  lessonsCompleted: number;
  averageScore: number;
  recentActivity: string;
  status: 'active' | 'needs-help' | 'excelling';
  flaggedTopics: string[];
}

export interface TeacherAssignment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  type: 'Lesson' | 'Quiz' | 'Practice';
  dueDate: string;
  assignedClass: string;
  submissionCount: number;
  totalStudents: number;
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  subject: string;
  students: TeacherStudent[];
  assignments: TeacherAssignment[];
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface StudyReminder {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId?: string;
  topicName: string;
  time: string; // HH:MM (24-hour format)
  days: DayOfWeek[];
  durationMinutes: number;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  examGoal?: string;
  notes?: string;
  lastNotifiedDate?: string;
}

