import React from 'react';
import { UserPlus, GraduationCap, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface ShortcutsProps {
  onNavigateToTab: (tab: string) => void;
}

export const AdminShortcutsList: React.FC<ShortcutsProps> = ({ onNavigateToTab }) => {
  const shortcuts = [
    { label: 'Inscrire un nouvel élève', icon: UserPlus, color: 'text-sky-500 bg-sky-50', tab: 'UTILISATEURS' },
    { label: 'Ajouter un enseignant', icon: GraduationCap, color: 'text-violet-500 bg-violet-50', tab: 'UTILISATEURS' },
    { label: 'Associer des cours & planning', icon: Calendar, color: 'text-amber-500 bg-amber-50', tab: 'COURS' },
    { label: 'Gérer les paiements parents', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50', tab: 'FINANCE' },
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
      <h3 className="font-display font-black text-slate-800 text-sm">Raccourcis Administrateur</h3>
      <div className="flex flex-col gap-2">
        {shortcuts.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button key={idx} onClick={() => onNavigateToTab(action.tab)} className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all font-bold text-slate-700 flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${action.color}`}><Icon className="w-4 h-4" /></div>
                <span className="text-xs">{action.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
