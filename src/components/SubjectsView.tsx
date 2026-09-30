import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  Plus,
  Play,
  Award,
  Brain,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Subject, Topic } from '../types';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, addTopicToSubject, selectTopicAndLaunch, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTabSubject, setActiveTabSubject] = useState<string>(subjects[0]?.id || 'math');

  // Modal for adding a new custom subject
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<'Mathematics' | 'Languages' | 'Sciences' | 'Social Sciences' | 'Custom'>('Custom');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [initialTopicName, setInitialTopicName] = useState('');

  // Categories list
  const categories = ['All', 'Mathematics', 'Languages', 'Sciences', 'Custom'];

  // Filter subjects
  const filteredSubjects = subjects.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topics.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentSubjectObj = subjects.find((s) => s.id === activeTabSubject) || filteredSubjects[0] || subjects[0];

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSubData: Omit<Subject, 'id'> = {
      name: newSubjectName.trim(),
      category: newSubjectCategory,
      description: newSubjectDescription.trim() || 'Comprehensive subject curriculum.',
      iconName: 'BookOpen',
      accentColor: 'from-blue-600 to-indigo-700',
      topics: initialTopicName.trim()
        ? [
            {
              id: `top_${Date.now()}`,
              subjectId: '',
              name: initialTopicName.trim(),
              description: 'Introductory module and foundational concepts.',
              difficulty: 'Medium',
              estimatedMinutes: 30,
              subtopics: ['Core Concepts', 'Step-by-step Examples', 'Mastery Quiz'],
            },
          ]
        : [
            {
              id: `top_${Date.now()}`,
              subjectId: '',
              name: 'Foundations & Core Principles',
              description: 'Introductory module and foundational concepts.',
              difficulty: 'Easy',
              estimatedMinutes: 20,
              subtopics: ['Definitions', 'Key Rules', 'Practice Drills'],
            },
          ],
    };

    addSubject(newSubData);
    setAddSubjectModalOpen(false);
    setNewSubjectName('');
    setNewSubjectDescription('');
    setInitialTopicName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Curriculum & Subjects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore comprehensive syllabi aligned with primary, secondary, WAEC, NECO, and JAMB standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddSubjectModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Subject</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or topics..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Subjects Display */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Subject Switcher List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Subject ({filteredSubjects.length})
          </div>

          <div className="space-y-2">
            {filteredSubjects.map((sub) => {
              const isSelected = sub.id === currentSubjectObj?.id;
              const completedCount = sub.topics.filter((t) =>
                currentUser.completedLessonIds.includes(t.id)
              ).length;

              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveTabSubject(sub.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {sub.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {sub.topics.length} topics • {completedCount} completed
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Topic Details Grid */}
        <div className="lg:col-span-8">
          {currentSubjectObj ? (
            <div className="space-y-6">
              {/* Header card for the current subject */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {currentSubjectObj.category} Curriculum
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {currentSubjectObj.name}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                      {currentSubjectObj.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (currentSubjectObj.topics[0]) {
                        selectTopicAndLaunch(currentSubjectObj.id, currentSubjectObj.topics[0].id, 'aitutor');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Ask AI About {currentSubjectObj.name}</span>
                  </button>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Available Topics & Lessons ({currentSubjectObj.topics.length})
                </div>

                <div className="grid gap-3">
                  {currentSubjectObj.topics.map((topic, idx) => {
                    const isCompleted = currentUser.completedLessonIds.includes(topic.id);
                    const isWeak = currentUser.weakTopics.includes(topic.name);

                    return (
                      <div
                        key={topic.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1.5 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {topic.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                topic.difficulty === 'Easy'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : topic.difficulty === 'Medium'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {topic.difficulty}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Mastered
                              </span>
                            )}
                            {isWeak && (
                              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                                Needs Practice
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {topic.description}
                          </p>

                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {topic.subtopics.map((st, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                  {st}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => selectTopicAndLaunch(currentSubjectObj.id, topic.id, 'lesson')}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                            title="Start step-by-step interactive lesson"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Lesson</span>
                          </button>

                          <button
                            onClick={() => selectTopicAndLaunch(currentSubjectObj.id, topic.id, 'quiz')}
                            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                            title="Take timed quiz on this topic"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Quiz</span>
                          </button>

                          <button
                            onClick={() => selectTopicAndLaunch(currentSubjectObj.id, topic.id, 'aitutor')}
                            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-xs"
                            title="Chat with AI about this topic"
                          >
                            <Brain className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              No subjects found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Subject Modal */}
      {addSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add Custom Subject or Course</span>
              </h3>
              <button
                onClick={() => setAddSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Economics, Further Mathematics, French..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newSubjectCategory}
                  onChange={(e) => setNewSubjectCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Languages">Languages</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Custom">Custom / General</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of what this subject covers..."
                  value={newSubjectDescription}
                  onChange={(e) => setNewSubjectDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Topic Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Demand and Supply, Intro to Thermodynamics..."
                  value={initialTopicName}
                  onChange={(e) => setInitialTopicName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
