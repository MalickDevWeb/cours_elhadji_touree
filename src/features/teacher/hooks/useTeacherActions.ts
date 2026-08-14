import { useCallback } from 'react';
import { Teacher, Student, Subject, Assignment } from '../../../types';
import { matchStudentByQr } from '../domain/qrCodeParser';
import { playSuccessChime, playWarningChime, playErrorChime } from '../utils/scanFeedback';

export function useTeacherActions(
  me: Teacher, attendanceHistory: any, saveAttendanceHistory: (data: any) => void,
  observationsHistory: any, saveObservationsHistory: (data: any) => void,
  notifications: any[], saveNotifications: (data: any[]) => void, subjects: Subject[]
) {
  const triggerNotification = useCallback((student: Student, title: string, body: string, type: 'ATTENDANCE' | 'GRADE' | 'SYSTEM') => {
    const now = new Date();
    const newNotif = { id: `notif-${Date.now()}`, title, body, date: now.toISOString().split('T')[0], time: now.toTimeString().slice(0, 5), isRead: false, type };
    saveNotifications([newNotif, ...notifications]);
  }, [notifications, saveNotifications]);

  const updateAttendance = useCallback((student: Student, course: Assignment, status: 'PRESENT' | 'ABSENT' | 'RETARD', justification = '', customDate?: string) => {
    const subject = subjects.find(s => s.id === course.subjectId)?.name || 'Cours';
    const now = customDate ? new Date(customDate) : new Date();
    const dateStr = !isNaN(now.getTime()) ? now.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const timeStr = !isNaN(now.getTime()) ? now.toTimeString().slice(0, 5) : new Date().toTimeString().slice(0, 5);
    const historyForStudent = [...(attendanceHistory[student.id] || [])];
    const existingIndex = historyForStudent.findIndex(r => r.date === dateStr && r.subjectName === subject);
    const record = { date: dateStr, status, subjectName: subject, time: status === 'ABSENT' ? '--:--' : timeStr, justification };

    if (existingIndex > -1) historyForStudent[existingIndex] = record;
    else historyForStudent.unshift(record);

    saveAttendanceHistory({ ...attendanceHistory, [student.id]: historyForStudent });
    const emoji = status === 'PRESENT' ? '✅' : status === 'ABSENT' ? '❌' : '⏰';
    const label = status === 'PRESENT' ? 'présent' : status === 'ABSENT' ? 'absent' : 'en retard';
    triggerNotification(student, `${emoji} Présence : ${status}`, `${student.firstName} ${student.lastName} noté(e) ${label} au cours de ${subject} par ${me.fullName}.`, 'ATTENDANCE');
  }, [attendanceHistory, saveAttendanceHistory, subjects, me.fullName, triggerNotification]);

  const addObservation = useCallback((student: Student, subjectName: string, text: string) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const obsForStudent = [...(observationsHistory[student.id] || [])];
    obsForStudent.unshift({ date: dateStr, teacherName: me.fullName, subjectName, text });
    saveObservationsHistory({ ...observationsHistory, [student.id]: obsForStudent });
    triggerNotification(student, '📝 Nouvelle observation', `${me.fullName} (${subjectName}) a noté : "${text}"`, 'SYSTEM');
  }, [observationsHistory, saveObservationsHistory, me.fullName, triggerNotification]);

  const scanQRCode = useCallback((cardNumber: string, course: Assignment, courseStudents: Student[], simulatedTime?: string) => {
    const student = matchStudentByQr(cardNumber, courseStudents);
    if (!student) {
      playErrorChime();
      return { success: false, status: 'INVALID', reason: `Carte QR Code (${cardNumber}) introuvable ou élève non inscrit à ce cours.` };
    }

    const subject = subjects.find(s => s.id === course.subjectId)?.name || 'Cours';
    const now = simulatedTime ? new Date(simulatedTime) : new Date();
    const dateStr = !isNaN(now.getTime()) ? now.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const timeStr = !isNaN(now.getTime()) ? now.toTimeString().slice(0, 5) : new Date().toTimeString().slice(0, 5);

    const historyForStudent = attendanceHistory[student.id] || [];
    const existingRecord = historyForStudent.find((r: any) => r.date === dateStr && r.subjectName === subject);

    if (existingRecord && existingRecord.status === 'PRESENT') {
      playWarningChime();
      return {
        success: false, status: 'ALREADY_SCANNED',
        studentName: `${student.firstName} ${student.lastName}`,
        time: existingRecord.time || 'aujourd\'hui',
        reason: `${student.firstName} ${student.lastName} a déjà été scanné(e) aujourd'hui (${dateStr}) à ${existingRecord.time || 'ce cours'}.`
      };
    }

    playSuccessChime();
    updateAttendance(student, course, 'PRESENT', '', simulatedTime);
    return { success: true, status: 'SUCCESS', studentName: `${student.firstName} ${student.lastName}`, time: timeStr, date: dateStr };
  }, [updateAttendance, attendanceHistory, subjects]);

  return { updateAttendance, addObservation, scanQRCode };
}

