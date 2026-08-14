export interface PaymentDto {
  id: string;
  studentId: string;
  month: string;
  amount: number;
  date: string;
  status: string;
  method: string;
  receiptNumber: string;
}
