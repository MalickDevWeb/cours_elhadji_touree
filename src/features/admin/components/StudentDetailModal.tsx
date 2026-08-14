import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Student, Parent, Level } from '../../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { StudentProfileInfo } from './StudentProfileInfo';
import { StudentCardView } from './StudentCardView';

interface StudentDetailModalProps {
  student: Student;
  parent: Parent | undefined;
  levels: Level[];
  onClose: () => void;
  onDelete?: () => void;
  onUpdate?: (updatedStudent: Student) => void;
}

export function StudentDetailModal({
  student,
  parent,
  levels,
  onClose,
  onDelete,
  onUpdate,
}: StudentDetailModalProps) {
  const [isQrMode, setIsQrMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const levelName = levels.find((l) => l.id === student.levelId)?.name || 'Niveau non défini';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center z-50 p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden border border-slate-100 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
          <div>
            <h4 className="font-display font-black text-sm">
              {isQrMode ? 'Carte Officielle de l\'Élève' : 'Profil de l\'Élève'}
            </h4>
            <p className="text-[10px] text-slate-400">ID: {student.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1">
          {!isQrMode ? (
            <StudentProfileInfo
              student={student}
              parent={parent}
              levels={levels}
              onUpdate={onUpdate}
              onDelete={onDelete ? () => setShowDeleteConfirm(true) : undefined}
              onShowCard={() => setIsQrMode(true)}
            />
          ) : (
            <StudentCardView
              student={student}
              levelName={levelName}
              onBack={() => setIsQrMode(false)}
            />
          )}
        </div>
      </div>
      
      {onDelete && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => { onDelete(); onClose(); }}
          itemName={`${student.firstName} ${student.lastName}`}
          title="Supprimer l'élève"
        />
      )}
    </div>
  );
}
