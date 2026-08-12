import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Payment, Student, Parent, Level } from '../../../types';
import { AddPaymentForm } from './AddPaymentForm';
import { FinanceOverdueBanner } from './FinanceOverdueBanner';
import { AdminPaymentsList } from './AdminPaymentsList';
import { TreasuryReportCard } from './TreasuryReportCard';

interface AdminFinanceSectionProps {
  payments: Payment[];
  students: Student[];
  parents: Parent[];
  levels: Level[];
  onAddPayment: (amount: number, studentId: string, method: Payment['method']) => void;
  onViewPdf: (paymentId: string) => void;
  onValidatePayment?: (paymentId: string, status: 'VALIDE' | 'REFUSE') => void;
}

export function AdminFinanceSection({
  payments,
  students,
  parents,
  levels,
  onAddPayment,
  onViewPdf,
  onValidatePayment,
}: AdminFinanceSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState('');

  // 1. Calculations - count validated payments or legacy payments without status
  const totalRevenus = useMemo(() => {
    return payments
      .filter(p => p.status === 'VALIDE' || !p.status)
      .reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);
  const totalSalaires = 1500000;
  const benefice = totalRevenus - totalSalaires;

  // 2. Overdue calculations
  const currentMonthStr = '2026-07';
  const overdueStudents = useMemo(() => {
    return students.filter((s) => !payments.some((p) => p.studentId === s.id && (p.status === 'VALIDE' || !p.status) && p.date.startsWith(currentMonthStr)));
  }, [students, payments]);

  const handleOpenAddForStudent = (studentId: string) => {
    setTargetStudentId(studentId);
    setShowAdd(true);
  };

  return (
    <div className="space-y-6 text-xs">
      <TreasuryReportCard
        totalRevenus={totalRevenus}
        totalSalaires={totalSalaires}
        benefice={benefice}
      />

      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-800 text-base">Transactions & Facturation</h3>
        <button
          onClick={() => { setTargetStudentId(''); setShowAdd(true); }}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Enregistrer un Paiement
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center z-50 p-4 overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
          <AddPaymentForm
            students={students}
            onAddPayment={onAddPayment}
            onClose={() => setShowAdd(false)}
          />
        </div>
      )}

      {/* Overdue alert banner */}
      <FinanceOverdueBanner
        overdueStudents={overdueStudents}
        parents={parents}
        levels={levels}
        onAddClick={handleOpenAddForStudent}
      />

      {/* Main transactions list */}
      <AdminPaymentsList
        payments={payments}
        students={students}
        onViewPdf={onViewPdf}
        onValidatePayment={onValidatePayment}
      />
    </div>
  );
}
