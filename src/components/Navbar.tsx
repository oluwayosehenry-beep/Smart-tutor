import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  Layers,
  BarChart3,
  Sun,
  Moon,
  User,
  Users,
  ChevronDown,
  Info,
  Menu,
  X,
  Target,
  Calendar,
} from 'lucide-react';
import { StudentLevel, ExamType } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    setAuthModalOpen,
    setAuthModalMode,
    setProfileModalOpen,
    setConfigModalOpen,
    serverStatus,
    studyReminders,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const studentLevels: StudentLevel[] = [
    'Primary School',
    'Junior Secondary School',
    'Senior Secondary School',
    'University',
    'Professional/Adult Learning',
  ];

  const exams: ExamType[] = ['None', 'WAEC', 'NECO', 'JAMB', 'Common Entrance', 'University Entrance'];

  const { setCurrentUser } = useApp();

  const handleLevelChange = (lvl: StudentLevel) => {
    setCurrentUser((prev) => ({ ...prev, level: lvl }));
    setLevelDropdownOpen(false);
  };

  const activeRemindersCount = studyReminders.filter((r) => r.enabled).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Layers },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Calendar, badge: activeRemindersCount > 0 ? `${activeRemindersCount}` : undefined },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'aitutor', label: 'AI Tutor', icon: Brain, badge: 'Live AI' },
    { id: 'lesson', label: 'Lesson Mode', icon: Sparkles },
    { id: 'practice', label: 'Practice & Quiz', icon: Award },
    { id: 'nigerian-exams', label: 'WAEC / JAMB', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'teacher', label: 'Teacher Hub', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                  SmartTutor<span className="text-blue-500 font-extrabold ml-0.5">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                  Adaptive Learning Platform
                </span>
              </div>
            </button>

            {/* Level Quick Selector */}
            <div className="relative ml-2 hidden md:block">
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors"
                title="Change Academic Level"
              >
                <span>{currentUser.level}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {levelDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Academic Level
                  </div>
                  {studentLevels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleLevelChange(lvl)}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                        currentUser.level === lvl
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {lvl}
                      {currentUser.level === lvl && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                    </button>
                  ))}
                  <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Target Examination
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-2 py-1">
                    {exams.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => {
                          setCurrentUser((prev) => ({ ...prev, targetExam: ex }));
                          setLevelDropdownOpen(false);
                        }}
                        className={`px-2 py-1 text-[11px] rounded text-center transition-colors ${
                          currentUser.targetExam === ex
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: AI Status, Theme Toggle, User Profile */}
          <div className="flex items-center gap-2">
            {/* AI Engine Status Button */}
            <button
              onClick={() => setConfigModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
              title="Google Gemini AI Engine Connected"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold hidden lg:inline">Gemini 3.8 Flash</span>
              <Info className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-white dark:bg-slate-800 group"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline group-hover:text-blue-600">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hidden md:inline">
                  {currentUser.role === 'teacher' ? 'Teacher' : currentUser.targetExam !== 'None' ? currentUser.targetExam : 'Student'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Academic Level: <span className="text-blue-600 dark:text-blue-400">{currentUser.level}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {studentLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    handleLevelChange(lvl);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    currentUser.level === lvl
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400"
            >
              My Profile & Settings
            </button>
            <button
              onClick={() => {
                setConfigModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              AI Engine Info
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
