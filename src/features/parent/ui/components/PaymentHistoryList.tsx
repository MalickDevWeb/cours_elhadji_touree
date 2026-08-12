import React from 'react';
import { History, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Payment, Student } from '../../../../types';

interface PaymentHistoryListProps {
  payments: Payment[];
  students: Student[];
  activeStudentId?: string;
  onViewReceiptPdf?: (paymentId: string) => void;
}

export function PaymentHistoryList({ payments, students, activeStudentId, onViewReceiptPdf }: PaymentHistoryListProps) {
  const filtered = payments.filter(p => activeStudentId ? p.studentId === activeStudentId : students.some(s => s.id === p.studentId));

  const getStudentName = (sId: string) => {
    const st = students.find(s => s.id === sId);
    return st ? `${st.firstName} ${st.lastName}` : 'Élève';
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-sky-500" /> Historique des Paiements ({filtered.length})
        </h3>
        <span className="text-[10px] text-slate-400 font-medium">Récapitulatif des reçus & virements</span>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          Aucun historique de paiement enregistré pour le moment.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => {
            const status = p.status || 'VALIDE';
            return (
              <div key={p.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{getStudentName(p.studentId)}</span>
                    <span className="px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-slate-200/70 text-slate-700">{p.method}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                    <span>Date: {p.date}</span>
                    <span>•</span>
                    <span>Réf: {p.reference}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/40">
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm">{p.amount.toLocaleString('fr-FR')} FCFA</span>
                    <div className="flex justify-end mt-0.5">
                      {status === 'VALIDE' && <span className="text-[9.5px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Validé</span>}
                      {status === 'EN_ATTENTE' && <span className="text-[9.5px] font-bold text-amber-600 flex items-center gap-1"><Clock className="w-3 h-3 animate-pulse" /> En attente</span>}
                      {status === 'REFUSE' && <span className="text-[9.5px] font-bold text-red-600 flex items-center gap-1"><XCircle className="w-3 h-3" /> Refusé</span>}
                    </div>
                  </div>

                  {onViewReceiptPdf && status === 'VALIDE' && (
                    <button onClick={() => onViewReceiptPdf(p.id)} className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-bold transition flex items-center gap-1 text-[10.5px] border border-sky-200 cursor-pointer">
                      <FileText className="w-3.5 h-3.5" /> Reçu PDF
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
