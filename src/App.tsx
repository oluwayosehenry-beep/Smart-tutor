import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { AiTutorView } from './components/AiTutorView';
import { InteractiveLessonView } from './components/InteractiveLessonView';
import { QuizView } from './components/QuizView';
import { PracticeView } from './components/PracticeView';
import { ProgressView } from './components/ProgressView';
import { NigerianExamsView } from './components/NigerianExamsView';
import { TeacherView } from './components/TeacherView';
import { StudyScheduleView } from './components/StudyScheduleView';
import { StudyAlertToast } from './components/StudyAlertToast';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { ConfigInfoModal } from './components/ConfigInfoModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'schedule' && <StudyScheduleView />}
        {currentView === 'subjects' && <SubjectsView />}
        {currentView === 'aitutor' && <AiTutorView />}
        {currentView === 'lesson' && <InteractiveLessonView />}
        {currentView === 'quiz' && <QuizView />}
        {currentView === 'practice' && <PracticeView />}
        {currentView === 'progress' && <ProgressView />}
        {currentView === 'nigerian-exams' && <NigerianExamsView />}
        {currentView === 'teacher' && <TeacherView />}
      </main>

      {/* Interactive In-App Study Reminder Alert */}
      <StudyAlertToast />

      {/* Global Modals */}
      <AuthModal />
      <ProfileModal />
      <ConfigInfoModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
