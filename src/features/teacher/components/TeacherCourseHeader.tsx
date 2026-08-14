import React from 'react';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { Assignment } from '../../../types';
import { MaxitQrCard } from './MaxitQrCard';

interface Props {
  course: Assignment; subjectName: string; groupName: string; showScanner: boolean;
  onToggleScan: () => void; currentFormatted?: string; onEndCourse: () => void;
}

export const TeacherCourseHeader: React.FC<Props> = ({
  course, subjectName, groupName, showScanner, onToggleScan, currentFormatted, onEndCourse
}) => (
  <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-850 space-y-3 shadow-md relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div>
        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Détails du cours</span>
        <h2 className="font-display font-bold text-base mt-0.5">📚 {subjectName}</h2>
        <p className="text-slate-400 text-[10px] mt-1">🎯 {groupName} | 📍 {course.location}</p>
      </div>
      <div className="text-right space-y-1">
        <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" /> {course.schedule}
        </span>
        {currentFormatted && (
          <p className="text-[9px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
            <Calendar className="w-3 h-3" /> {currentFormatted}
          </p>
        )}
      </div>
    </div>

    <MaxitQrCard showScanner={showScanner} onToggleScan={onToggleScan} authorized={true} />

    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
      <span className="text-[10px] text-slate-400">Scan actif en temps réel</span>
      <button onClick={onEndCourse} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
        <CheckCircle className="w-4 h-4" /> ✅ Terminer le cours
      </button>
    </div>
  </div>
);
