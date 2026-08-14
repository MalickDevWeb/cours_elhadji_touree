import React from 'react';
import { Printer, Eye, Check, X } from 'lucide-react';
import { Payment, Student } from '../../../types';

interface PaymentTableRowProps {
  payment: Payment;
  student?: Student;
  onViewPdf: (paymentId: string) => void;
  onValidatePayment?: (id: string, status: 'VALIDE' | 'REFUSE') => void;
  onOpenProof?: (payment: Payment) => void;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment, student, onViewPdf, onValidatePayment, onOpenProof
}) => {
  const isPending = payment.status === 'EN_ATTENTE';
  return (
    <tr className="hover:bg-slate-50/50 transition text-xs">
      <td className="p-3 font-mono font-bold text-slate-500">
        <div>{payment.reference}</div>
        <div className="text-[10px] text-slate-400 font-normal">{payment.date}</div>
      </td>
      <td className="p-3 font-semibold text-slate-800">
        {student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}
      </td>
      <td className="p-3 font-bold text-slate-800">{payment.amount.toLocaleString()} FCFA</td>
      <td className="p-3 space-y-1">
        <div className="flex items-center gap-1">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${payment.method === 'ESPECES' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>
            {payment.method}
          </span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${payment.status === 'VALIDE' || !payment.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : payment.status === 'REFUSE' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'}`}>
            {payment.status === 'VALIDE' || !payment.status ? '✓ Validé' : payment.status === 'REFUSE' ? '✕ Refusé' : '⏳ En attente'}
          </span>
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {(payment.proofUrl || payment.transactionNote) && (
            <button onClick={() => onOpenProof?.(payment)} className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer">
              <Eye className="w-3 h-3" /> Preuve
            </button>
          )}
          {isPending && onValidatePayment && (
            <>
              <button onClick={() => onValidatePayment(payment.id, 'VALIDE')} title="Valider" className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onValidatePayment(payment.id, 'REFUSE')} title="Refuser" className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer shadow-xs">
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button onClick={() => onViewPdf(payment.id)} className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl transition font-semibold text-[10px] cursor-pointer">
            <Printer className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </td>
    </tr>
  );
};

