import { PaymentEntity } from '../domain/Payment';

export interface PaymentRepository {
  findAll(): Promise<PaymentEntity[]>;
  findByStudentId(studentId: string): Promise<PaymentEntity[]>;
  save(payment: PaymentEntity): Promise<PaymentEntity>;
}
