import { validatePayment } from '../validation/PaymentValidation';

export interface PaymentEntity {
  readonly id: string;
  readonly studentId: string;
  readonly month: string;
  readonly amount: number;
  readonly date: string;
  readonly status: 'PAYE' | 'EN_ATTENTE' | 'RETARD';
  readonly method: 'Wave' | 'Orange Money' | 'Espèces' | 'Virement';
  readonly receiptNumber: string;
}

export function createPaymentEntity(data: unknown): PaymentEntity {
  const validated = validatePayment(data);
  return {
    id: validated.id || `pay_${Date.now()}`,
    studentId: validated.studentId,
    month: validated.month,
    amount: validated.amount,
    date: validated.paidAt || new Date().toISOString().split('T')[0],
    status: validated.status,
    method: 'Wave',
    receiptNumber: validated.receiptNumber || `REC-${Math.floor(10000 + Math.random() * 90000)}`
  };
}
