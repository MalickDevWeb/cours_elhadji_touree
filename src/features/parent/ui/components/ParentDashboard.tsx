import React from 'react';
import { Users, Calendar, CreditCard, ChevronRight, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Parent } from '../../../../types';

interface ParentDashboardProps {
  currentParent: Parent;
  enrolledCount: number;
  pendingAmount: number;
  nextCourse: { childName: string; subject: string; schedule: string } | null;
  onNavigateToStudents: () => void;
  onNavigateToPayment: () => void;
}

export function ParentDashboard({
  currentParent, enrolledCount, pendingAmount, nextCourse, onNavigateToStudents, onNavigateToPayment
}: ParentDashboardProps) {
  const hasLatePayment = pendingAmount > 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-200 select-none text-xs">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-5 rounded-3xl shadow-xs relative overflow-hidden text-left">
        <div className="space-y-1 relative z-10">
          <span className="bg-white/15 text-white/90 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-white/10">Sénégal - Thiès</span>
          <h2 className="font-display font-black text-lg md:text-xl">Bonjour, {currentParent.fullName} 👋</h2>
          <p className="text-sky-100 text-[10px] max-w-md">Espace suivi parent & scolarité.</p>
        </div>
      </div>

      {hasLatePayment ? (
        <div className="bg-red-50/90 border border-red-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-red-900 text-sm">Scolarité en retard / à régulariser</span>
                <span className="bg-red-200 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md">Action requise</span>
              </div>
              <p className="text-[11px] text-red-700 font-medium mt-0.5">
                Reste à payer : <strong className="font-black text-red-900">{pendingAmount.toLocaleString('fr-FR')} FCFA</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToPayment}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-sm shrink-0"
          >
            <CreditCard className="w-4 h-4" /> Régler maintenant
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200/90 p-3.5 rounded-3xl flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-900 text-xs">Paiements à jour</span>
            <p className="text-[10px] text-emerald-700">Toutes les scolarités de vos enfants sont parfaitement réglées.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0"><Users className="w-5 h-5" /></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase">Élèves inscrits</p><p className="text-base font-black text-slate-800">{enrolledCount} enfant(s)</p></div>
          </div>
          <button onClick={onNavigateToStudents} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><Calendar className="w-5 h-5" /></div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Prochain cours</p>
            {nextCourse ? <div><p className="text-xs font-bold text-slate-800 truncate">{nextCourse.childName} - {nextCourse.subject}</p><p className="text-[9.5px] text-slate-500 font-medium">{nextCourse.schedule}</p></div> : <p className="text-xs font-bold text-slate-500">Aucun cours planifié</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <h3 className="font-display font-bold text-slate-800 text-xs">Fiches & Emplois du Temps</h3>
          </div>
          <p className="text-slate-500 text-[10.5px]">Consultez le suivi détaillé, les présences et le cahier de texte de vos enfants.</p>
        </div>
        <button onClick={onNavigateToStudents} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-xs shrink-0">
          <span>Voir mes enfants</span><ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

