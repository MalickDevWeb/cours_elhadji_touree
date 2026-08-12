import { PaymentRepository } from '../ports/PaymentRepository';
import { PaymentDto } from '../dto/PaymentDto';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { createPaymentEntity } from '../domain/Payment';

export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepository) {}

  async getPaymentsByStudentId(studentId?: string): Promise<PaymentDto[]> {
    const list = studentId 
      ? await this.paymentRepo.findByStudentId(studentId)
      : await this.paymentRepo.findAll();
    return list.map(PaymentMapper.toDto);
  }

  async recordPayment(data: Partial<PaymentDto>): Promise<PaymentDto> {
    const entity = createPaymentEntity(data as any);
    const saved = await this.paymentRepo.save(entity);
    return PaymentMapper.toDto(saved);
  }
}
