import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  TrendingUp,
  Clock,
  Sparkles,
  Calendar,
  X,
  Search,
} from 'lucide-react';
import { TeacherClass, StudentLevel } from '../types';

export const TeacherView: React.FC = () => {
  const {
    teacherClasses,
    addTeacherClass,
    addStudentToClass,
    assignClassTask,
    subjects,
    currentUser,
    setCurrentUser,
  } = useApp();

  const [activeClassId, setActiveClassId] = useState<string>(teacherClasses[0]?.id || '');
  const [createClassModalOpen, setCreateClassModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [assignTaskModalOpen, setAssignTaskModalOpen] = useState(false);

  // Form states
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Senior Secondary 3');
  const [newClassSubject, setNewClassSubject] = useState('Mathematics');

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [taskTopic, setTaskTopic] = useState(subjects[0]?.topics[0]?.name || 'Algebra');
  const [taskType, setTaskType] = useState<'Lesson' | 'Quiz' | 'Practice'>('Quiz');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-15');

  const activeClass = teacherClasses.find((c) => c.id === activeClassId) || teacherClasses[0];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addTeacherClass(newClassName.trim(), newClassGrade, newClassSubject);
    setNewClassName('');
    setCreateClassModalOpen(false);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) return;
    addStudentToClass(activeClass.id, studentName.trim(), studentEmail.trim());
    setStudentName('');
    setStudentEmail('');
    setAddStudentModalOpen(false);
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    assignClassTask(activeClass.id, taskTitle.trim(), taskSubject, taskTopic, taskType, taskDueDate);
    setTaskTitle('');
    setAssignTaskModalOpen(false);
  };

  const handleExportClassReport = () => {
    if (!activeClass) return;
    const reportData = {
      className: activeClass.name,
      grade: activeClass.grade,
      subject: activeClass.subject,
      totalStudents: activeClass.students.length,
      students: activeClass.students,
      assignments: activeClass.assignments,
      generatedDate: new Date().toLocaleDateString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeClass.name.toLowerCase().replace(/\s+/g, '-')}-performance-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Teacher & Educator Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Teacher Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your classes, assign AI lessons & quizzes, and monitor individual student comprehension in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCreateClassModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Class</span>
          </button>

          <button
            onClick={handleExportClassReport}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            <span>Generate Class Report</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {teacherClasses.map((cls) => {
          const isSelected = cls.id === activeClass?.id;
          return (
            <button
              key={cls.id}
              onClick={() => setActiveClassId(cls.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {cls.name} ({cls.students.length} students)
            </button>
          );
        })}
      </div>

      {activeClass && (
        <div className="space-y-8">
          {/* Class Summary Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {activeClass.grade} • {activeClass.subject}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activeClass.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAddStudentModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
              <button
                onClick={() => setAssignTaskModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Assign Lesson / Quiz</span>
              </button>
            </div>
          </div>

          {/* Student Performance Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Student Performance Roster ({activeClass.students.length})</span>
              </h3>
            </div>

            {activeClass.students.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No students enrolled in this class yet. Click "Add Student" above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 font-semibold">Student Name</th>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">Lessons Completed</th>
                      <th className="p-3 font-semibold">Average Quiz Score</th>
                      <th className="p-3 font-semibold">Flagged Weak Spots</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {activeClass.students.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{st.name}</td>
                        <td className="p-3 text-slate-500">{st.email}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 font-mono">
                          {st.lessonsCompleted}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              st.averageScore >= 80
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : st.averageScore >= 65
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {st.averageScore}%
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {st.flaggedTopics.length > 0 ? (
                              st.flaggedTopics.map((tp, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200"
                                >
                                  {tp}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-medium">None</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              st.status === 'excelling'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950'
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Class Assignments */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Assigned Lessons & Quizzes ({activeClass.assignments.length})</span>
            </h3>

            {activeClass.assignments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No active assignments for this class yet.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeClass.assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                        {asg.type}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">Due: {asg.dueDate}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{asg.title}</div>
                    <div className="text-slate-500">
                      {asg.subject} • {asg.topic}
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-400">
                      Submissions: {asg.submissionCount}/{asg.totalStudents} completed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {createClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Class</h3>
              <button onClick={() => setCreateClassModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Class Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SS3 Science Alpha, JSS2 Gold..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Grade / Level
                </label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Primary School">Primary School</option>
                  <option value="Junior Secondary 1-3">Junior Secondary (JSS 1-3)</option>
                  <option value="Senior Secondary 1-3">Senior Secondary (SSS 1-3)</option>
                  <option value="University Undergraduate">University Undergraduate</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Primary Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, English, Sciences"
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {addStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Student to {activeClass?.name}
              </h3>
              <button onClick={() => setAddStudentModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Danjuma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. zainab.d@school.edu.ng"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {assignTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Assign Work to {activeClass?.name}
              </h3>
              <button onClick={() => setAssignTaskModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WAEC Prep: Quadratic Equations Mastery"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Lesson">Interactive Lesson</option>
                    <option value="Quiz">Timed Quiz</option>
                    <option value="Practice">Practice Drill</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
