import React from 'react';
import { User, Users, Lock } from 'lucide-react';

export type LoginTab = 'PARENT' | 'TEACHER' | 'ADMIN';

interface LoginTabsProps {
  activeTab: LoginTab;
  setActiveTab: (tab: LoginTab) => void;
  setError: (err: string) => void;
}

export function LoginTabs({ activeTab, setActiveTab, setError }: LoginTabsProps) {
  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
    setError('');
  };

  return (
    <div className="px-5 pt-4 bg-white">
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-[11px] font-bold">
        <button
          onClick={() => handleTabChange('PARENT')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'PARENT' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-500 hover:text-slate-850'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Parent
        </button>
        <button
          onClick={() => handleTabChange('TEACHER')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'TEACHER' ? 'bg-white text-amber-600 shadow-2xs' : 'text-slate-500 hover:text-slate-850'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Enseignant
        </button>
        <button
          onClick={() => handleTabChange('ADMIN')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'ADMIN' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-500 hover:text-slate-850'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Admin
        </button>
      </div>
    </div>
  );
}
