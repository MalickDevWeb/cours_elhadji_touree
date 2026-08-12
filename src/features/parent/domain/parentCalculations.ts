import { Group, Assignment, Subject, Payment } from '../../../types';
import { studentFees } from './parentMockData';

export function getChildNextCourse(
  studentId: string,
  groups: Group[],
  assignments: Assignment[],
  subjects: Subject[]
) {
  const grp = groups.find(g => g.studentIds.includes(studentId));
  if (grp) {
    const sub = subjects.find(s => s.id === grp.subjectId);
    return { subject: sub?.name || 'Soutien', schedule: grp.schedule };
  }
  const indiv = assignments.find(a => a.type === 'INDIVIDUEL' && a.studentId === studentId);
  if (indiv) {
    const sub = subjects.find(s => s.id === indiv.subjectId);
    return { subject: sub?.name || 'Soutien', schedule: indiv.schedule };
  }
  return null;
}

export function getChildPaymentSummary(studentId: string, payments: Payment[]) {
  const fee = studentFees[studentId] || { monthly: 15000, limitDate: '05 Août 2026' };
  const stdPays = payments.filter(p => p.studentId === studentId);
  const paidSum = stdPays.filter(p => p.status === 'VALIDE' || !p.status).reduce((sum, p) => sum + p.amount, 0);
  const pendingSum = stdPays.filter(p => p.status === 'EN_ATTENTE').reduce((sum, p) => sum + p.amount, 0);
  const remains = Math.max(0, fee.monthly - paidSum);
  return {
    monthly: fee.monthly,
    remains,
    pendingSum,
    limitDate: fee.limitDate,
    status: remains === 0 ? ('PAID' as const) : pendingSum > 0 ? ('PENDING_APPROVAL' as const) : ('UNPAID' as const),
    history: stdPays
  };
}
