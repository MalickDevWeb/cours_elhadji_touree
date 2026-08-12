import { CreditCard, Check, Clock, Printer, ShieldAlert } from 'lucide-react';
import { Payment } from '../../../../types';

interface StudentFinanceProps {
  finance: {
    monthly: number;
    remains: number;
    pendingSum?: number;
    limitDate: string;
    status: 'PAID' | 'UNPAID' | 'PENDING_APPROVAL';
    history: Payment[];
  };
  onOpenPay: () => void;
  onViewReceiptPdf: (payId: string) => void;
}

export function StudentFinance({ finance, onOpenPay, onViewReceiptPdf }: StudentFinanceProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-left select-none text-xs">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-500" /> Frais & Scolarité
        </h3>
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
          finance.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : finance.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-rose-50 text-rose-600'
        }`}>
          {finance.status === 'PAID' ? 'À JOUR' : finance.status === 'PENDING_APPROVAL' ? 'VALIDATION EN COURS' : 'IMPAYÉ'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
        <div>
          <span className="text-[9px] text-slate-400 block font-bold">Frais Mensuels</span>
          <p className="text-sm font-black text-slate-700 font-mono">{finance.monthly.toLocaleString()} FCFA</p>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 block font-bold">Reste à payer</span>
          <p className={`text-sm font-black font-mono ${finance.remains > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {finance.remains.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {(finance.pendingSum || 0) > 0 && (
        <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-[10.5px] font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600 shrink-0 animate-spin" />
          <span>Paiement de <strong>{(finance.pendingSum || 0).toLocaleString()} FCFA</strong> soumis et en cours de validation par l'administration.</span>
        </div>
      )}

      {finance.remains > 0 ? (
        <button
          onClick={onOpenPay}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
        >
          <CreditCard className="w-4 h-4" /> 💳 Effectuer un paiement Wave / OM
        </button>
      ) : (
        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-[10.5px] border border-emerald-100 flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-500" /> Aucun solde débiteur pour ce mois.
        </div>
      )}

      {finance.history && finance.history.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Historique des règlements</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {finance.history.map(p => (
              <div key={p.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-[10.5px]">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span>{p.amount.toLocaleString()} FCFA</span>
                    <span className="text-[9px] font-semibold text-sky-600">({p.method})</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400 block font-mono">{p.date} - Réf: {p.reference}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                    p.status === 'VALIDE' || !p.status ? 'bg-emerald-100 text-emerald-800' : p.status === 'REFUSE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status === 'VALIDE' || !p.status ? '✓ Validé' : p.status === 'REFUSE' ? '✕ Refusé' : '⏳ En attente'}
                  </span>
                  {(p.status === 'VALIDE' || !p.status) && (
                    <button onClick={() => onViewReceiptPdf(p.id)} className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer" title="Reçu PDF">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
