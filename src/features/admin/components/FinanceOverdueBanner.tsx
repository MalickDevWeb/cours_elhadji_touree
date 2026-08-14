import React from 'react';
import { AlertTriangle, Phone, Plus } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';

interface OverdueBannerProps {
  overdueStudents: Student[];
  parents: Parent[];
  levels: Level[];
  onAddClick: (studentId: string) => void;
}

export function FinanceOverdueBanner({ overdueStudents, parents, levels, onAddClick }: OverdueBannerProps) {
  if (overdueStudents.length === 0) return null;

  return (
    <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 space-y-3 text-xs">
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 bg-rose-500 text-white rounded-lg"><AlertTriangle className="w-4 h-4 shrink-0" /></div>
        <div>
          <h4 className="font-bold text-rose-950">Règlements en attente ce mois-ci</h4>
          <p className="text-rose-700 text-[10px]">Il y a {overdueStudents.length} élèves sans règlement ce mois-ci. Relancez-les sur WhatsApp.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {overdueStudents.map(student => {
          const parent = parents.find(p => p.id === student.parentId);
          const levelName = levels.find(l => l.id === student.levelId)?.name || 'Classe';
          const whatsappMsg = `Bonjour ${parent?.fullName || ''}, nous vous contactons de la part du Centre d'Élite concernant le suivi de ${student.firstName}. Le paiement de la scolarité de ${student.firstName} pour ce mois-ci n'a pas encore été enregistré. Nous vous prions de bien vouloir régulariser cela. Merci !`;
          const encodedMsg = encodeURIComponent(whatsappMsg);
          const waUrl = parent ? `https://wa.me/${parent.whatsapp.replace(/\s+/g, '').replace('+', '')}?text=${encodedMsg}` : '';

          return (
            <div key={student.id} className="bg-white p-3 rounded-xl border border-rose-100/60 flex flex-col justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800">{student.firstName} {student.lastName}</span>
                  <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold px-1 rounded uppercase">{levelName}</span>
                </div>
                {parent && (
                  <p className="text-[10px] text-slate-400 mt-1">Parent: {parent.fullName} ({parent.phone})</p>
                )}
              </div>
              <div className="flex gap-1 text-[10px]">
                <button onClick={() => onAddClick(student.id)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-1.5 rounded-lg transition flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Payer</button>
                {parent && (
                  <a href={waUrl} target="_blank" rel="noreferrer" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-150 px-2 py-1.5 rounded-lg transition flex items-center justify-center gap-1 shrink-0"><Phone className="w-3 h-3" /> WhatsApp</a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
