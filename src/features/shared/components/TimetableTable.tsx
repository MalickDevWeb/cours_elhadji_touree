import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export interface TimetableItem {
  id: string;
  subject: string;
  teacher: string;
  location: string;
  schedule: string;
  type: string;
}

interface TimetableTableProps {
  items: TimetableItem[];
}

export const TimetableTable: React.FC<TimetableTableProps> = ({ items }) => (
  <div className="pt-2 space-y-3">
    <h3 className="font-display font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
      <Calendar className="w-4 h-4 text-sky-600" /> Planning des Cours Hebdomadaires
    </h3>

    {items.length === 0 ? (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-slate-400 font-medium text-xs">Aucun cours planifié sur cet emploi du temps.</p>
      </div>
    ) : (
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Horaires & Jour</th>
              <th className="p-3">Matière</th>
              <th className="p-3">Enseignant</th>
              <th className="p-3">Lieu / Salle</th>
              <th className="p-3 text-right">Format</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-[11px]">
            {items.map((it, idx) => (
              <tr key={it.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-3 font-bold text-sky-700 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  {it.schedule}
                </td>
                <td className="p-3 font-bold text-slate-900">{it.subject}</td>
                <td className="p-3 text-slate-600 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> {it.teacher}
                </td>
                <td className="p-3 text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {it.location}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <span className={`px-2 py-0.5 rounded-md font-extrabold text-[8px] uppercase tracking-wider ${
                    it.type === 'GROUPE' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {it.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
