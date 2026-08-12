import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Payment, Student } from '../../../types';
import { SearchableSelect } from '../../shared/components/SearchableSelect';

interface PaymentAddFormInlineProps {
  students: Student[];
  overdueStudents: Student[];
  studentId: string;
  setStudentId: (id: string) => void;
  onAddPayment: (amount: number, studentId: string, method: Payment['method']) => void;
  onClose: () => void;
}

export function PaymentAddFormInline({
  students, overdueStudents, studentId, setStudentId, onAddPayment, onClose
}: PaymentAddFormInlineProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Payment['method']>('WAVE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !studentId) return;
    onAddPayment(Number(amount), studentId, method);
    onClose();
  };

  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4 max-w-sm mx-auto animate-in zoom-in-95 duration-200 text-xs">
      <h4 className="font-display font-bold text-slate-800 text-sm">Nouveau Paiement</h4>
      
      <div className="space-y-1">
        <label className="block font-bold text-slate-700">Élève concerné</label>
        <SearchableSelect
          value={studentId}
          onChange={setStudentId}
          options={students.map(s => {
            const isLate = overdueStudents.some(os => os.id === s.id);
            return {
              value: s.id,
              label: `${s.firstName} ${s.lastName} ${isLate ? '⚠️ (En retard ce mois)' : '✓ (À jour)'}`
            };
          })}
          placeholder="Sélectionner l'élève"
          searchPlaceholder="Rechercher élève..."
          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block font-bold text-slate-700">Montant (FCFA)</label>
        <input type="number" placeholder="Montant en FCFA" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-500 transition font-mono font-bold" required />
      </div>

      <div className="space-y-1">
        <label className="block font-bold text-slate-700">Méthode de paiement</label>
        <select value={method} onChange={e => setMethod(e.target.value as Payment['method'])} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:border-sky-500 outline-none transition font-medium">
          <option value="WAVE">Wave</option>
          <option value="ORANGE_MONEY">Orange Money</option>
          <option value="ESPECES">Espèces</option>
        </select>
      </div>

      <button type="submit" id="submit-add-pay-btn" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5">
        <Check className="w-4 h-4" /> Enregistrer le Paiement
      </button>
    </form>
  );
}
