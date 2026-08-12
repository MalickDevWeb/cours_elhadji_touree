import { PaymentRepository } from '../ports/PaymentRepository';
import { PaymentEntity } from '../domain/Payment';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { readDb, writeDb } from '../dbHelper';

export class JsonPaymentRepository implements PaymentRepository {
  async findAll(): Promise<PaymentEntity[]> {
    const db = readDb();
    return (db.payments || []).map(PaymentMapper.toEntity);
  }

  async findByStudentId(studentId: string): Promise<PaymentEntity[]> {
    const db = readDb();
    const list = (db.payments || []).filter((p: any) => p.studentId === studentId);
    return list.map(PaymentMapper.toEntity);
  }

  async save(payment: PaymentEntity): Promise<PaymentEntity> {
    const db = readDb();
    const payments = db.payments || [];
    const index = payments.findIndex((p: any) => p.id === payment.id);
    const dto = PaymentMapper.toDto(payment);
    if (index >= 0) {
      payments[index] = dto;
    } else {
      payments.push(dto);
    }
    db.payments = payments;
    writeDb(db);
    return payment;
  }
}
