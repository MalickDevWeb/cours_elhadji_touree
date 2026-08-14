import React, { useState } from 'react';
import { Payment, Student } from '../../../types';
import { Check } from 'lucide-react';
import { SearchableSelect } from '../../shared/components/SearchableSelect';

interface AddPaymentFormProps {
  students: Student[];
  onAddPayment: (amount: number, studentId: string, method: Payment['method']) => void;
  onClose: () => void;
}

export function AddPaymentForm({ students, onAddPayment, onClose }: AddPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [studentId, setStudentId] = useState('');
  const [method, setMethod] = useState<Payment['method']>('WAVE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !studentId) return;
    onAddPayment(Number(amount), studentId, method);
    onClose();
  };

  return (
    <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 max-w-sm mx-auto text-xs">
      <h4 className="font-display font-bold text-slate-800 text-sm">Enregistrer un Paiement</h4>
      
      <div className="space-y-1">
        <label className="block font-semibold text-slate-600">Élève concerné</label>
        <SearchableSelect
          value={studentId}
          onChange={setStudentId}
          options={students.map(s => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }))}
          placeholder="Choisir l'élève"
          searchPlaceholder="Rechercher élève..."
          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block font-semibold text-slate-600">Montant (FCFA)</label>
        <input type="number" placeholder="Montant en FCFA" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold" required />
      </div>

      <div className="space-y-1">
        <label className="block font-semibold text-slate-600">Méthode de paiement</label>
        <select value={method} onChange={e => setMethod(e.target.value as Payment['method'])} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
          <option value="WAVE">Wave</option>
          <option value="ORANGE_MONEY">Orange Money</option>
          <option value="ESPECES">Espèces</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition">Annuler</button>
        <button type="submit" id="submit-add-pay-btn" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5" /> Confirmer</button>
      </div>
    </form>
  );
}
