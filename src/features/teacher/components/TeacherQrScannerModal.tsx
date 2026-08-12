import React, { useState } from 'react';
import { X, QrCode, Sparkles, UserCheck } from 'lucide-react';
import { Assignment, Student, Subject, Group } from '../../../types';
import { RealCameraQrScanner } from './RealCameraQrScanner';
import { ScanResultOverlay, ScanResultData } from './ScanResultOverlay';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courses: Assignment[];
  students: Student[];
  subjects: Subject[];
  groups: Group[];
  simulatedTime: string;
  onScanQR: (cardNo: string, course: Assignment, students: Student[], simTime: string) => any;
}

export const TeacherQrScannerModal: React.FC<Props> = ({
  isOpen, onClose, courses, students, subjects, groups, simulatedTime, onScanQR
}) => {
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  if (!isOpen) return null;

  const currentCourse = courses[0];
  const courseStudents = currentCourse ? (currentCourse.type === 'INDIVIDUEL'
    ? students.filter(s => s.id === currentCourse.studentId)
    : students.filter(s => groups.find(g => g.id === currentCourse.groupId)?.studentIds.includes(s.id))) : [];

  const handleDetected = (code: string) => {
    if (!currentCourse) {
      setScanResult({ success: false, status: 'INVALID', reason: 'Aucun cours disponible pour le scan.' });
      return;
    }

    const res = onScanQR(code, currentCourse, courseStudents, simulatedTime);
    setScanResult(res);
    setTimeout(() => setScanResult(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1.5">
              Scanner de Carte d'Élève <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-slate-400 text-[10px]">Présentez la carte élève face à la caméra ou importez sa photo</p>
          </div>
        </div>

        <RealCameraQrScanner onDetected={handleDetected} />

        <ScanResultOverlay result={scanResult} />

        {courseStudents.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-amber-400" /> Test rapide de carte élève (simulation) :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {courseStudents.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleDetected(st.cardNo || st.id)}
                  className="text-[11px] font-semibold bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-400 px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3 opacity-70" />
                  {st.firstName} {st.lastName.charAt(0)}. ({st.cardNo || st.id})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
