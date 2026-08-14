import React from 'react';
import { Printer, Receipt, Eye, Check, X } from 'lucide-react';
import { Payment, Student } from '../../../types';

interface PaymentMobileCardProps {
  payment: Payment; student?: Student; onViewPdf: (paymentId: string) => void;
  onValidatePayment?: (id: string, status: 'VALIDE' | 'REFUSE') => void;
  onOpenProof?: (payment: Payment) => void;
}

export const PaymentMobileCard: React.FC<PaymentMobileCardProps> = ({
  payment, student, onViewPdf, onValidatePayment, onOpenProof
}) => {
  const isPending = payment.status === 'EN_ATTENTE';
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-3.5 text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-slate-400" />
          <span className="font-mono font-bold text-slate-500">{payment.reference}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${payment.method === 'ESPECES' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>{payment.method}</span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${payment.status === 'VALIDE' || !payment.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : payment.status === 'REFUSE' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'}`}>
            {payment.status === 'VALIDE' || !payment.status ? '✓ Validé' : payment.status === 'REFUSE' ? '✕ Refusé' : '⏳ En attente'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <p className="text-slate-500 text-[10px] font-semibold uppercase">Élève</p>
          <p className="font-bold text-slate-800 text-sm">{student ? `${student.firstName} ${student.lastName}` : 'Inconnu'}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-[10px] font-semibold uppercase">Date</p>
          <p className="text-slate-600 font-medium">{payment.date}</p>
        </div>
        <div className="flex justify-between items-center pt-1">
          <p className="text-slate-500 text-[10px] font-semibold uppercase">Montant</p>
          <p className="font-extrabold text-slate-900 text-sm font-mono">{payment.amount.toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {(payment.proofUrl || payment.transactionNote) && (
          <button onClick={() => onOpenProof?.(payment)} className="flex-1 flex items-center justify-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 py-2 rounded-xl transition font-bold text-[10.5px] cursor-pointer border border-sky-200">
            <Eye className="w-3.5 h-3.5" /> <span>Preuve</span>
          </button>
        )}
        {isPending && onValidatePayment && (
          <>
            <button onClick={() => onValidatePayment(payment.id, 'VALIDE')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl transition font-bold text-[10.5px] cursor-pointer flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" /> <span>Valider</span>
            </button>
            <button onClick={() => onValidatePayment(payment.id, 'REFUSE')} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl transition font-bold text-[10.5px] cursor-pointer flex items-center justify-center gap-1">
              <X className="w-3.5 h-3.5" /> <span>Refuser</span>
            </button>
          </>
        )}
        <button onClick={() => onViewPdf(payment.id)} className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl transition font-bold text-[10.5px] cursor-pointer border border-slate-200/60">
          <Printer className="w-3.5 h-3.5 text-slate-500" /> <span>PDF</span>
        </button>
      </div>
    </div>
  );
};

