import { useState, useEffect, useCallback } from 'react';
import { mockDb, subscribeToDb } from '../infrastructure/mockDb';
import { Teacher, Group, Assignment, Payment, Preinscription } from '../../../types';
import { handleAddPreinscription, handleApprovePreinscription } from './soutienScolaireActions';
import { generateRandomPin } from '../utils/whatsappHelper';

export function useSoutienScolaire() {
  const [, setTick] = useState(0);
  useEffect(() => subscribeToDb(() => setTick(t => t + 1)), []);

  const addPreinscription = useCallback((data: Omit<Preinscription, 'id' | 'status' | 'date'>) => {
    return handleAddPreinscription(data);
  }, []);

  const approvePreinscription = useCallback((id: string) => {
    handleApprovePreinscription(id);
  }, []);

  const addPayment = useCallback((
    amount: number, studentId: string, method: Payment['method'],
    opts?: { reference?: string; proofUrl?: string; transactionNote?: string; status?: 'VALIDE' | 'EN_ATTENTE' | 'REFUSE' }
  ) => {
    const newPay: Payment = {
      id: `pay-${Date.now()}`, studentId, amount, date: new Date().toISOString().split('T')[0],
      method, reference: opts?.reference || `REC-${Date.now().toString().slice(-4)}`,
      status: opts?.status || 'VALIDE', proofUrl: opts?.proofUrl, transactionNote: opts?.transactionNote
    };
    mockDb.savePayments([...mockDb.getPayments(), newPay]);
    return newPay;
  }, []);

  const validatePayment = useCallback((paymentId: string, status: 'VALIDE' | 'REFUSE') => {
    const updated = mockDb.getPayments().map(p => p.id === paymentId ? { ...p, status } : p);
    mockDb.savePayments(updated);
  }, []);

  const addTeacher = useCallback((t: Omit<Teacher, 'id'>) => {
    const pin = t.pin || generateRandomPin();
    mockDb.saveTeachers([...mockDb.getTeachers(), { ...t, pin, id: `tch-${Date.now()}` }]);
  }, []);

  const addAssignment = useCallback((asg: Omit<Assignment, 'id'>) => {
    mockDb.saveAssignments([...mockDb.getAssignments(), { ...asg, id: `asg-${Date.now()}` }]);
  }, []);

  const addGroup = useCallback((g: Omit<Group, 'id' | 'studentIds'>) => {
    mockDb.saveGroups([...mockDb.getGroups(), { ...g, id: `grp-${Date.now()}`, studentIds: [] }]);
  }, []);

  return {
    subjects: mockDb.getSubjects(), levels: mockDb.getLevels(), parents: mockDb.getParents(),
    students: mockDb.getStudents(), teachers: mockDb.getTeachers(), courseOffers: mockDb.getCourseOffers(),
    groups: mockDb.getGroups(), assignments: mockDb.getAssignments(), payments: mockDb.getPayments(),
    preinscriptions: mockDb.getPreinscriptions(), settings: mockDb.getSettings(),
    attendanceHistory: mockDb.getAttendanceHistory(), saveAttendanceHistory: mockDb.saveAttendanceHistory,
    gradesHistory: mockDb.getGradesHistory(), saveGradesHistory: mockDb.saveGradesHistory,
    observationsHistory: mockDb.getObservationsHistory(), saveObservationsHistory: mockDb.saveObservationsHistory,
    notifications: mockDb.getNotifications(), saveNotifications: mockDb.saveNotifications,
    addPreinscription, approvePreinscription, addPayment, validatePayment, addTeacher, addAssignment, addGroup,
    updateSettings: mockDb.saveSettings, saveStudents: mockDb.saveStudents, saveGroups: mockDb.saveGroups, saveParents: mockDb.saveParents, saveTeachers: mockDb.saveTeachers,
    saveSubjects: mockDb.saveSubjects, saveLevels: mockDb.saveLevels, saveCourseOffers: mockDb.saveCourseOffers, saveAssignments: mockDb.saveAssignments
  };
}
