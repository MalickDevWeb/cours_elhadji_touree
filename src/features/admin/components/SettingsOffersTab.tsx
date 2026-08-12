import React, { useState } from 'react';
import { Plus, Trash2, Tag, Clock } from 'lucide-react';
import { CourseOffer, Subject, Level } from '../../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface OffersProps {
  offers: CourseOffer[];
  onUpdateOffers: (o: CourseOffer[]) => void;
  subjects: Subject[];
  levels: Level[];
}

export const SettingsOffersTab: React.FC<OffersProps> = ({ offers, onUpdateOffers, subjects, levels }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', subId: '', lvlId: '', type: 'GROUPE' as 'GROUPE' | 'INDIVIDUEL', price: '', duration: '2h / session', desc: '' });
  const [offerToDelete, setOfferToDelete] = useState<CourseOffer | null>(null);

  const handleAdd = () => {
    if (!form.name.trim() || !form.price || !form.subId || !form.lvlId) return;
    const newOffer: CourseOffer = {
      id: `off-${Date.now()}`, name: form.name.trim(), subjectId: form.subId, levelId: form.lvlId,
      type: form.type, price: Number(form.price), duration: form.duration, description: form.desc.trim()
    };
    onUpdateOffers([...offers, newOffer]);
    setForm({ name: '', subId: '', lvlId: '', type: 'GROUPE', price: '', duration: '2h / session', desc: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      <div className="flex justify-between items-center">
        <span className="block font-bold text-slate-600">Offres & Formules actives :</span>
        <button type="button" onClick={() => setShowAdd(!showAdd)} className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer hover:bg-slate-800 transition">
          <Plus className="w-3 h-3" /> {showAdd ? 'Fermer' : 'Nouvelle Offre'}
        </button>
      </div>

      {showAdd && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom de l'offre (ex: Math 3e)" className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-semibold" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700">
              <option value="GROUPE">Petit Groupe (Salle)</option>
              <option value="INDIVIDUEL">Suivi Solo (Domicile)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={form.subId} onChange={e => setForm({ ...form, subId: e.target.value })} className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-semibold">
              <option value="">Matière...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={form.lvlId} onChange={e => setForm({ ...form, lvlId: e.target.value })} className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-semibold">
              <option value="">Niveau...</option>
              {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Tarif (FCFA)" className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-semibold" />
            <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Durée (ex: 2h)" className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-semibold" />
          </div>
          <input type="text" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Description courte de l'offre" className="w-full p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-semibold" />
          <button type="button" onClick={handleAdd} className="w-full p-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] transition cursor-pointer">Créer l'Offre</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-1">
        {offers.map(o => (
          <div key={o.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-center gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase ${o.type === 'INDIVIDUEL' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{o.type === 'INDIVIDUEL' ? 'Solo' : 'Groupe'}</span>
                <span className="text-[7px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-bold uppercase">{levels.find(l => l.id === o.levelId)?.name || 'Niveau'}</span>
              </div>
              <h5 className="font-bold text-slate-800 text-[10px] truncate">{o.name}</h5>
              <p className="text-[8px] text-slate-400 leading-tight truncate">{o.description}</p>
              <div className="flex gap-3 text-[8px] text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Tag className="w-2.5 h-2.5 text-slate-400" /> {o.price.toLocaleString()} FCFA</span>
                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5 text-slate-400" /> {o.duration}</span>
              </div>
            </div>
            <button type="button" onClick={() => setOfferToDelete(o)} className="text-slate-400 hover:text-red-500 p-1.5 transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <DeleteConfirmModal
        isOpen={!!offerToDelete}
        onClose={() => setOfferToDelete(null)}
        onConfirm={() => { onUpdateOffers(offers.filter(f => f.id !== offerToDelete?.id)); setOfferToDelete(null); }}
        itemName={offerToDelete?.name}
        title="Supprimer l'offre"
      />
    </div>
  );
};
