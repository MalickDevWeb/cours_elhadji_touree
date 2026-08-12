import React from 'react';
import { AlertTriangle, Printer, Eye, Check, X } from 'lucide-react';
import { Payment, Student } from '../../../types';

interface PaymentTableProps {
  payments: Payment[]; students: Student[]; overdueStudents: Student[];
  currentMonthName: string; onViewPdf: (paymentId: string) => void;
  onValidatePayment?: (paymentId: string, status: 'VALIDE' | 'REFUSE') => void;
  onOpenProof?: (payment: Payment) => void;
}

export function PaymentTable({
  payments, students, overdueStudents, currentMonthName, onViewPdf, onValidatePayment, onOpenProof
}: PaymentTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="p-4">Référence</th>
              <th className="p-4">Élève</th>
              <th className="p-4">Montant</th>
              <th className="p-4">Méthode & Statut</th>
              <th className="p-4 text-center">Preuve / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map(p => {
              const std = students.find(s => s.id === p.studentId);
              const currentlyLate = overdueStudents.some(os => os.id === p.studentId);
              const isPending = p.status === 'EN_ATTENTE';
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-mono font-bold text-slate-500">
                    <div>{p.reference}</div>
                    <div className="text-[10px] font-normal text-slate-400">{p.date}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    <div>
                      <span className="block font-bold text-slate-800">{std ? `${std.firstName} ${std.lastName}` : 'Inconnu'}</span>
                      {currentlyLate && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-[8px] font-extrabold px-1.5 py-0.2 rounded-md mt-0.5">
                          <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-rose-500" />
                          <span>Retard {currentMonthName}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{p.amount.toLocaleString()} FCFA</td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.method === 'ESPECES' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>
                        {p.method}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${p.status === 'VALIDE' || !p.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : p.status === 'REFUSE' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'}`}>
                        {p.status === 'VALIDE' || !p.status ? '✓ Validé' : p.status === 'REFUSE' ? '✕ Refusé' : '⏳ En attente'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {(p.proofUrl || p.transactionNote) && (
                        <button onClick={() => onOpenProof?.(p)} className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer">
                          <Eye className="w-3 h-3" /> Preuve
                        </button>
                      )}
                      {isPending && onValidatePayment && (
                        <>
                          <button onClick={() => onValidatePayment(p.id, 'VALIDE')} title="Valider le paiement" className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onValidatePayment(p.id, 'REFUSE')} title="Refuser le paiement" className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer shadow-xs">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button id={`print-pay-receipt-${p.id}`} onClick={() => onViewPdf(p.id)} className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl transition font-semibold text-[10px] cursor-pointer">
                        <Printer className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
