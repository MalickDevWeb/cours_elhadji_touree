import { PaymentEntity } from '../domain/Payment';
import { PaymentDto } from '../dto/PaymentDto';

export class PaymentMapper {
  static toDto(entity: PaymentEntity): PaymentDto {
    return {
      id: entity.id,
      studentId: entity.studentId,
      month: entity.month,
      amount: entity.amount,
      date: entity.date,
      status: entity.status,
      method: entity.method,
      receiptNumber: entity.receiptNumber
    };
  }

  static toEntity(raw: any): PaymentEntity {
    return {
      id: raw.id,
      studentId: raw.studentId,
      month: raw.month,
      amount: Number(raw.amount) || 0,
      date: raw.date,
      status: raw.status || 'PAYE',
      method: raw.method || 'Wave',
      receiptNumber: raw.receiptNumber
    };
  }
}
