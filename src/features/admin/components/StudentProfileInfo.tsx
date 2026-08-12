import React, { useState } from 'react';
import { Calendar, Phone, MapPin, QrCode } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';
import { StudentEditForm } from './StudentEditForm';
import { StudentPhotoUploader } from '../../shared/components/StudentPhotoUploader';

interface StudentProfileInfoProps {
  student: Student;
  parent: Parent | undefined;
  levels: Level[];
  onUpdate?: (updatedStudent: Student) => void;
  onDelete?: () => void;
  onShowCard: () => void;
}

export const StudentProfileInfo: React.FC<StudentProfileInfoProps> = ({
  student, parent, levels, onUpdate, onDelete, onShowCard
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (formData: { firstName: string; lastName: string; sex: 'M' | 'F'; levelId: string; photoUrl?: string }) => {
    if (onUpdate) {
      onUpdate({ ...student, ...formData });
    }
    setIsEditing(false);
  };

  const levelName = levels.find((l) => l.id === student.levelId)?.name || 'Niveau non défini';

  return (
    <div className="space-y-4">
      {isEditing ? (
        <StudentEditForm
          student={student}
          levels={levels}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <StudentPhotoUploader
              studentId={student.id}
              sex={student.sex}
              currentPhotoUrl={student.photoUrl}
              studentName={`${student.firstName} ${student.lastName}`}
              onPhotoChange={(newUrl) => onUpdate?.({ ...student, photoUrl: newUrl })}
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-black text-slate-800 font-display truncate">{student.firstName} {student.lastName}</h3>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-100">
                {levelName}
              </span>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <p className="flex items-center gap-2 font-medium"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Né(e) le : {student.birthDate}</p>
            <p className="flex items-center gap-2 font-medium">Genre : {student.sex === 'M' ? 'Garçon' : 'Fille'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2.5 mt-2">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Parent Responsable</span>
            <p className="font-bold text-slate-700 text-xs">{parent?.fullName || 'Non spécifié'}</p>
            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {parent?.phone}</p>
            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {parent?.address}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-[10px] transition cursor-pointer">
            Modifier
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-xl text-[10px] transition cursor-pointer">
            Supprimer
          </button>
        )}
        <button onClick={onShowCard} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3.5 py-2 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition cursor-pointer">
          <QrCode className="w-3.5 h-3.5" /> Carte QR d'Élite
        </button>
      </div>
    </div>
  );
};
