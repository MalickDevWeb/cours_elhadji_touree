import React from 'react';
import { Home, Users, CreditCard } from 'lucide-react';

interface ParentSidebarProps {
  activeSection: string;
  selectedStudentId: string | null;
  onNavigate: (section: 'ACCUEIL' | 'ELEVES' | 'PAIEMENT' | 'PARAMETRES') => void;
  onOpenPayment?: () => void;
}

export function ParentSidebar({ activeSection, selectedStudentId, onNavigate }: ParentSidebarProps) {
  const tabs = [
    { id: 'ACCUEIL', label: 'Accueil', icon: Home, color: 'text-sky-500' },
    { id: 'PAIEMENT', label: 'Payer Scolarité', icon: CreditCard, color: 'text-emerald-500' },
    { id: 'ELEVES', label: 'Mes enfants', icon: Users, color: 'text-indigo-500' },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-2 h-fit sticky top-24 text-xs">
      <div className="px-3 mb-1">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Mon Espace Parent</p>
      </div>

      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id && !selectedStudentId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id as any)}
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
