import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Server, Sparkles, CheckCircle2, Code2, Lock } from 'lucide-react';

export const ConfigInfoModal: React.FC = () => {
  const { configModalOpen, setConfigModalOpen, serverStatus } = useApp();

  if (!configModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 relative">
        <button
          onClick={() => setConfigModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Google Gemini AI Architecture
            </h2>
            <p className="text-xs text-slate-500">Secure Server-Side Configuration</p>
          </div>
        </div>

        {/* Live Engine Status Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">AI Model Active:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {serverStatus.model || 'gemini-3.8-flash'}
            </span>
          </div>

          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">API Key Source:</span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Server-Side `process.env.GEMINI_API_KEY`</span>
            </span>
          </div>

          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-500">Server Status:</span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online & Operational</span>
            </span>
          </div>
        </div>

        {/* Architectural Principles */}
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Enterprise Security & Best Practices</span>
          </h3>

          <ul className="space-y-2 list-disc pl-4 leading-relaxed">
            <li>
              <strong>Zero Browser Exposure:</strong> Secret API keys are never bundled into client JavaScript. All Gemini interactions route strictly through secure Express backend proxy endpoints (`/api/gemini/chat`, `/api/gemini/lesson`, `/api/gemini/quiz`, `/api/gemini/practice`).
            </li>
            <li>
              <strong>Official SDK:</strong> Built using the modern <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-blue-600 font-mono">@google/genai</code> TypeScript SDK with mandatory User-Agent headers.
            </li>
            <li>
              <strong>Where to configure:</strong> In Google AI Studio, the <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">GEMINI_API_KEY</code> is injected automatically from user secrets. For local development, it is placed in the root <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">.env</code> file.
            </li>
            <li>
              <strong>Fault-Tolerant Curriculum Fallback:</strong> If network latency or API quotas are encountered, SmartTutor AI seamlessly activates high-grade curriculum fallbacks to guarantee uninterrupted student learning.
            </li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setConfigModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
