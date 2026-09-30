import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  Brain,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizSet, QuizQuestion } from '../types';
import { generateQuiz } from '../services/api';
import { SAMPLE_DEFAULT_QUIZ } from '../data/curriculum';

export const QuizView: React.FC = () => {
  const {
    activeSubject,
    activeTopic,
    currentUser,
    recordQuizAttempt,
    setCurrentView,
    selectTopicAndLaunch,
  } = useApp();

  const [quiz, setQuiz] = useState<QuizSet>(SAMPLE_DEFAULT_QUIZ);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [id: number]: string | number }>({});
  const [showHint, setShowHint] = useState<{ [id: number]: boolean }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 mins
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Result metrics
  const [scorePercentage, setScorePercentage] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Generate or reset quiz
  const startNewQuiz = async () => {
    setLoading(true);
    try {
      const generated = await generateQuiz({
        subject: activeSubject.name,
        topic: activeTopic.name,
        difficulty,
        count: questionCount,
        examType: currentUser.targetExam,
      });

      setQuiz(generated);
      setCurrentIndex(0);
      setUserAnswers({});
      setShowHint({});
      setQuizFinished(false);
      const totalSeconds = (generated.timeLimitMinutes || 10) * 60;
      setTimeLeft(totalSeconds);
      setTimeSpent(0);
      setTimerActive(true);
    } catch (err) {
      console.error('Quiz creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startNewQuiz();
  }, [activeTopic.id, difficulty, questionCount]);

  // Countdown timer effect
  useEffect(() => {
    if (!timerActive || quizFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, quizFinished]);

  const finishQuiz = () => {
    setTimerActive(false);

    let correct = 0;
    const weakPoints: string[] = [];

    quiz.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (q.type === 'mcq' || q.type === 'tf') {
        if (Number(ans) === Number(q.correctAnswer)) {
          correct += 1;
        } else {
          weakPoints.push(q.question.slice(0, 40) + '...');
        }
      } else if (q.type === 'short') {
        const cleanUser = String(ans || '').trim().toLowerCase();
        const cleanCorrect = String(q.correctAnswer).trim().toLowerCase();
        if (cleanUser && (cleanCorrect.includes(cleanUser) || cleanUser.includes(cleanCorrect))) {
          correct += 1;
        } else {
          weakPoints.push(q.question.slice(0, 40) + '...');
        }
      }
    });

    const percent = Math.round((correct / Math.max(1, quiz.questions.length)) * 100);
    setCorrectCount(correct);
    setScorePercentage(percent);
    setQuizFinished(true);

    // Confetti on good score
    if (percent >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // fallback
      }
    }

    // Record into global progress & analytics
    const recommendations =
      percent >= 80
        ? [`Outstanding mastery of ${quiz.topic || activeTopic.name}! Ready for advanced problem sets.`]
        : [
            `Review fundamental formulas for ${quiz.topic || activeTopic.name}.`,
            `Take a 5-question practice drill to improve speed.`,
          ];

    recordQuizAttempt({
      title: quiz.title,
      subject: activeSubject.name,
      topic: activeTopic.name,
      scorePercentage: percent,
      correctCount: correct,
      totalCount: quiz.questions.length,
      difficulty,
      examType: currentUser.targetExam,
      timeSpentSeconds: timeSpent,
      weaknessAreas: weakPoints,
      recommendations,
    });
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const currentQ = quiz.questions[currentIndex] || quiz.questions[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Quiz Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>{activeSubject.name}</span>
            <span>•</span>
            <span>{activeTopic.name}</span>
            <span>•</span>
            <span>{currentUser.targetExam !== 'None' ? currentUser.targetExam : 'Standard'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {quiz.title}
          </h1>
        </div>

        {/* Controls: Difficulty, Questions, Timer */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!quizFinished && (
            <div
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 ${
                timeLeft < 60
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            disabled={timerActive && !quizFinished}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            disabled={timerActive && !quizFinished}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={20}>20 Questions</option>
          </select>

          <button
            onClick={startNewQuiz}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
            title="Generate new quiz"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {!quizFinished ? (
        /* Active Quiz Screen */
        <div className="space-y-6">
          {/* Question Palette Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {quiz.questions.map((q, idx) => {
              const isCurrent = currentIndex === idx;
              const isAnswered = userAnswers[q.id] !== undefined;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : isAnswered
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Card */}
          {currentQ && (
            <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Question {currentIndex + 1} of {quiz.questions.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {currentQ.type === 'mcq'
                    ? 'Multiple Choice'
                    : currentQ.type === 'tf'
                    ? 'True / False'
                    : 'Short Answer'}
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </div>

              {/* Options */}
              {currentQ.type === 'mcq' && currentQ.options && (
                <div className="grid gap-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }))
                        }
                        className={`p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'tf' && (
                <div className="grid grid-cols-2 gap-3">
                  {['True', 'False'].map((val, vIdx) => {
                    const isSelected = userAnswers[currentQ.id] === vIdx;
                    return (
                      <button
                        key={val}
                        onClick={() =>
                          setUserAnswers((prev) => ({ ...prev, [currentQ.id]: vIdx }))
                        }
                        className={`p-5 rounded-2xl border text-sm font-bold text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'short' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500">
                    Type your answer or numerical result:
                  </label>
                  <input
                    type="text"
                    value={String(userAnswers[currentQ.id] || '')}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                    }
                    placeholder="e.g. 25, Newton, or key concept..."
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Hint toggle */}
              {currentQ.hint && (
                <div>
                  <button
                    onClick={() =>
                      setShowHint((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                    }
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint[currentQ.id] ? 'Hide Hint' : 'Need a Tutor Hint?'}</span>
                  </button>
                  {showHint[currentQ.id] && (
                    <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                      💡 <strong>Hint:</strong> {currentQ.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={finishQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <span>Submit & Finish Quiz</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Result & Diagnostic Screen */
        <div className="space-y-6 animate-in fade-in">
          {/* Result Highlight Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-sky-700 text-white text-center shadow-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Assessment Completed</span>
            </div>

            <div className="text-5xl sm:text-6xl font-black tracking-tight">
              Your Score: {scorePercentage}%
            </div>

            <p className="text-sm sm:text-base text-blue-100 max-w-md mx-auto">
              You correctly answered <strong className="text-white">{correctCount}</strong> out of{' '}
              <strong className="text-white">{quiz.questions.length}</strong> questions in{' '}
              {Math.floor(timeSpent / 60)}m {timeSpent % 60}s.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={startNewQuiz}
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => selectTopicAndLaunch(activeSubject.id, activeTopic.id, 'aitutor')}
                className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                <span>Review with AI Tutor</span>
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Detailed Question Analysis & Explanations
            </h3>

            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                let isRight = false;

                if (q.type === 'mcq' || q.type === 'tf') {
                  isRight = Number(userAns) === Number(q.correctAnswer);
                } else {
                  const cleanU = String(userAns || '').trim().toLowerCase();
                  const cleanC = String(q.correctAnswer).trim().toLowerCase();
                  isRight = Boolean(cleanU && (cleanC.includes(cleanU) || cleanU.includes(cleanC)));
                }

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-2xl border text-xs sm:text-sm space-y-3 ${
                      isRight
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 ${
                          isRight
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {isRight ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-slate-600 dark:text-slate-300">
                        <strong>Your Answer:</strong>{' '}
                        {q.type === 'mcq' && q.options
                          ? q.options[Number(userAns)] || 'No answer submitted'
                          : q.type === 'tf'
                          ? userAns === 0
                            ? 'True'
                            : userAns === 1
                            ? 'False'
                            : 'No answer'
                          : String(userAns || 'No answer submitted')}
                      </div>

                      {!isRight && (
                        <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          <strong>Correct Answer:</strong>{' '}
                          {q.type === 'mcq' && q.options
                            ? q.options[Number(q.correctAnswer)]
                            : q.type === 'tf'
                            ? Number(q.correctAnswer) === 0
                              ? 'True'
                              : 'False'
                            : String(q.correctAnswer)}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-800/70 p-3 rounded-xl">
                      <strong>AI Tutor Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
