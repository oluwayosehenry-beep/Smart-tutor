import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Play,
  RotateCcw,
  Target,
  ChevronRight,
  Calendar,
  Bell,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    subjects,
    quizHistory,
    setCurrentView,
    selectTopicAndLaunch,
    setProfileModalOpen,
    studyReminders,
  } = useApp();

  // Calculate today's reminders
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDay = dayNames[new Date().getDay()];
  const todaysReminders = studyReminders.filter(
    (r) => r.enabled && (r.days.includes(todayDay as any) || r.frequency === 'daily')
  );

  // Calculate overall metrics
  const totalAvailableTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const lessonsCompletedCount = currentUser.completedLessonIds.length;
  const overallProgressPercent = Math.min(
    100,
    Math.round((lessonsCompletedCount / Math.max(1, totalAvailableTopics)) * 100) + 12
  );

  const averageQuizScore =
    quizHistory.length > 0
      ? Math.round(quizHistory.reduce((acc, q) => acc + q.scorePercentage, 0) / quizHistory.length)
      : 85;

  const hoursStudied = (currentUser.totalStudyMinutes / 60).toFixed(1);

  // Recommendations: Prioritize topics in weakTopics, otherwise pick uncompleted topics
  const recommendedTopics = subjects
    .flatMap((s) => s.topics.map((t) => ({ ...t, subjectName: s.name, subjectId: s.id })))
    .filter((t) => currentUser.weakTopics.includes(t.name) || !currentUser.completedLessonIds.includes(t.id))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {currentUser.name}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                  {currentUser.level}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                Target Exam:{' '}
                <strong className="text-white font-semibold">
                  {currentUser.targetExam !== 'None' ? currentUser.targetExam : 'Standard Curriculum'}
                </strong>{' '}
                • You have a <strong className="text-amber-300">{currentUser.streakDays}-day learning streak</strong>! Keep it going today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('aitutor')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4 text-blue-600" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm transition-all border border-white/20"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall Progress */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {overallProgressPercent}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${overallProgressPercent}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {lessonsCompletedCount} of {totalAvailableTopics} topics mastered
          </div>
        </div>

        {/* Learning Streak */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1">
            <span>{currentUser.streakDays}</span>
            <span className="text-xs font-semibold text-slate-400">days</span>
          </div>
          <div className="flex gap-1.5 mt-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              const isActive = idx < currentUser.streakDays;
              return (
                <div
                  key={idx}
                  className={`flex-1 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-2">
            🔥 Practice today to extend streak!
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Average Quiz Score</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1">
            <span>{averageQuizScore}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {averageQuizScore >= 75 ? 'Distinction' : 'Good'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${averageQuizScore}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across {quizHistory.length} recorded tests
          </div>
        </div>

        {/* Total Study Time */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-1">
            <span>{hoursStudied}</span>
            <span className="text-xs font-semibold text-slate-400">hours</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (currentUser.totalStudyMinutes / 600) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Target: 10 hrs per week
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Subjects being studied & Recommended Lessons */}
        <div className="lg:col-span-8 space-y-8">
          {/* Today's Study Schedule & Reminders Banner */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Today's Study Schedule ({todayDay})
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {todaysReminders.length > 0
                      ? `${todaysReminders.length} scheduled revision session(s) today`
                      : 'No revision scheduled for today'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('schedule')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Manage Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysReminders.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {todaysReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {rem.time}
                        </span>
                        <span className="text-[10px] text-slate-400">({rem.durationMinutes}m)</span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {rem.subjectName}: {rem.topicName}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        selectTopicAndLaunch(rem.subjectId, rem.topicId || 'math-algebra', 'lesson')
                      }
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs shrink-0"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Want to maintain your streak? Schedule a 25-minute session today.</span>
                <button
                  onClick={() => setCurrentView('schedule')}
                  className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs"
                >
                  Set Reminder
                </button>
              </div>
            )}
          </div>

          {/* Subjects Enrolled */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>My Subjects in Progress</span>
              </h2>
              <button
                onClick={() => setCurrentView('subjects')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all subjects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {subjects.slice(0, 4).map((sub) => {
                const completedInSubject = sub.topics.filter((t) =>
                  currentUser.completedLessonIds.includes(t.id)
                ).length;
                const percent = Math.round((completedInSubject / sub.topics.length) * 100);

                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {sub.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {completedInSubject} of {sub.topics.length} topics
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{percent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => selectTopicAndLaunch(sub.id, sub.topics[0]?.id, 'lesson')}
                        className="flex-1 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Continue</span>
                      </button>
                      <button
                        onClick={() => selectTopicAndLaunch(sub.id, sub.topics[0]?.id, 'aitutor')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                        title="Chat with AI about this subject"
                      >
                        <Brain className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Recommended Lessons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Personalized AI Recommendations
                </h2>
              </div>
              <span className="text-xs text-slate-500">Adapted to your weak areas & exam syllabus</span>
            </div>

            <div className="space-y-3">
              {recommendedTopics.map((topic) => {
                const isWeakSpot = currentUser.weakTopics.includes(topic.name);
                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {topic.subjectName}
                        </span>
                        {isWeakSpot && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Needs Attention
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">• {topic.estimatedMinutes} mins</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{topic.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => selectTopicAndLaunch(topic.subjectId, topic.id, 'lesson')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Start Lesson</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => selectTopicAndLaunch(topic.subjectId, topic.id, 'quiz')}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                        title="Take practice quiz"
                      >
                        Quiz
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Performance & Diagnostic Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Diagnostic Areas Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span>Skill Mastery Diagnostics</span>
            </h3>

            {/* Strong Areas */}
            <div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strong Concepts (80%+)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.strongTopics.length > 0 ? (
                  currentUser.strongTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                    >
                      {top}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Take more quizzes to establish strong areas</span>
                )}
              </div>
            </div>

            {/* Weak Areas */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Recommended for Review</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.weakTopics.length > 0 ? (
                  currentUser.weakTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                    >
                      {top}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No weak areas detected! Excellent work.</span>
                )}
              </div>
            </div>

            {/* Smart Advice Banner */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              💡 <strong>AI Tutor Note:</strong> You may want to review{' '}
              <strong className="underline">Trigonometric Identities</strong> before starting advanced Calculus.
            </div>
          </div>

          {/* Recent Quiz Scores Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Recent Quiz Scores</span>
              </h3>
              <button
                onClick={() => setCurrentView('progress')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Full report
              </button>
            </div>

            {quizHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No quizzes taken yet. Launch your first quiz to see scores here!
              </div>
            ) : (
              <div className="space-y-3">
                {quizHistory.slice(0, 4).map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{q.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {q.subject} • {q.date}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                        q.scorePercentage >= 80
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.scorePercentage >= 60
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {q.scorePercentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setCurrentView('practice')}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Generate New Timed Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
