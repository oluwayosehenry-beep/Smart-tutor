import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Mic,
  MicOff,
  Trash2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  ListOrdered,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';

export const AiTutorView: React.FC = () => {
  const {
    activeSubject,
    activeTopic,
    subjects,
    setActiveSubject,
    setActiveTopic,
    currentUser,
    selectTopicAndLaunch,
    addStudyMinutes,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`smarttutor_chat_${activeTopic.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }

    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: `Hello ${currentUser.name}! I am your SmartTutor AI teacher for **${activeSubject.name}**.\n\nWe are currently focusing on **${activeTopic.name}** at the **${currentUser.level}** level.\n\nHow can I help you today? You can ask me to explain a concept step-by-step, request a real-world example, or ask for a practice problem to test your understanding!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Explain quadratic equations from scratch',
          'Give me a real-world example of this',
          'Ask me a question to test my understanding',
          'Give me a step-by-step formula breakdown',
        ],
      },
    ];
  });

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem(`smarttutor_chat_${activeTopic.id}`, JSON.stringify(messages));
  }, [messages, activeTopic.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognizer.onerror = () => {
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic error:', err);
      }
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown symbols for cleaner speech
    const clean = text.replace(/[*_#`$]/g, '').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string, actionType?: 'normal' | 'simpler' | 'example' | 'quiz' | 'hint' | 'step-by-step') => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() && !actionType) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend || (actionType === 'simpler' ? 'Can you explain this simpler?' : actionType === 'example' ? 'Give me a real-world example.' : 'Can you give me a quiz?'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        messages: [...messages, userMsg],
        studentLevel: currentUser.level,
        subject: activeSubject.name,
        topic: activeTopic.name,
        examMode: currentUser.targetExam,
        actionType: actionType || 'normal',
      });

      const tutorMsg: ChatMessage = {
        id: `tutor_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      addStudyMinutes(3);
    } catch (err) {
      console.error('Chat tutor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear this chat conversation?')) {
      const freshMessage: ChatMessage = {
        id: `fresh_${Date.now()}`,
        sender: 'assistant',
        text: `Fresh slate! What would you like to explore next in **${activeTopic.name}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([freshMessage]);
      localStorage.removeItem(`smarttutor_chat_${activeTopic.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Bar: Subject & Topic Context Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Subject:</span>
            <select
              value={activeSubject.id}
              onChange={(e) => {
                const sub = subjects.find((s) => s.id === e.target.value);
                if (sub) {
                  setActiveSubject(sub);
                  setActiveTopic(sub.topics[0]);
                }
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Topic:</span>
            <select
              value={activeTopic.id}
              onChange={(e) => {
                const top = activeSubject.topics.find((t) => t.id === e.target.value);
                if (top) setActiveTopic(top);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
            >
              {activeSubject.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {currentUser.level}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => selectTopicAndLaunch(activeSubject.id, activeTopic.id, 'lesson')}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Lesson</span>
          </button>
          <button
            onClick={() => selectTopicAndLaunch(activeSubject.id, activeTopic.id, 'quiz')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topic Quiz</span>
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Chat Stream (Left 9 columns) */}
        <div className="lg:col-span-8 flex flex-col h-[650px] rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Chat Messages Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs mt-1">
                      AI
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[85%] sm:max-w-[80%]`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      {/* Markdown-style clean rendering */}
                      <div className="whitespace-pre-line space-y-2">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => {
                          return (
                            <p key={pIdx}>
                              {paragraph.split('**').map((chunk, cIdx) => {
                                if (cIdx % 2 === 1) {
                                  return (
                                    <strong
                                      key={cIdx}
                                      className={isUser ? 'font-bold underline' : 'font-bold text-blue-700 dark:text-blue-300'}
                                    >
                                      {chunk}
                                    </strong>
                                  );
                                }
                                return chunk;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* Suggestions pills if provided */}
                      {msg.suggestions && (
                        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-600 flex flex-wrap gap-1.5">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 text-xs font-medium hover:bg-blue-50 border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <>
                          <button
                            onClick={() => speakText(msg.text)}
                            className="hover:text-blue-600 transition-colors flex items-center gap-0.5"
                            title="Read response aloud"
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3 text-blue-600 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                            <span>Read</span>
                          </button>
                          {msg.source && (
                            <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-200 dark:bg-slate-700 rounded text-slate-500">
                              {msg.source === 'gemini' ? 'Gemini 3.8' : 'Curriculum Engine'}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                  AI
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Thinking step-by-step and preparing explanation...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pedagogy Buttons */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => handleSendMessage(undefined, 'simpler')}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Explain Simpler</span>
            </button>

            <button
              onClick={() => handleSendMessage(undefined, 'example')}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Give Me an Example</span>
            </button>

            <button
              onClick={() => handleSendMessage(undefined, 'step-by-step')}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
              <span>Step-by-Step Breakdown</span>
            </button>

            <button
              onClick={() => handleSendMessage(undefined, 'hint')}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
              <span>Give Me a Hint</span>
            </button>

            <button
              onClick={() => handleSendMessage(undefined, 'quiz')}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Test My Understanding</span>
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-3 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak question via microphone'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask SmartTutor anything about ${activeTopic.name}...`}
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Reference Drawer (3 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Topic Learning Sheet */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Topic Cheat-Sheet
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                {activeTopic.difficulty}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeTopic.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{activeTopic.description}</p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Key Formulas & Points:
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <div>• Quadratic: ax² + bx + c = 0</div>
                <div>• Formula: x = (-b ± √(b² - 4ac)) / (2a)</div>
                <div>• Discriminant: Δ = b² - 4ac</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => selectTopicAndLaunch(activeSubject.id, activeTopic.id, 'lesson')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full 9-Step Lesson</span>
              </button>
            </div>
          </div>

          {/* Pedagogical Rules & Ethics Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>SmartTutor AI Principles</span>
            </h4>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
              <li>Always explains the "why", not just the "what".</li>
              <li>Welcomes repeated questions without frustration.</li>
              <li>Guides you through errors with positive nudges.</li>
              <li>Tailored for Nigerian & International examinations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
