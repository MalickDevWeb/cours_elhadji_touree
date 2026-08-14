import React from 'react';
import { GraduationCap, School } from 'lucide-react';
import { Student, Level, Settings } from '../../../types';

interface TimetableHeaderProps {
  student: Student;
  level?: Level;
  settings?: Settings;
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({ student, level, settings }) => {
  const schoolName = settings?.centerName || "Groupe Scolaire Élite Dakar";
  const phone = settings?.phone || "+221 33 820 00 00";
  const email = settings?.email || "Contact@ecole-elite.sn";
  const address = settings?.address || "Almadies, Dakar";
  const schoolYear = settings?.schoolYear || "2025-2026";
  const logoUrl = settings?.logoUrl;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b-2 border-sky-600 pb-3">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo École" className="w-12 h-12 object-contain rounded-lg border border-slate-200" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-sky-900 text-amber-400 flex items-center justify-center font-black shrink-0 shadow-sm">
              <School className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="font-display font-black text-lg text-sky-950 uppercase tracking-tight">{schoolName}</h1>
            <p className="text-[9.5px] text-sky-600 font-extrabold uppercase tracking-widest mt-0.5">Excellence & Discipline • Année Scolaire {schoolYear}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">{address} | Tél: {phone} | {email}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-block bg-sky-900 text-amber-400 font-black text-[9.5px] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            Emploi du Temps Officiel
          </span>
          <p className="text-[9px] text-slate-400 font-mono mt-1">Ref: EDT-{student.id.toUpperCase()}</p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs text-white">{student.firstName} {student.lastName}</h2>
            <p className="text-[9.5px] text-slate-300">Classe / Niveau : <span className="text-amber-400 font-bold">{level?.name || 'N/A'}</span></p>
          </div>
        </div>
        <div className="text-right text-[9.5px] text-slate-300">
          <p>Genre : <span className="font-bold text-white">{student.sex === 'M' ? 'Masculin' : 'Féminin'}</span></p>
          <p>Statut : <span className="font-bold text-emerald-400">Élève Actif</span></p>
        </div>
      </div>
    </div>
  );
};
