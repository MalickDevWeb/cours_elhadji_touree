import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Student, Level } from '../../../../types';
import { StudentCardBody } from '../../../shared/components/StudentCardBody';

interface StudentCardModalProps {
  student: Student;
  level?: Level;
  cardNo: string;
  onClose: () => void;
}

export function StudentCardModal({ student, level, onClose }: StudentCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 z-50 animate-in fade-in duration-200 select-none text-xs overflow-y-auto pt-10 sm:pt-16 pb-12">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-150 text-slate-800">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="font-display font-extrabold text-slate-800 text-[11.5px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Carte Numérique de l'Élève
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">✕</button>
        </div>

        <div ref={cardRef} className="w-full">
          <StudentCardBody student={student} level={level} />
        </div>

        <p className="text-[9.5px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          La carte officielle intègre la photo d'identité, la puce virtuelle et le code QR sécurisé pour l'accès aux cours.
        </p>
      </div>
    </div>
  );
}
