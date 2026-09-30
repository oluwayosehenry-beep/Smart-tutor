import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Clock,
  BookOpen,
  Sparkles,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

export const StudyAlertToast: React.FC = () => {
  const {
    activeStudyAlert,
    setActiveStudyAlert,
    selectTopicAndLaunch,
    playStudyChime,
    addStudyMinutes,
  } = useApp();

  if (!activeStudyAlert) return null;

  const handleStartLesson = () => {
    const subId = activeStudyAlert.subjectId || 'math';
    const topId = activeStudyAlert.topicId || 'math-algebra';
    setActiveStudyAlert(null);
    selectTopicAndLaunch(subId, topId, 'lesson');
  };

  const handleStartQuiz = () => {
    const subId = activeStudyAlert.subjectId || 'math';
    const topId = activeStudyAlert.topicId || 'math-algebra';
    setActiveStudyAlert(null);
    selectTopicAndLaunch(subId, topId, 'quiz');
  };

  const handleSnooze = () => {
    setActiveStudyAlert(null);
    // Alert again in 5 minutes
    setTimeout(() => {
      playStudyChime();
      setActiveStudyAlert(activeStudyAlert);
    }, 5 * 60 * 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-8 duration-300">
      <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-2xl border-2 border-blue-500/80 relative overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl pointer-events-none"></div>

        <button
          onClick={() => setActiveStudyAlert(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          title="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 animate-bounce">
            <Bell className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 flex-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                Study Reminder
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-amber-400" />
                {activeStudyAlert.durationMinutes} mins scheduled
              </span>
            </div>

            <h3 className="text-base font-bold text-white leading-tight">
              Time to Study {activeStudyAlert.subjectName}!
            </h3>

            <p className="text-xs text-blue-200 font-medium">
              Topic: <span className="text-white underline">{activeStudyAlert.topicName}</span>
            </p>

            {activeStudyAlert.notes && (
              <p className="text-[11px] text-slate-300 line-clamp-2 pt-1 italic">
                "{activeStudyAlert.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={handleStartLesson}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Lesson Now</span>
          </button>

          <button
            onClick={handleStartQuiz}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Quiz</span>
          </button>

          <button
            onClick={handleSnooze}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Snooze reminder for 5 minutes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Snooze 5m</span>
          </button>
        </div>
      </div>
    </div>
  );
};
