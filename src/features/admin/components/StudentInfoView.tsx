import React from 'react';
import { Phone, MapPin, Calendar, QrCode } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';

interface StudentInfoViewProps {
  student: Student;
  parent: Parent | undefined;
  levels: Level[];
  onEdit: () => void;
  onDelete?: () => void;
  onOpenCard: () => void;
}

export const StudentInfoView: React.FC<StudentInfoViewProps> = ({
  student,
  parent,
  levels,
  onEdit,
  onDelete,
  onOpenCard,
}) => {
  const levelName = levels.find((l) => l.id === student.levelId)?.name || 'Non spécifié';

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-800 font-display">
          {student.firstName} {student.lastName}
        </h3>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-50 text-sky-600 border border-sky-200/50">
          {levelName}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <p className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Né(e) le : {student.birthDate}
        </p>
        <p className="flex items-center gap-2">
          Genre : {student.sex === 'M' ? 'Garçon' : 'Fille'}
        </p>
      </div>

      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 mt-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Parent Responsable</span>
        <p className="font-bold text-slate-700 text-xs">{parent?.fullName || 'Non spécifié'}</p>
        <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400" /> {parent?.phone || 'Pas de numéro'}
        </p>
        <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {parent?.address || 'Pas d\'adresse'}
        </p>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
        >
          Modifier
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Supprimer
          </button>
        )}
        <button
          onClick={onOpenCard}
          className="bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5" /> Carte Officielle
        </button>
      </div>
    </div>
  );
};
