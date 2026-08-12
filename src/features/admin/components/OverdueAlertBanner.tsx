import React from 'react';
import { AlertTriangle, Plus, Phone } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';

interface OverdueAlertBannerProps {
  overdueStudents: Student[];
  currentMonthName: string;
  levels: Level[];
  parents: Parent[];
  onSelectStudent: (id: string) => void;
  onClose: () => void;
}

export function OverdueAlertBanner({
  overdueStudents, currentMonthName, levels, parents, onSelectStudent, onClose
}: OverdueAlertBannerProps) {
  return (
    <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-6 space-y-4 shadow-xs animate-in fade-in duration-300 relative overflow-hidden text-xs">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <span className="bg-rose-100 text-rose-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Alerte Mensuelle : Retards de Paiement
            </span>
            <h3 className="font-display font-extrabold text-rose-950 text-base">
              Règlements en attente - {currentMonthName}
            </h3>
            <p className="text-rose-700 text-[11px] leading-relaxed max-w-2xl">
              Il y a <strong>{overdueStudents.length} élève(s)</strong> pour qui aucun paiement n'a été enregistré ce mois-ci.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-rose-400 hover:text-rose-600 font-bold text-lg p-1.5 transition rounded-lg hover:bg-rose-100/50 cursor-pointer">×</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {overdueStudents.map(student => {
          const level = levels.find(l => l.id === student.levelId);
          const parent = parents.find(p => p.id === student.parentId);
          const cleanPhone = parent ? parent.whatsapp.trim().replace(/\s+/g, '') : '';
          const whatsappMsg = `Bonjour ${parent?.fullName || ''}, nous vous contactons de la part du Centre d'Élite concernant le suivi de ${student.firstName}. Le paiement de la scolarité de ${student.firstName} pour le mois de ${currentMonthName} n'a pas encore été enregistré. Merci !`;
          const encodedMsg = encodeURIComponent(whatsappMsg);
          const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMsg}`;

          return (
            <div key={student.id} className="bg-white border border-rose-100/80 p-4 rounded-2xl flex flex-col justify-between gap-4 shadow-2xs hover:shadow-xs transition">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="font-display font-bold text-slate-800 text-xs truncate">{student.firstName} {student.lastName}</span>
                  <span className="bg-rose-50 text-rose-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">En Retard</span>
                </div>
                <div className="text-[10px] text-slate-500 space-y-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100 mt-2">
                  <p className="flex justify-between"><span>Classe :</span><strong className="text-slate-700">{level?.name || 'Inconnue'}</strong></p>
                  {parent && (
                    <>
                      <p className="flex justify-between"><span>Parent :</span><strong className="text-slate-700 truncate max-w-[120px]">{parent.fullName}</strong></p>
                      <p className="flex justify-between"><span>Téléphone :</span><strong className="text-slate-700 font-mono">{parent.phone}</strong></p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2 text-[10px] font-bold">
                <button onClick={() => onSelectStudent(student.id)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl transition text-center cursor-pointer flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Enregistrer
                </button>
                {parent && (
                  <a href={waUrl} target="_blank" rel="noreferrer" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/60 font-bold px-3 py-2 rounded-xl transition flex items-center justify-center gap-1 shrink-0">
                    <Phone className="w-3.5 h-3.5" /> Relancer
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
