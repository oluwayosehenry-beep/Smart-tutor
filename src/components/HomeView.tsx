import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Brain,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Compass,
  MessageSquare,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { NIGERIAN_EXAMS_DATA } from '../data/curriculum';

export const HomeView: React.FC = () => {
  const { setCurrentView, subjects, selectTopicAndLaunch, currentUser, setConfigModalOpen } = useApp();

  const handleStartLearning = () => {
    setCurrentView('dashboard');
  };

  const handleTryAiTutor = () => {
    setCurrentView('aitutor');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-indigo-500/15 to-purple-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                <span>Next-Gen Adaptive Learning • Powered by Google Gemini</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                  AI Tutor
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 font-medium">
                Learn smarter. Understand faster. Achieve more.
              </p>

              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                SmartTutor AI breaks down difficult mathematics, sciences, and humanities into bite-sized, step-by-step
                clarity. Ask any question, test your knowledge with interactive quizzes, and master WAEC, NECO, JAMB,
                and school exams with a tutor that never loses patience.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleStartLearning}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 flex items-center gap-2 group transition-all hover:-translate-y-0.5"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleTryAiTutor}
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Try AI Tutor</span>
                </button>
              </div>

              {/* Trust & Metric highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">98%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Concept Retention</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">WAEC & JAMB</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Aligned Syllabi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Step-by-Step AI</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Tutor Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden p-5 space-y-4">
                {/* Header preview */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      AI
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">SmartTutor AI Assistant</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online • Patient & Step-by-Step
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {currentUser.level}
                  </span>
                </div>

                {/* Simulated Chat Dialogue */}
                <div className="space-y-3 text-xs">
                  {/* Student query */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2.5 max-w-[85%] shadow-xs">
                      Explain quadratic equations to me. I keep getting confused by factorisation!
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      T
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs p-3 space-y-2 max-w-[90%] leading-relaxed shadow-xs">
                      <p className="font-semibold text-blue-700 dark:text-blue-300">
                        Don't worry at all! Let's break it down into 3 simple steps:
                      </p>
                      <p>
                        A quadratic equation is just an equation with an <span className="font-mono bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300">x²</span> term:
                        <br />
                        <strong className="block my-1 text-center font-mono text-xs">ax² + bx + c = 0</strong>
                      </p>
                      <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600">
                        <span className="font-bold text-amber-600 dark:text-amber-400">💡 Mini-Question for you:</span>
                        <p className="mt-0.5">In <span className="font-mono font-semibold">x² - 5x + 6 = 0</span>, what are two numbers that multiply to give 6 and add up to -5?</p>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            selectTopicAndLaunch('math', 'math-algebra', 'aitutor');
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded font-medium text-[11px] hover:bg-blue-700"
                        >
                          Answer Tutor (-2 & -3)
                        </button>
                        <button
                          onClick={() => {
                            selectTopicAndLaunch('math', 'math-algebra', 'lesson');
                          }}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded font-medium text-[11px]"
                        >
                          View Full Lesson
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick features banner */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>No Embarrassment</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Instant Hints</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Award className="w-3 h-3 text-blue-500" />
                    <span>Timed Quizzes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Curriculum Core
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore Popular Subjects
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('subjects')}
            className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5"
          >
            <span>Browse All Subjects & Topics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {subjects.slice(0, 5).map((subject) => {
            return (
              <div
                key={subject.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {subject.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Popular Topics:
                    </div>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      {subject.topics.slice(0, 3).map((t) => (
                        <li key={t.id} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>{t.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {subject.topics.length} topics
                  </span>
                  <button
                    onClick={() => selectTopicAndLaunch(subject.id, subject.topics[0]?.id, 'lesson')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Learn</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How the AI Tutor Works */}
      <section className="bg-slate-100/70 dark:bg-slate-800/40 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
              The Pedagogical Method
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How SmartTutor AI Works
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
              Unlike generic chatbots that simply vomit the final answer, SmartTutor AI teaches the reasoning behind every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Ask Anything or Pick a Topic',
                desc: 'Type any homework question, upload an equation, or select from official syllabus topics.',
                icon: MessageSquare,
                color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950',
              },
              {
                step: '02',
                title: 'Step-by-Step Scaffolding',
                desc: 'The AI breaks down complex problems into manageable steps, checking your understanding at each junction.',
                icon: Compass,
                color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950',
              },
              {
                step: '03',
                title: 'Socratic Hints & Checks',
                desc: 'Stuck? The tutor offers progressive hints rather than spoilers, guiding your brain to the "aha!" moment.',
                icon: HelpCircle,
                color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950',
              },
              {
                step: '04',
                title: 'Adaptive Quizzes & Progress',
                desc: 'Take timed practice quizzes that identify your exact weak spots and adapt future lessons to match.',
                icon: TrendingUp,
                color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="rounded-2xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-xs relative"
                >
                  <div className="text-4xl font-black text-slate-200 dark:text-slate-700 mb-4 select-none">
                    {card.step}
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nigerian Curriculum & Exam Prep Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-wide uppercase">
                National Curriculum & Standardized Exams
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Preparing for WAEC, NECO, JAMB, or Common Entrance?
              </h2>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                SmartTutor AI aligns directly with official curricula across West Africa. Practice with past-paper
                question formats, simulated computer-based tests (CBT), and step-by-step theory grading that mirrors
                official examiner mark schemes.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {NIGERIAN_EXAMS_DATA.map((exam) => (
                  <div
                    key={exam.code}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center"
                  >
                    <div className="text-base font-extrabold text-blue-200">{exam.code}</div>
                    <div className="text-[10px] text-slate-300 truncate">{exam.fullName.split('(')[0]}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentView('nigerian-exams')}
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/30"
                >
                  Enter Exam Prep Center
                </button>
                <button
                  onClick={() => selectTopicAndLaunch('math', 'math-algebra', 'practice')}
                  className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20"
                >
                  Launch Timed CBT Mock Drill
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold">
                  CBT
                </div>
                <div>
                  <div className="text-sm font-bold text-white">JAMB UTME Simulation</div>
                  <div className="text-xs text-slate-300">Timed 40-question drills</div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real countdown timer pacing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Use of English + STEM subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant breakdown of weak areas</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 italic pt-2 border-t border-white/10">
                Practice questions are generated to mirror the style and syllabus of WAEC/NECO/JAMB examinations for practice purposes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Loved By Learners & Educators
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Student Success Stories
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Real outcomes from students who transformed confusion into confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Folashade Adeyemi',
              role: 'SS3 Student, Lagos',
              exam: 'WAEC & JAMB Aspirant',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
              quote:
                'I used to dread Physics Mechanics and Chemistry Organic reactions. SmartTutor AI explains things so patiently. In my last mock, my score jumped from 54% to 88%!',
              rating: 5,
            },
            {
              name: 'David Nwankwo',
              role: 'Undergraduate, Computer Science',
              exam: 'University Calculus',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
              quote:
                'The step-by-step breakdown on differentiation and matrix algebra is better than lectures. The fact that I can ask "explain this simpler" whenever I get lost is a game-changer.',
              rating: 5,
            },
            {
              name: 'Fatima Ibrahim',
              role: 'JSS 3 Student, Abuja',
              exam: 'Basic Education Certificate',
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              quote:
                'SmartTutor makes mathematics feel like a fun game. The voice feature lets me talk to the AI tutor just like a private home lesson teacher who never gets tired!',
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-slate-100 dark:border-slate-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.role}</div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{item.exam}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  S
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">SmartTutor AI</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4">
                Empowering every student with an intelligent, patient, and personalized AI tutor. Step-by-step learning,
                interactive quizzes, and comprehensive exam preparation.
              </p>
              <div className="text-[11px] text-slate-400">
                © {new Date().getFullYear()} SmartTutor AI. All rights reserved.
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
                Features
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('aitutor')} className="hover:text-blue-600">
                    AI Chat Tutor
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('lesson')} className="hover:text-blue-600">
                    Interactive Teaching Mode
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('practice')} className="hover:text-blue-600">
                    Timed Quiz Generator
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('schedule')} className="hover:text-blue-600">
                    Study Schedule & Reminders
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('progress')} className="hover:text-blue-600">
                    Progress Analytics
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
                Exam Syllabi
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('nigerian-exams')} className="hover:text-blue-600">
                    WAEC (WASSCE) Prep
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('nigerian-exams')} className="hover:text-blue-600">
                    JAMB UTME CBT Drills
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('nigerian-exams')} className="hover:text-blue-600">
                    NECO SSCE Practice
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('nigerian-exams')} className="hover:text-blue-600">
                    National Common Entrance
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
                Platform & Contact
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('teacher')} className="hover:text-blue-600">
                    Teacher Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => setConfigModalOpen(true)} className="hover:text-blue-600">
                    Gemini AI Config
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">support@smarttutor.ai</span>
                </li>
                <li>
                  <span className="text-slate-400">+234 (0) 800-SMART-AI</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>
              Disclaimer: SmartTutor AI provides simulated practice and explanatory tutoring. Questions are aligned to examination syllabi for educational purposes and do not represent leaked or live official examination papers.
            </p>
            <div className="flex gap-4 shrink-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
