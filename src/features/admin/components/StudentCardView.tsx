import React, { useRef } from 'react';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { Student } from '../../../types';
import { handlePrintCard, handleDownloadCardPDF } from './StudentCardUtils';
import { StudentCardBody } from '../../shared/components/StudentCardBody';

interface StudentCardViewProps {
  student: Student;
  levelName: string;
  onBack: () => void;
}

export const StudentCardView: React.FC<StudentCardViewProps> = ({ student, levelName, onBack }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200 font-sans w-full max-w-sm mx-auto">
      <div ref={cardRef} className="w-full">
        <StudentCardBody student={student} level={levelName} />
      </div>

      <p className="text-[10px] text-slate-400 text-center leading-normal px-2">
        La carte d'Élite intègre une photo d'identité, une puce virtuelle et un code QR sécurisé de validation d'accès.
      </p>

      <div className="flex gap-2 w-full pt-1">
        <button onClick={onBack} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour
        </button>
        <button onClick={() => handlePrintCard(student, cardRef.current)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
          <Printer className="w-3.5 h-3.5" /> Imprimer
        </button>
        <button onClick={() => handleDownloadCardPDF(student, cardRef.current)} className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-500/10">
          <Download className="w-3.5 h-3.5" /> Télécharger PDF
        </button>
      </div>
    </div>
  );
};
