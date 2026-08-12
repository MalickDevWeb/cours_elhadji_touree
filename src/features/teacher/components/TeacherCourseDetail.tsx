import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, AlertCircle } from 'lucide-react';
import { Assignment, Student, Subject, Group } from '../../../types';
import { StudentRow } from './StudentRow';
import { isScanAuthorized } from '../domain/courseMatcher';
import { TeacherScanSimulator } from './TeacherScanSimulator';
import { MaxitQrCard } from './MaxitQrCard';
import { ScanResultData } from './ScanResultOverlay';

interface Props {
  course: Assignment; students: Student[]; subjects: Subject[]; groups: Group[];
  attendanceHistory: any; simulatedTime: string; onBack: () => void;
  onUpdateAttendance: (student: Student, course: Assignment, status: 'PRESENT' | 'ABSENT' | 'RETARD', justification?: string) => void;
  onAddObservation: (student: Student, subjectName: string, text: string) => void;
  onScanQR: (cardNo: string, course: Assignment, students: Student[], simTime: string) => any;
}

export function TeacherCourseDetail({
  course, students, subjects, groups, attendanceHistory, simulatedTime, onBack, onUpdateAttendance, onAddObservation, onScanQR
}: Props) {
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [courseEnded, setCourseEnded] = useState(false);

  const subjectName = subjects.find(s => s.id === course.subjectId)?.name || 'Matière';
  const groupName = course.type === 'GROUPE' ? (groups.find(g => g.id === course.groupId)?.name || 'Classe') : 'Individuel';
  const courseStudents = course.type === 'INDIVIDUEL' ? students.filter(s => s.id === course.studentId) : students.filter(s => groups.find(g => g.id === course.groupId)?.studentIds.includes(s.id));
  const scanCheck = isScanAuthorized(course, simulatedTime);

  const handleSimulateScan = (e: React.FormEvent) => { e.preventDefault(); if (qrCodeInput.trim()) handleCodeDetected(qrCodeInput.trim()); };

  const handleCodeDetected = (code: string) => {
    if (!code) return;
    const res = onScanQR(code, course, courseStudents, simulatedTime);
    setScanResult(res);
    if (res.success) setQrCodeInput('');
    setTimeout(() => setScanResult(null), 4500);
  };

  return (
    <div className="space-y-4 text-xs animate-fade-in pb-12">
      <button onClick={onBack} className="flex items-center gap-1.5 text-amber-600 font-bold hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> Retour
      </button>

      {courseEnded ? (
        <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md"><CheckCircle className="w-6 h-6" /></div>
          <h3 className="font-display font-bold text-slate-800 text-base">Félicitations ! Cours terminé.</h3>
          <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">Toutes les présences et les remarques ont été enregistrées et envoyées aux parents.</p>
          <button onClick={onBack} className="bg-slate-900 text-white font-bold py-2 px-5 rounded-xl cursor-pointer hover:bg-slate-800">Retour</button>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-850 space-y-3 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Détails du cours</span>
                <h2 className="font-display font-bold text-base mt-0.5">📚 {subjectName}</h2>
                <p className="text-slate-400 text-[10px] mt-1">🎯 {groupName} | 📍 {course.location}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.schedule}</span>
            </div>

            <MaxitQrCard showScanner={showScanner} onToggleScan={() => setShowScanner(!showScanner)} authorized={scanCheck.authorized} reason={scanCheck.reason} />

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button onClick={() => setCourseEnded(true)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                <CheckCircle className="w-4 h-4" /> ✅ Terminer le cours
              </button>
            </div>
          </div>

          {!scanCheck.authorized && (
            <div className="bg-rose-50 border border-rose-150 p-3 rounded-2xl text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Ce cours n'est pas disponible pour le scan : {scanCheck.reason}</span>
            </div>
          )}

          {showScanner && scanCheck.authorized && (
            <TeacherScanSimulator qrCodeInput={qrCodeInput} setQrCodeInput={setQrCodeInput} courseStudents={courseStudents} onSubmit={handleSimulateScan} onCodeDetected={handleCodeDetected} scanResult={scanResult} />
          )}

          <div className="space-y-3">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> Élèves de la classe ({courseStudents.length})</h3>
            <div className="space-y-3">
              {courseStudents.map(s => (
                <StudentRow key={s.id} student={s} currentStatus={(attendanceHistory[s.id] || []).find((r: any) => r.subjectName === subjectName && r.date === new Date().toISOString().split('T')[0])?.status} currentJustification={(attendanceHistory[s.id] || []).find((r: any) => r.subjectName === subjectName && r.date === new Date().toISOString().split('T')[0])?.justification} onUpdateStatus={(status, just) => onUpdateAttendance(s, course, status, just)} onAddObservation={text => onAddObservation(s, subjectName, text)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
