import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Lock, Mail, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StudentLevel, ExamType } from '../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    setCurrentUser,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<StudentLevel>('Senior Secondary School');
  const [targetExam, setTargetExam] = useState<ExamType>('WAEC');
  const [resetSent, setResetSent] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authModalMode === 'forgot') {
      setResetSent(true);
      return;
    }

    const isTeacher = authModalMode === 'teacher-login';

    const userProfile = {
      id: `usr_${Date.now()}`,
      name: name || (isTeacher ? 'Dr. Mary Okon' : email.split('@')[0] || 'Learner'),
      email: email || 'student@smarttutor.ai',
      role: isTeacher ? ('teacher' as const) : ('student' as const),
      avatar: isTeacher
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      level: level,
      targetExam: targetExam,
      streakDays: 3,
      totalStudyMinutes: 180,
      enrolledSubjectIds: ['math', 'physics', 'chemistry', 'english'],
      weakTopics: ['Trigonometry'],
      strongTopics: ['Algebra', 'Mechanics'],
      completedLessonIds: ['math-algebra'],
    };

    setCurrentUser(userProfile);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 relative">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {authModalMode === 'login'
              ? 'Student Sign In'
              : authModalMode === 'register'
              ? 'Join SmartTutor AI'
              : authModalMode === 'teacher-login'
              ? 'Teacher & Educator Login'
              : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {authModalMode === 'forgot'
              ? 'Enter your registered email to receive reset instructions'
              : 'Access your lessons, streak, and AI tutor'}
          </p>
        </div>

        {resetSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-bold text-emerald-900 dark:text-emerald-200">
              Password Reset Instructions Sent!
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Check your inbox for a reset link. For this prototype, you can proceed to sign in with your password.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setAuthModalMode('login');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {authModalMode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chidi Okafor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot')}
                      className="text-[11px] text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {authModalMode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Primary School">Primary School</option>
                    <option value="Junior Secondary School">Junior Secondary</option>
                    <option value="Senior Secondary School">Senior Secondary</option>
                    <option value="University">University</option>
                    <option value="Professional/Adult Learning">Adult / Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Exam
                  </label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="WAEC">WAEC (WASSCE)</option>
                    <option value="JAMB">JAMB (UTME)</option>
                    <option value="NECO">NECO (SSCE)</option>
                    <option value="Common Entrance">Common Entrance</option>
                    <option value="None">None (General)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              {authModalMode === 'login'
                ? 'Sign In to SmartTutor'
                : authModalMode === 'register'
                ? 'Create Free Account'
                : authModalMode === 'teacher-login'
                ? 'Enter Teacher Portal'
                : 'Send Reset Link'}
            </button>

            {/* Switch modes */}
            <div className="pt-2 text-center space-y-1.5 text-xs text-slate-500">
              {authModalMode === 'login' && (
                <>
                  <div>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('register')}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Register here
                    </button>
                  </div>
                  <div>
                    Are you a school teacher?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('teacher-login')}
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      Teacher Login
                    </button>
                  </div>
                </>
              )}

              {authModalMode === 'register' && (
                <div>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {authModalMode === 'teacher-login' && (
                <div>
                  Student?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Student Login
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
