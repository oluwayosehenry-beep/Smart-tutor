import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Bell,
  BellOff,
  Plus,
  Play,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Volume2,
  ArrowRight,
  X,
  Target,
} from 'lucide-react';
import { StudyReminder, DayOfWeek } from '../types';

export const StudyScheduleView: React.FC = () => {
  const {
    studyReminders,
    addStudyReminder,
    updateStudyReminder,
    deleteStudyReminder,
    toggleStudyReminder,
    subjects,
    selectTopicAndLaunch,
    notificationPermission,
    requestNotificationPermission,
    triggerTestReminder,
    playStudyChime,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  // Form states
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'math');
  const [topicName, setTopicName] = useState<string>('Algebra & Quadratic Equations');
  const [reminderTime, setReminderTime] = useState<string>('17:00');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [examGoal, setExamGoal] = useState<string>('WAEC / JAMB Prep');
  const [notes, setNotes] = useState<string>('Solve 5 practice problems and review formulas.');

  // Day filter
  const [filterDay, setFilterDay] = useState<string>('All');

  const allDays: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const currentSubjectObj = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleOpenAdd = () => {
    setEditingReminderId(null);
    setSelectedSubjectId(subjects[0]?.id || 'math');
    setTopicName(subjects[0]?.topics[0]?.name || 'Algebra');
    setReminderTime('17:00');
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setDurationMinutes(30);
    setFrequency('daily');
    setExamGoal('WAEC / JAMB Prep');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rem: StudyReminder) => {
    setEditingReminderId(rem.id);
    setSelectedSubjectId(rem.subjectId);
    setTopicName(rem.topicName);
    setReminderTime(rem.time);
    setSelectedDays(rem.days);
    setDurationMinutes(rem.durationMinutes);
    setFrequency(rem.frequency);
    setExamGoal(rem.examGoal || '');
    setNotes(rem.notes || '');
    setModalOpen(true);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

    if (editingReminderId) {
      updateStudyReminder(editingReminderId, {
        subjectId: sub.id,
        subjectName: sub.name,
        topicName,
        time: reminderTime,
        days: selectedDays,
        durationMinutes,
        frequency,
        examGoal,
        notes,
      });
    } else {
      addStudyReminder({
        subjectId: sub.id,
        subjectName: sub.name,
        topicName,
        time: reminderTime,
        days: selectedDays,
        durationMinutes,
        enabled: true,
        frequency,
        examGoal,
        notes,
      });
    }

    setModalOpen(false);
  };

  const handleApplyPreset = (preset: {
    subjectName: string;
    topicName: string;
    time: string;
    days: DayOfWeek[];
    duration: number;
    goal: string;
    notes: string;
  }) => {
    const sub = subjects.find((s) => s.name.toLowerCase() === preset.subjectName.toLowerCase()) || subjects[0];
    addStudyReminder({
      subjectId: sub.id,
      subjectName: sub.name,
      topicName: preset.topicName,
      time: preset.time,
      days: preset.days,
      durationMinutes: preset.duration,
      enabled: true,
      frequency: preset.days.length >= 5 ? 'daily' : 'weekly',
      examGoal: preset.goal,
      notes: preset.notes,
    });
  };

  // Filter reminders
  const filteredReminders = studyReminders.filter((rem) => {
    if (filterDay === 'All') return true;
    return rem.days.includes(filterDay as DayOfWeek);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Smart Study Scheduler & Notifications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Study Schedule & Reminders
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Consistency is the secret to mastering difficult subjects. Set daily or weekly reminders for your
              target subjects and receive automatic browser notifications when it's time to learn!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study Reminder</span>
            </button>
            <button
              onClick={() => triggerTestReminder()}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
              title="Test the chime and reminder notification"
            >
              <Volume2 className="w-4 h-4" />
              <span>Test Notification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Permission Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              notificationPermission === 'granted'
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <Bell className="w-5 h-5" />
            ) : (
              <BellOff className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Browser Notification Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'Enabled & Active'
                  : notificationPermission === 'denied'
                  ? 'Blocked / Denied'
                  : 'Click to Enable'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {notificationPermission === 'granted'
                ? 'You will receive desktop browser notifications and audio chimes at your scheduled times.'
                : 'Enable browser notifications so you never miss a scheduled revision session even if browsing other tabs.'}
            </p>
          </div>
        </div>

        {notificationPermission !== 'granted' && (
          <button
            onClick={() => requestNotificationPermission()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 shadow-xs"
          >
            Enable Browser Alerts
          </button>
        )}
      </div>

      {/* Weekday Filter Selector */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterDay('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDay === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            All Days ({studyReminders.length})
          </button>
          {allDays.map((d) => {
            const count = studyReminders.filter((r) => r.days.includes(d)).length;
            return (
              <button
                key={d}
                onClick={() => setFilterDay(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterDay === d
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {d} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 border border-blue-200 dark:border-blue-900 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Reminders Grid */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Scheduled Study Sessions ({filteredReminders.length})
        </div>

        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No reminders scheduled for {filterDay === 'All' ? 'your curriculum' : filterDay}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a custom reminder or choose one of our high-yield exam study presets below!
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Schedule</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReminders.map((rem) => {
              return (
                <div
                  key={rem.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative ${
                    rem.enabled
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-300'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Time & Enabled Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {rem.time}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          ({rem.durationMinutes} mins)
                        </span>
                      </div>

                      {/* Toggle button */}
                      <button
                        onClick={() => toggleStudyReminder(rem.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          rem.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={rem.enabled ? 'Reminder is Active' : 'Reminder is Paused'}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            rem.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Subject & Topic */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {rem.subjectName}
                        </span>
                        {rem.examGoal && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                            {rem.examGoal}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {rem.topicName}
                      </h3>
                      {rem.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">
                          "{rem.notes}"
                        </p>
                      )}
                    </div>

                    {/* Active Days Pills */}
                    <div className="flex gap-1 pt-1">
                      {allDays.map((d) => {
                        const isDayActive = rem.days.includes(d);
                        return (
                          <span
                            key={d}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              isDayActive
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-slate-100 dark:bg-slate-700/40 text-slate-400'
                            }`}
                          >
                            {d[0]}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(rem)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Edit schedule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteStudyReminder(rem.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        selectTopicAndLaunch(rem.subjectId, rem.topicId || 'math-algebra', 'lesson')
                      }
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Study Schedule Templates */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              High-Yield Revision Templates
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              One-Click Recommended Study Routines
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'WAEC Daily STEM Sprint',
              subjectName: 'Mathematics',
              topicName: 'Algebra & Quadratic Equations',
              time: '17:00',
              days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as DayOfWeek[],
              duration: 30,
              goal: 'WAEC WASSCE',
              notes: '30-minute daily problem set with step-by-step verification.',
            },
            {
              title: 'JAMB CBT Speed Drills',
              subjectName: 'Physics',
              topicName: 'Mechanics',
              time: '18:30',
              days: ['Tue', 'Thu', 'Sat'] as DayOfWeek[],
              duration: 45,
              goal: 'JAMB UTME',
              notes: 'Timed rapid-fire question drills to master speed.',
            },
            {
              title: 'Weekend English & Essay Craft',
              subjectName: 'English',
              topicName: 'Grammar',
              time: '10:00',
              days: ['Sat', 'Sun'] as DayOfWeek[],
              duration: 40,
              goal: 'General English',
              notes: 'Grammar rules, sentence structures, and comprehension.',
            },
          ].map((preset, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>{preset.goal}</span>
                  <span className="font-mono text-slate-500">{preset.time}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.notes}
                </p>
              </div>

              <button
                onClick={() => handleApplyPreset(preset)}
                className="w-full py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Preset to Schedule</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{editingReminderId ? 'Edit Study Reminder' : 'Set New Study Reminder'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your preferred study time, days, duration, and target exam.
              </p>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Subject */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => {
                      setSelectedSubjectId(e.target.value);
                      const sub = subjects.find((s) => s.id === e.target.value);
                      if (sub && sub.topics[0]) {
                        setTopicName(sub.topics[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Focus Topic */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Focus Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="e.g. Quadratic Equations"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Time */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reminder Time (24h) *
                  </label>
                  <input
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Session Duration
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value={15}>15 Minutes (Quick Sprint)</option>
                    <option value={25}>25 Minutes (Pomodoro)</option>
                    <option value={30}>30 Minutes (Standard)</option>
                    <option value={45}>45 Minutes (Deep Focus)</option>
                    <option value={60}>60 Minutes (Full Exam Mock)</option>
                  </select>
                </div>
              </div>

              {/* Days Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Days of the Week *
                  </label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                      className="text-blue-600 hover:underline"
                    >
                      Weekdays
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])}
                      className="text-blue-600 hover:underline"
                    >
                      All Days
                    </button>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {allDays.map((d) => {
                    const isSelected = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDayToggle(d)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Exam Goal */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Exam Goal (Optional)
                </label>
                <input
                  type="text"
                  value={examGoal}
                  onChange={(e) => setExamGoal(e.target.value)}
                  placeholder="e.g. WAEC Distinction, JAMB 300+, Post-UTME..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Session Notes & Objective
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What specifically do you want to accomplish in this session?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  {editingReminderId ? 'Update Reminder' : 'Save Study Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
