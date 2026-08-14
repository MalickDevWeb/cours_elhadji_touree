import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().min(1, "Identifiant d'élève requis"),
  month: z.string().min(2, "Mois requis (ex: Octobre 2025)"),
  amount: z.number().positive("Le montant doit être un nombre positif"),
  paidAt: z.string().optional(),
  status: z.enum(['PAYE', 'EN_ATTENTE', 'RETARD']).default('PAYE'),
  receiptNumber: z.string().optional()
});

export type PaymentInput = z.infer<typeof PaymentSchema>;

export function validatePayment(data: unknown): PaymentInput {
  return PaymentSchema.parse(data);
}
