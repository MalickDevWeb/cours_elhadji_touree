import React from 'react';
import { Phone, FileText, User } from 'lucide-react';
import { Student, Parent } from '../../../types';
import { getStudentPhoto } from '../../shared/components/StudentCardBody';

interface StudentMobileCardProps {
  student: Student;
  parent?: Parent;
  levelName?: string;
  onSelect: (s: Student) => void;
  onViewPdf: (id: string) => void;
}

export const StudentMobileCard: React.FC<StudentMobileCardProps> = ({
  student,
  parent,
  levelName,
  onSelect,
  onViewPdf,
}) => {
  const photoUrl = student.photoUrl || getStudentPhoto(student.id, student.sex);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-4 hover:border-sky-200 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={photoUrl}
            alt=""
            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <button
              onClick={() => onSelect(student)}
              className="hover:text-sky-500 text-left font-bold text-slate-800 text-sm transition"
            >
              {student.firstName} {student.lastName}
            </button>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 font-bold border border-sky-100">
                {levelName || 'N/A'}
              </span>
              <span className="text-[10px] text-slate-500">
                {student.sex === 'M' ? 'Garçon' : 'Fille'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1">
        <p className="font-semibold text-slate-700">Parent: {parent?.fullName || 'Inconnu'}</p>
        {parent?.phone && (
          <p className="flex items-center gap-1.5 text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{parent.phone}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => onSelect(student)}
          className="flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 py-2 rounded-xl transition font-bold text-xs cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Profil & QR</span>
        </button>
        <button
          onClick={() => onViewPdf(student.id)}
          className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition font-bold text-xs cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Fiche PDF</span>
        </button>
      </div>
    </div>
  );
};
