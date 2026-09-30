import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Lightbulb,
  Award,
  HelpCircle,
  RotateCcw,
  Target,
  FileText,
  Brain,
  Layers,
} from 'lucide-react';
import { InteractiveLesson } from '../types';
import { generateInteractiveLesson } from '../services/api';
import { SAMPLE_DEFAULT_LESSON } from '../data/curriculum';

export const InteractiveLessonView: React.FC = () => {
  const {
    activeSubject,
    activeTopic,
    currentUser,
    markLessonCompleted,
    addStudyMinutes,
    setCurrentView,
  } = useApp();

  const [lesson, setLesson] = useState<InteractiveLesson>(SAMPLE_DEFAULT_LESSON);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Checkpoint question state
  const [selectedCheckpointAnswer, setSelectedCheckpointAnswer] = useState<number | null>(null);
  const [showCheckpointFeedback, setShowCheckpointFeedback] = useState(false);
  const [showCheckpointHint, setShowCheckpointHint] = useState(false);

  // Short quiz state inside lesson
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Exercise solution toggles
  const [revealedSolutions, setRevealedSolutions] = useState<{ [key: number]: boolean }>({});

  const steps = [
    { id: 'objectives', title: '1. Learning Objectives', icon: Target },
    { id: 'intro', title: '2. Introduction & Hook', icon: Sparkles },
    { id: 'explanation', title: '3. Core Explanation', icon: BookOpen },
    { id: 'examples', title: '4. Worked Examples', icon: Layers },
    { id: 'interactive', title: '5. Interactive Checkpoint', icon: HelpCircle },
    { id: 'practice', title: '6. Practice Exercises', icon: FileText },
    { id: 'quiz', title: '7. Mastery Check', icon: Award },
    { id: 'summary', title: '8. Key Summary', icon: CheckCircle2 },
    { id: 'homework', title: '9. Homework Challenge', icon: Brain },
  ];

  // Load or generate lesson when topic changes
  const loadLesson = async () => {
    setLoading(true);
    try {
      const generated = await generateInteractiveLesson({
        subject: activeSubject.name,
        topic: activeTopic.name,
        studentLevel: currentUser.level,
        examType: currentUser.targetExam,
      });
      setLesson(generated);
      setCurrentStepIndex(0);
      setSelectedCheckpointAnswer(null);
      setShowCheckpointFeedback(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setRevealedSolutions({});
    } catch (err) {
      console.error('Failed to load lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
  }, [activeTopic.id]);

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete lesson
      markLessonCompleted(activeTopic.id);
      addStudyMinutes(15);
      alert(`🎉 Congratulations! You have completed the structured lesson on "${lesson.title}". Your progress has been updated!`);
      setCurrentView('dashboard');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>{lesson.subject}</span>
            <span>•</span>
            <span>{lesson.level}</span>
            <span>•</span>
            <span className="text-slate-400">~{lesson.estimatedMinutes} mins</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {lesson.title}
          </h1>
        </div>

        <button
          onClick={loadLesson}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold flex items-center gap-2 border border-blue-200 dark:border-blue-900 transition-colors shrink-0"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate with AI</span>
        </button>
      </div>

      {/* Stepper Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((st, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isPassed = currentStepIndex > idx;
          return (
            <button
              key={st.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isPassed
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{st.title}</span>
              {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          );
        })}
      </div>

      {/* Main Step Content Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
        {/* Step 1: Objectives */}
        {currentStepIndex === 0 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">What You Will Learn</h2>
                <p className="text-xs text-slate-500">Key competencies for this session</p>
              </div>
            </div>

            <div className="space-y-3">
              {lesson.objectives.map((obj, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-700 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Introduction */}
        {currentStepIndex === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Real-World Hook</h2>
                <p className="text-xs text-slate-500">Why does this topic matter?</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-slate-900/80 dark:to-slate-900/80 border border-amber-200/60 dark:border-slate-700 space-y-4">
              <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {lesson.introduction}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Explanation */}
        {currentStepIndex === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Core Concept Breakdown</h2>
                <p className="text-xs text-slate-500">Master the fundamental principles</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-4">
              {lesson.explanation}
            </div>
          </div>
        )}

        {/* Step 4: Worked Examples */}
        {currentStepIndex === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Worked Step-by-Step Examples</h2>
                <p className="text-xs text-slate-500">See the reasoning in action</p>
              </div>
            </div>

            <div className="space-y-6">
              {lesson.workedExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4"
                >
                  <div className="font-bold text-base text-blue-700 dark:text-blue-300">
                    Example #{idx + 1}: {ex.problem}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solution Steps:</div>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 font-mono">
                      {ex.stepByStepSolution.map((st, sIdx) => (
                        <li key={sIdx} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                    💡 <strong>Key Takeaway:</strong> {ex.keyTakeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Interactive Question Checkpoint */}
        {currentStepIndex === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Comprehension Checkpoint</h2>
                <p className="text-xs text-slate-500">Test if you understood before moving forward</p>
              </div>
            </div>

            {lesson.interactiveQuestions && lesson.interactiveQuestions.length > 0 ? (
              <div className="space-y-4">
                {lesson.interactiveQuestions.map((iq, qIdx) => {
                  const isAnswered = selectedCheckpointAnswer !== null;
                  const isCorrect = selectedCheckpointAnswer === iq.answerIndex;

                  return (
                    <div key={qIdx} className="space-y-4">
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        {iq.question}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {iq.options.map((opt, optIdx) => {
                          const isThisSelected = selectedCheckpointAnswer === optIdx;
                          let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400';

                          if (showCheckpointFeedback) {
                            if (optIdx === iq.answerIndex) {
                              btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                            } else if (isThisSelected) {
                              btnStyle = 'bg-rose-500 text-white border-rose-600';
                            }
                          } else if (isThisSelected) {
                            btnStyle = 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={showCheckpointFeedback}
                              onClick={() => setSelectedCheckpointAnswer(optIdx)}
                              className={`p-4 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Hint & Check Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => setShowCheckpointHint(!showCheckpointHint)}
                          className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1"
                        >
                          <Lightbulb className="w-4 h-4" />
                          <span>{showCheckpointHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                        </button>

                        {!showCheckpointFeedback && (
                          <button
                            disabled={selectedCheckpointAnswer === null}
                            onClick={() => setShowCheckpointFeedback(true)}
                            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                          >
                            Check Answer
                          </button>
                        )}
                      </div>

                      {showCheckpointHint && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                          💡 <strong>Hint:</strong> {iq.hint}
                        </div>
                      )}

                      {showCheckpointFeedback && (
                        <div
                          className={`p-4 rounded-xl text-xs space-y-1 ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            {isCorrect ? '✓ Spot on! Great job.' : '✗ Not quite right, but that is how we learn!'}
                          </div>
                          <p>{iq.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}

        {/* Step 6: Practice Exercises */}
        {currentStepIndex === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Guided Practice Exercises</h2>
                <p className="text-xs text-slate-500">Try solving these on your own first</p>
              </div>
            </div>

            <div className="space-y-4">
              {lesson.practiceExercises.map((pex, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Exercise #{idx + 1}: {pex.exercise}
                  </div>

                  <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900">
                    💡 <strong>Hint:</strong> {pex.hint}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {revealedSolutions[idx] ? 'Hide Solution' : 'Reveal Worked Solution'}
                    </button>

                    {revealedSolutions[idx] && (
                      <div className="mt-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-mono">
                        {pex.solution}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Short Quiz */}
        {currentStepIndex === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Short Lesson Quiz</h2>
                <p className="text-xs text-slate-500">Quick 3-question mastery check</p>
              </div>
            </div>

            <div className="space-y-6">
              {lesson.shortQuiz.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {qIdx + 1}. {q.question}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = quizAnswers[qIdx] === optIdx;
                      let btnClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnClass = 'bg-emerald-500 text-white font-bold';
                        } else if (isChosen) {
                          btnClass = 'bg-rose-500 text-white';
                        }
                      } else if (isChosen) {
                        btnClass = 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted && (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Submit Quiz & See Scores
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 8: Summary */}
        {currentStepIndex === 7 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Session Summary</h2>
                <p className="text-xs text-slate-500">Core principles to commit to memory</p>
              </div>
            </div>

            <div className="space-y-3">
              {lesson.summary.map((sum, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{sum}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 9: Homework */}
        {currentStepIndex === 8 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Homework & Extension Tasks</h2>
                <p className="text-xs text-slate-500">Solidify your knowledge beyond today’s session</p>
              </div>
            </div>

            <div className="space-y-4">
              {lesson.homework.map((hw, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Task #{idx + 1}: {hw.task}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    💡 Guidance: {hw.guidance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Step Controller */}
        <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </span>

          <button
            onClick={handleNextStep}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finish Lesson & Save' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
