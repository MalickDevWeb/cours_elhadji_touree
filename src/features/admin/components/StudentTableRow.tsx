import React from 'react';
import { Phone, FileText, User } from 'lucide-react';
import { Student, Parent } from '../../../types';
import { getStudentPhoto } from '../../shared/components/StudentCardBody';

interface StudentTableRowProps {
  student: Student;
  parent?: Parent;
  levelName?: string;
  onSelect: (s: Student) => void;
  onViewPdf: (id: string) => void;
}

export const StudentTableRow: React.FC<StudentTableRowProps> = ({
  student,
  parent,
  levelName,
  onSelect,
  onViewPdf,
}) => {
  const photoUrl = student.photoUrl || getStudentPhoto(student.id, student.sex);

  return (
    <tr className="hover:bg-slate-50/50">
      <td className="p-4 font-bold text-slate-800">
        <button
          onClick={() => onSelect(student)}
          className="flex items-center gap-3 hover:text-sky-500 transition cursor-pointer font-bold text-left group"
        >
          <img
            src={photoUrl}
            alt=""
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs group-hover:border-sky-400 transition"
            referrerPolicy="no-referrer"
          />
          <span>{student.firstName} {student.lastName}</span>
        </button>
      </td>
      <td className="p-4">
        <span className="px-2 py-1 rounded bg-sky-50 text-sky-600 font-semibold">
          {levelName}
        </span>
      </td>
      <td className="p-4">{student.sex === 'M' ? 'Garçon' : 'Fille'}</td>
      <td className="p-4">
        <div>
          <p className="font-semibold text-slate-700">{parent?.fullName || 'Inconnu'}</p>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Phone className="w-3.5 h-3.5 text-slate-300" /> {parent?.phone}
          </p>
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onSelect(student)}
            className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-600 px-2.5 py-1.5 rounded-lg transition font-semibold text-[10px] cursor-pointer"
          >
            <User className="w-3 h-3" /> Profil & QR
          </button>
          <button
            onClick={() => onViewPdf(student.id)}
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg transition font-semibold text-[10px] cursor-pointer"
          >
            <FileText className="w-3 h-3" /> PDF
          </button>
        </div>
      </td>
    </tr>
  );
};
