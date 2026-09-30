import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Save, GraduationCap, Target, Image as ImageIcon } from 'lucide-react';
import { StudentLevel, ExamType } from '../types';

export const ProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen, currentUser, setCurrentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [level, setLevel] = useState<StudentLevel>(currentUser.level);
  const [targetExam, setTargetExam] = useState<ExamType>(currentUser.targetExam);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  if (!profileModalOpen) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      level,
      targetExam,
      avatar,
    }));
    setProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 relative">
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Student Profile & Preferences
          </h2>
          <p className="text-xs text-slate-500">Customize your avatar, target exam, and learning level.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Avatar selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Choose Avatar
            </label>
            <div className="flex items-center gap-3">
              {sampleAvatars.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`relative rounded-full transition-transform ${
                    avatar === url ? 'ring-4 ring-blue-600 scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar option" className="w-11 h-11 rounded-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Primary School">Primary School</option>
                <option value="Junior Secondary School">Junior Secondary</option>
                <option value="Senior Secondary School">Senior Secondary</option>
                <option value="University">University</option>
                <option value="Professional/Adult Learning">Adult / Professional</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="WAEC">WAEC</option>
                <option value="JAMB">JAMB</option>
                <option value="NECO">NECO</option>
                <option value="Common Entrance">Common Entrance</option>
                <option value="University Entrance">University Entrance</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
