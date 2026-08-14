import React from 'react';
import { Home, Calendar, Users, Settings } from 'lucide-react';

interface TeacherSidebarProps {
  activeTab: 'ACCUEIL' | 'SCHEDULE' | 'CLASSES' | 'PARAMETRES';
  selectedCourseId: string | null;
  onNavigate: (tab: 'ACCUEIL' | 'SCHEDULE' | 'CLASSES' | 'PARAMETRES') => void;
}

export function TeacherSidebar({ activeTab, selectedCourseId, onNavigate }: TeacherSidebarProps) {
  const tabs = [
    { id: 'ACCUEIL', label: 'Accueil', icon: Home, color: 'text-amber-500' },
    { id: 'SCHEDULE', label: 'Emploi du temps', icon: Calendar, color: 'text-sky-500' },
    { id: 'CLASSES', label: 'Mes classes', icon: Users, color: 'text-emerald-500' },
    { id: 'PARAMETRES', label: 'Paramètres', icon: Settings, color: 'text-slate-500' },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-1.5 h-fit sticky top-24 text-xs">
      <div className="px-3 mb-2">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Mon Espace Enseignant</p>
      </div>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id && !selectedCourseId;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tab.color}`} />
            <span className="text-xs font-bold">{tab.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
