import React, { useState } from 'react';
import { Search, Calendar, CreditCard, Clock } from 'lucide-react';
import { Payment, Student } from '../../../types';
import { PaymentMobileCard } from './PaymentMobileCard';
import { PaymentTableRow } from './PaymentTableRow';
import { PaymentProofModal } from './PaymentProofModal';

interface PaymentsListProps {
  payments: Payment[]; students: Student[]; onViewPdf: (paymentId: string) => void;
  onValidatePayment?: (id: string, status: 'VALIDE' | 'REFUSE') => void;
}

export function AdminPaymentsList({ payments, students, onViewPdf, onValidatePayment }: PaymentsListProps) {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TOUS' | 'EN_ATTENTE' | 'VALIDE' | 'REFUSE'>('TOUS');
  const [selectedProofPayment, setSelectedProofPayment] = useState<Payment | null>(null);

  const pendingCount = payments.filter(p => p.status === 'EN_ATTENTE').length;
  const filtered = payments.filter((p) => {
    const student = students.find((s) => s.id === p.studentId);
    const searchStr = `${student?.firstName || ''} ${student?.lastName || ''} ${p.reference}`.toLowerCase();
    const matchesSearch = searchStr.includes(search.toLowerCase());
    const matchesStart = !startDate || p.date >= startDate;
    const matchesEnd = !endDate || p.date <= endDate;
    const matchesStatus = statusFilter === 'TOUS' || (statusFilter === 'VALIDE' ? (p.status === 'VALIDE' || !p.status) : p.status === statusFilter);
    return matchesSearch && matchesStart && matchesEnd && matchesStatus;
  });

  const totalPeriodAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5 text-xs">
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
            <div><p className="font-bold text-xs">{pendingCount} paiement(s) mobile en attente de validation</p><p className="text-[10px] text-amber-700">Consultez la capture et validez pour mettre à jour la comptabilité.</p></div>
          </div>
          <button onClick={() => setStatusFilter(statusFilter === 'EN_ATTENTE' ? 'TOUS' : 'EN_ATTENTE')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-xl text-[10.5px] cursor-pointer">{statusFilter === 'EN_ATTENTE' ? 'Voir tous' : 'Voir en attente'}</button>
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:max-w-sm"><Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" /><input type="text" placeholder="Rechercher un règlement..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-xs" /></div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button onClick={() => setStatusFilter('TOUS')} className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${statusFilter === 'TOUS' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}>Tous ({payments.length})</button>
            <button onClick={() => setStatusFilter('EN_ATTENTE')} className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${statusFilter === 'EN_ATTENTE' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500'}`}>⏳ En attente ({pendingCount})</button>
            <button onClick={() => setStatusFilter('VALIDE')} className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${statusFilter === 'VALIDE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}>✓ Validés</button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3.5 border-t border-slate-100">
          <div className="space-y-2"><span className="font-bold text-slate-700 flex items-center gap-1.5 text-xs"><Calendar className="w-4 h-4 text-sky-500" /> Période</span>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:border-sky-500 outline-none text-xs w-[140px]" /><span className="text-slate-400 font-medium">à</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:border-sky-500 outline-none text-xs w-[140px]" />
              {(startDate || endDate) && <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-rose-500 font-bold hover:text-rose-600 transition ml-2 text-xs">Vider</button>}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/60 px-4 py-2.5 rounded-2xl w-full lg:w-auto"><CreditCard className="w-5 h-5 text-sky-500 shrink-0" />
            <div><p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Filtré</p><p className="font-extrabold text-slate-800 text-xs font-mono">{totalPeriodAmount.toLocaleString()} FCFA <span className="text-slate-500 font-sans font-normal ml-1">({filtered.length} reçu{filtered.length > 1 ? 's' : ''})</span></p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((p) => <PaymentMobileCard key={p.id} payment={p} student={students.find((s) => s.id === p.studentId)} onViewPdf={onViewPdf} onValidatePayment={onValidatePayment} onOpenProof={setSelectedProofPayment} />)}
        {filtered.length === 0 && <p className="text-center py-6 text-slate-400 italic">Aucun règlement trouvé.</p>}
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Référence & Date</th><th className="p-4">Élève</th><th className="p-4">Montant</th><th className="p-4">Méthode & Statut</th><th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((p) => <PaymentTableRow key={p.id} payment={p} student={students.find((s) => s.id === p.studentId)} onViewPdf={onViewPdf} onValidatePayment={onValidatePayment} onOpenProof={setSelectedProofPayment} />)}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProofPayment && <PaymentProofModal payment={selectedProofPayment} student={students.find(s => s.id === selectedProofPayment.studentId)} onValidate={(id, st) => onValidatePayment?.(id, st)} onClose={() => setSelectedProofPayment(null)} />}
    </div>
  );
}
