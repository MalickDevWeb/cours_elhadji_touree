import { PaymentRepository } from '../ports/PaymentRepository';
import { PaymentEntity } from '../domain/Payment';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { getPrisma } from '../db/prismaClient';
import { JsonPaymentRepository } from './JsonPaymentRepository';

export class PrismaPaymentRepository implements PaymentRepository {
  private jsonFallback = new JsonPaymentRepository();

  async findAll(): Promise<PaymentEntity[]> {
    try {
      const records = await getPrisma().payment.findMany();
      if (records.length === 0) return this.jsonFallback.findAll();
      return records.map((p) => PaymentMapper.toEntity({
        id: p.id,
        studentId: p.studentId,
        month: p.month,
        amount: p.amount,
        date: p.paidAt.toISOString().split('T')[0],
        status: p.status as any,
        method: p.method as any,
        receiptNumber: p.receiptNumber
      }));
    } catch {
      return this.jsonFallback.findAll();
    }
  }

  async findByStudentId(studentId: string): Promise<PaymentEntity[]> {
    try {
      const records = await getPrisma().payment.findMany({ where: { studentId } });
      if (records.length === 0) return this.jsonFallback.findByStudentId(studentId);
      return records.map((p) => PaymentMapper.toEntity({
        id: p.id,
        studentId: p.studentId,
        month: p.month,
        amount: p.amount,
        date: p.paidAt.toISOString().split('T')[0],
        status: p.status as any,
        method: p.method as any,
        receiptNumber: p.receiptNumber
      }));
    } catch {
      return this.jsonFallback.findByStudentId(studentId);
    }
  }

  async save(payment: PaymentEntity): Promise<PaymentEntity> {
    try {
      await getPrisma().payment.upsert({
        where: { id: payment.id },
        update: {
          studentId: payment.studentId,
          month: payment.month,
          amount: payment.amount,
          status: payment.status as any,
          method: payment.method,
          receiptNumber: payment.receiptNumber
        },
        create: {
          id: payment.id,
          studentId: payment.studentId,
          month: payment.month,
          amount: payment.amount,
          status: payment.status as any,
          method: payment.method,
          receiptNumber: payment.receiptNumber
        }
      });
      await this.jsonFallback.save(payment);
      return payment;
    } catch {
      return this.jsonFallback.save(payment);
    }
  }
}
