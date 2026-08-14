import React, { useState } from 'react';
import { Search, Plus, CreditCard, AlertTriangle, Calendar } from 'lucide-react';
import { Payment, Student, Parent, Level } from '../../../types';
import { OverdueAlertBanner } from './OverdueAlertBanner';
import { PaymentAddFormInline } from './PaymentAddFormInline';
import { PaymentTable } from './PaymentTable';

interface PaymentsProps {
  payments: Payment[]; students: Student[]; parents?: Parent[]; levels?: Level[];
  onAddPayment: (amount: number, studentId: string, method: Payment['method']) => Payment | undefined;
  onViewPdf: (paymentId: string) => void;
}

export const AdminPayments: React.FC<PaymentsProps> = ({ payments, students, parents = [], levels = [], onAddPayment, onViewPdf }) => {
  const [showAdd, setShowAdd] = useState(false); const [studentId, setStudentId] = useState('');
  const [search, setSearch] = useState(''); const [showOverdueAlertPanel, setShowOverdueAlertPanel] = useState(true);
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');

  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonthName = `${['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][new Date().getMonth()]} ${new Date().getFullYear()}`;

  const overdueStudents = students.filter(student => !payments.some(p => p.studentId === student.id && p.date.startsWith(currentMonthStr)));

  const handleQuickRegister = (id: string) => { setStudentId(id); setShowAdd(true); };

  const filtered = payments.filter(p => {
    const student = students.find(s => s.id === p.studentId);
    const searchStr = `${student?.firstName || ''} ${student?.lastName || ''} ${p.reference}`.toLowerCase();
    return searchStr.includes(search.toLowerCase()) && (!startDate || p.date >= startDate) && (!endDate || p.date <= endDate);
  });

  const totalPeriodAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 text-xs">
      {overdueStudents.length > 0 && showOverdueAlertPanel && (
        <OverdueAlertBanner overdueStudents={overdueStudents} currentMonthName={currentMonthName} levels={levels} parents={parents} onSelectStudent={handleQuickRegister} onClose={() => setShowOverdueAlertPanel(false)} />
      )}

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input id="search-payment-input" type="text" placeholder="Rechercher par élève, reçu..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-xs" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {overdueStudents.length > 0 && (
              <button id="toggle-overdue-alert-dashboard-btn" onClick={() => setShowOverdueAlertPanel(!showOverdueAlertPanel)} className={`flex items-center gap-1.5 font-bold px-4 py-2.5 rounded-xl border text-xs cursor-pointer ${showOverdueAlertPanel ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                <AlertTriangle className="w-4 h-4 shrink-0" /><span>Retards ({overdueStudents.length})</span>
              </button>
            )}
            <button id="show-add-pay-btn" onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer">
              <Plus className="w-4 h-4" /> Enregistrer un Paiement
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <span className="font-bold text-slate-700 text-xs flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> Période :</span>
            <div className="flex items-center gap-2">
              <input id="filter-payment-start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none" />
              <input id="filter-payment-end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none" />
              {(startDate || endDate) && <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-rose-500 font-bold text-[10px]">Vider</button>}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
            <CreditCard className="w-4 h-4 text-sky-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Période</p>
              <p className="text-sm font-extrabold text-slate-800 font-mono">{totalPeriodAmount.toLocaleString()} FCFA ({filtered.length} reçu{filtered.length > 1 ? 's' : ''})</p>
            </div>
          </div>
        </div>
      </div>

      {showAdd && <PaymentAddFormInline students={students} overdueStudents={overdueStudents} studentId={studentId} setStudentId={setStudentId} onAddPayment={onAddPayment} onClose={() => setShowAdd(false)} />}
      <PaymentTable payments={filtered} students={students} overdueStudents={overdueStudents} currentMonthName={currentMonthName} onViewPdf={onViewPdf} />
    </div>
  );
};
