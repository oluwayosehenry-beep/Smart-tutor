import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  Layers,
  ChevronDown,
  Edit3,
  Award,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { PracticeProblem } from '../types';
import { generatePracticeDrill } from '../services/api';

export const PracticeView: React.FC = () => {
  const {
    subjects,
    activeSubject,
    activeTopic,
    setActiveSubject,
    setActiveTopic,
    currentUser,
    setCurrentView,
    selectTopicAndLaunch,
  } = useApp();

  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customCountInput, setCustomCountInput] = useState<string>('');
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: number }>({});
  const [revealedHints, setRevealedHints] = useState<{ [id: number]: boolean }>({});
  const [revealedSolutions, setRevealedSolutions] = useState<{ [id: number]: boolean }>({});

  // Scratchpad toggle and notes
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [scratchpadNote, setScratchpadNote] = useState('');

  const handleGenerateDrill = async () => {
    setLoading(true);
    const count = isCustomCount && Number(customCountInput) > 0 ? Number(customCountInput) : questionCount;

    try {
      const drill = await generatePracticeDrill({
        subject: activeSubject.name,
        topic: activeTopic.name,
        difficulty,
        count: Math.min(25, Math.max(1, count)),
        examType: currentUser.targetExam,
      });

      setPracticeProblems(drill);
      setSelectedAnswers({});
      setRevealedHints({});
      setRevealedSolutions({});
    } catch (err) {
      console.error('Practice generator error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Setup Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Targeted Skill Drills
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              AI Practice Mode
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate unique practice problems with progressive hints, step-by-step reasoning, and scratchpad.
            </p>
          </div>

          <button
            onClick={() => setScratchpadOpen(!scratchpadOpen)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>{scratchpadOpen ? 'Close Scratchpad' : 'Open Scratchpad'}</span>
          </button>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
          {/* Subject */}
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Subject</label>
            <select
              value={activeSubject.id}
              onChange={(e) => {
                const sub = subjects.find((s) => s.id === e.target.value);
                if (sub) {
                  setActiveSubject(sub);
                  setActiveTopic(sub.topics[0]);
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Topic</label>
            <select
              value={activeTopic.id}
              onChange={(e) => {
                const top = activeSubject.topics.find((t) => t.id === e.target.value);
                if (top) setActiveTopic(top);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
            >
              {activeSubject.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Difficulty</label>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700">
              {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-1 text-center rounded-lg font-bold transition-colors ${
                    difficulty === diff
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Questions</label>
            <div className="flex gap-1.5 items-center">
              {[5, 10, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setIsCustomCount(false);
                    setQuestionCount(num);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    !isCustomCount && questionCount === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setIsCustomCount(true)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  isCustomCount
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                }`}
              >
                Custom
              </button>

              {isCustomCount && (
                <input
                  type="number"
                  min={1}
                  max={30}
                  placeholder="#"
                  value={customCountInput}
                  onChange={(e) => setCustomCountInput(e.target.value)}
                  className="w-14 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold"
                />
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateDrill}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'AI Generating Drill...' : 'Generate AI Practice Drill'}</span>
          </button>
        </div>
      </div>

      {/* Floating or Inline Scratchpad */}
      {scratchpadOpen && (
        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-slate-900 border border-amber-200 dark:border-slate-700 shadow-sm space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-400">
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Rough Working & Notes Scratchpad</span>
            </span>
            <button
              onClick={() => setScratchpadNote('')}
              className="text-slate-400 hover:text-rose-500 font-normal"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={4}
            value={scratchpadNote}
            onChange={(e) => setScratchpadNote(e.target.value)}
            placeholder="Jot down formulas, intermediate values, equations (e.g. 2x = 12 => x = 6)..."
            className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          ></textarea>
        </div>
      )}

      {/* Generated Practice Problems Display */}
      {practiceProblems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ready to Practice {activeTopic.name}?
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select your preferred difficulty and number of questions above, then click{' '}
            <strong>"Generate AI Practice Drill"</strong> to receive interactive problems with step-by-step solutions.
          </p>
          <button
            onClick={handleGenerateDrill}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-xs"
          >
            <span>Start Quick 5-Question Drill</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Practice Problems ({practiceProblems.length})
          </div>

          {practiceProblems.map((prob, idx) => {
            const hasChosen = selectedAnswers[prob.id] !== undefined;
            const isCorrect = selectedAnswers[prob.id] === prob.correctIndex;

            return (
              <div
                key={prob.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    Problem #{idx + 1}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                    {difficulty}
                  </span>
                </div>

                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {prob.question}
                </div>

                {/* Multiple choice options if available */}
                {prob.options && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {prob.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[prob.id] === optIdx;
                      let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400';

                      if (hasChosen) {
                        if (optIdx === prob.correctIndex) {
                          btnStyle = 'bg-emerald-500 text-white font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-500 text-white';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={hasChosen}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [prob.id]: optIdx }))
                          }
                          className={`p-3.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Hints and Solution Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {prob.hints && prob.hints.length > 0 && (
                    <button
                      onClick={() =>
                        setRevealedHints((prev) => ({ ...prev, [prob.id]: !prev[prob.id] }))
                      }
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{revealedHints[prob.id] ? 'Hide Hints' : 'View Tutor Hint'}</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setRevealedSolutions((prev) => ({ ...prev, [prob.id]: !prev[prob.id] }))
                    }
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{revealedSolutions[prob.id] ? 'Hide Solution' : 'Reveal Step-by-Step Solution'}</span>
                  </button>

                  <button
                    onClick={() => selectTopicAndLaunch(activeSubject.id, activeTopic.id, 'aitutor')}
                    className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 ml-auto"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Ask Tutor About This</span>
                  </button>
                </div>

                {/* Revealed Hint Box */}
                {revealedHints[prob.id] && prob.hints && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <div className="font-bold flex items-center gap-1">💡 Hints:</div>
                    {prob.hints.map((h, hIdx) => (
                      <div key={hIdx}>• {h}</div>
                    ))}
                  </div>
                )}

                {/* Revealed Solution Box */}
                {revealedSolutions[prob.id] && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Step-by-Step Worked Solution:
                    </div>
                    <ul className="space-y-1 font-mono text-slate-700 dark:text-slate-300">
                      {prob.stepByStepSolution.map((st, sIdx) => (
                        <li key={sIdx} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {st}
                        </li>
                      ))}
                    </ul>
                    {prob.keyTakeaway && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-sans font-medium">
                        <strong>Takeaway:</strong> {prob.keyTakeaway}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
