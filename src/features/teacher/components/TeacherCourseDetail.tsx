import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Assignment, Student, Subject, Group } from '../../../types';
import { StudentRow } from './StudentRow';
import { isScanAuthorized } from '../domain/courseMatcher';
import { TeacherScanSimulator } from './TeacherScanSimulator';
import { TeacherCourseHeader } from './TeacherCourseHeader';
import { ScanResultData } from './ScanResultOverlay';

interface Props {
  course: Assignment; students: Student[]; subjects: Subject[]; groups: Group[];
  attendanceHistory: any; simulatedTime: string; onBack: () => void;
  onUpdateAttendance: (student: Student, course: Assignment, status: 'PRESENT' | 'ABSENT' | 'RETARD', justification?: string) => void;
  onAddObservation: (student: Student, subjectName: string, text: string) => void;
  onScanQR: (cardNo: string, course: Assignment, students: Student[], simTime?: string) => any;
}

export function TeacherCourseDetail({
  course, students, subjects, groups, attendanceHistory, simulatedTime, onBack, onUpdateAttendance, onAddObservation, onScanQR
}: Props) {
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

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

      <TeacherCourseHeader
        course={course} subjectName={subjectName} groupName={groupName} showScanner={showScanner}
        onToggleScan={() => setShowScanner(!showScanner)} currentFormatted={scanCheck.currentFormatted}
        onEndCourse={onBack}
      />

      {showScanner && (
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
    </div>
  );
}
