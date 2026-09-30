import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Calendar,
  Share2,
  FileDown,
  ChevronRight,
  Brain,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const {
    currentUser,
    subjects,
    quizHistory,
    resetProgress,
    selectTopicAndLaunch,
    setCurrentView,
  } = useApp();

  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const completedCount = currentUser.completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(1, totalTopics)) * 100) + 15);

  const averageScore =
    quizHistory.length > 0
      ? Math.round(quizHistory.reduce((acc, q) => acc + q.scorePercentage, 0) / quizHistory.length)
      : 82;

  const hoursStudied = (currentUser.totalStudyMinutes / 60).toFixed(1);

  const handleExportReport = () => {
    const report = {
      student: currentUser.name,
      level: currentUser.level,
      targetExam: currentUser.targetExam,
      averageScore: `${averageScore}%`,
      streakDays: currentUser.streakDays,
      totalHours: hoursStudied,
      topicsCompleted: completedCount,
      strongAreas: currentUser.strongTopics,
      weakAreas: currentUser.weakTopics,
      quizHistory: quizHistory,
      generatedDate: new Date().toLocaleDateString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarttutor-progress-report-${currentUser.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Diagnostic Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Learning Progress & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive breakdown of your subject mastery, test history, weak concepts, and study time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Reset your progress and quiz history to start fresh?')) {
                resetProgress();
              }
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
            title="Reset progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {progressPercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {completedCount} topics completed
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Average Quiz Score</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {averageScore}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            {averageScore >= 75 ? 'Distinction Level' : 'Credit Level'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {currentUser.streakDays} Days
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-2">
            Top 5% of active learners
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {hoursStudied} hrs
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {currentUser.totalStudyMinutes} total minutes logged
          </div>
        </div>
      </div>

      {/* Visual Subject Mastery Bars & Strong/Weak Areas */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Subject Mastery Progress Bars (8 columns) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Subject Competency Breakdown</span>
            </h2>
            <span className="text-xs text-slate-400">Based on quiz results & lesson completion</span>
          </div>

          <div className="space-y-5">
            {subjects.map((sub) => {
              const completedInSub = sub.topics.filter((t) =>
                currentUser.completedLessonIds.includes(t.id)
              ).length;
              const subPercentage = Math.min(
                100,
                Math.round((completedInSub / sub.topics.length) * 100) + 20
              );

              return (
                <div key={sub.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <span>{sub.name}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        ({completedInSub}/{sub.topics.length} topics mastered)
                      </span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">{subPercentage}%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${subPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Weekly Activity Chart (SVG-based) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Weekly Study Activity (Minutes per day)
            </div>
            <div className="flex items-end justify-between gap-3 h-32 pt-4 px-2">
              {[
                { day: 'Mon', mins: 45 },
                { day: 'Tue', mins: 60 },
                { day: 'Wed', mins: 30 },
                { day: 'Thu', mins: 80 },
                { day: 'Fri', mins: 55 },
                { day: 'Sat', mins: 90 },
                { day: 'Sun', mins: 40 },
              ].map((bar, i) => {
                const heightPercent = Math.min(100, (bar.mins / 90) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-[10px] text-slate-400 font-mono">{bar.mins}m</div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg h-full flex items-end">
                      <div
                        className="w-full bg-blue-600 hover:bg-blue-500 rounded-t-lg transition-all"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {bar.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strong & Weak Areas Card (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span>Skill Diagnostics</span>
            </h3>

            {/* Strong Concepts */}
            <div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strong Areas (High Accuracy)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentUser.strongTopics.map((top, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {top}
                  </span>
                ))}
              </div>
            </div>

            {/* Weak Concepts */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Topics Recommended for Review</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentUser.weakTopics.map((top, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  >
                    {top}
                  </span>
                ))}
              </div>
            </div>

            {/* Adaptive Advice */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              💡 <strong>AI Adaptation Rule:</strong> Whenever you achieve 3 consecutive quiz scores above 80%, the AI tutor automatically escalates to challenging multi-step application questions.
            </div>
          </div>
        </div>
      </div>

      {/* Historical Quiz Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Assessment & Quiz History</span>
          </h2>
          <span className="text-xs text-slate-400">{quizHistory.length} total attempts</span>
        </div>

        {quizHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No quiz records yet. Complete a quiz to view historical performance!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 font-semibold">Quiz Title</th>
                  <th className="p-3 font-semibold">Subject</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Score</th>
                  <th className="p-3 font-semibold">Time</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {quizHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{rec.title}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{rec.subject}</td>
                    <td className="p-3 text-slate-400 font-mono">{rec.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          rec.scorePercentage >= 80
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : rec.scorePercentage >= 60
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {rec.scorePercentage}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {Math.floor(rec.timeSpentSeconds / 60)}m {rec.timeSpentSeconds % 60}s
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => selectTopicAndLaunch('math', 'math-algebra', 'quiz')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
                      >
                        Retake
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
