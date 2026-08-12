import React, { useMemo } from 'react';
import { Users, BookOpen, CreditCard, Heart, CheckCircle2, RefreshCw, Clock } from 'lucide-react';
import { Student, Teacher, Parent, Preinscription, Payment, Level } from '../../../types';
import { AdminNotificationHub } from './AdminNotificationHub';
import { AdminShortcutsList } from './AdminShortcutsList';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  preinscriptions: Preinscription[];
  payments: Payment[];
  levels: Level[];
  onNavigateToTab: (tab: string) => void;
  onApprovePre: (id: string) => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({
  students, teachers, parents, preinscriptions, payments, levels, onNavigateToTab, onApprovePre
}) => {
  const pending = useMemo(() => preinscriptions.filter(p => p.status === 'EN_ATTENTE'), [preinscriptions]);
  const totalRevenus = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);

  const stats = [
    { label: 'Élèves inscrits', count: students.length, badge: 'Actifs', icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-100', tab: 'UTILISATEURS' },
    { label: 'Professeurs', count: teachers.length, badge: 'Encadrement', icon: BookOpen, color: 'text-violet-600 bg-violet-50 border-violet-100', tab: 'UTILISATEURS' },
    { label: 'Parents inscrits', count: parents.length, badge: 'Comptes', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-100', tab: 'UTILISATEURS' },
    { label: 'Revenus totaux', count: `${totalRevenus.toLocaleString('fr-FR')} F`, badge: 'Cumulé', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', tab: 'FINANCE' },
  ];

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-200">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((stat, i) => (
          <button key={i} onClick={() => onNavigateToTab(stat.tab)} className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-sky-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-2.5 cursor-pointer group text-left overflow-hidden min-w-0 w-full">
            <div className="flex items-start justify-between gap-1.5 w-full min-w-0">
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">{stat.label}</span>
                <span className="inline-block text-[7.5px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500">{stat.badge}</span>
              </div>
              <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-transform duration-200 group-hover:scale-105 shrink-0 ${stat.color}`}>
                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="w-full min-w-0">
              <span className="text-sm sm:text-lg font-black text-slate-900 font-display tracking-tight block truncate">{stat.count}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-4 h-4" /></div>
                <div>
                  <h3 className="font-display font-black text-slate-800 text-sm">Demandes d'Inscription</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{pending.length} dossier(s) à valider</p>
                </div>
              </div>
              <button onClick={() => onNavigateToTab('DASHBOARD')} className="text-[10px] text-sky-600 font-bold hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer">
                <RefreshCw className="w-3 h-3" /> Actualiser
              </button>
            </div>

            {pending.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-5 h-5" /></div>
                <h4 className="font-bold text-slate-800 text-xs">Tout est à jour !</h4>
                <p className="text-slate-400 text-[10px] max-w-xs mx-auto">Toutes les pré-inscriptions reçues ont été traitées ou validées.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 4).map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-xs">{p.studentFirstName} {p.studentLastName}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                          {levels.find(l => l.id === p.levelId)?.name || 'Classe'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Parent : <strong className="text-slate-700">{p.parentName}</strong> ({p.parentPhone})</p>
                    </div>
                    <button onClick={() => onApprovePre(p.id)} className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valider l'élève
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AdminShortcutsList onNavigateToTab={onNavigateToTab} />
          <AdminNotificationHub preinscriptions={preinscriptions} levels={levels} />
        </div>
      </div>
    </div>
  );
};
