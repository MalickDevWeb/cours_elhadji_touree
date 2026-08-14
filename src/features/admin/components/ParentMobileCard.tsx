import React from 'react';
import { Edit, UserPlus, Check, X, Phone, MessageCircle, Mail, BellOff } from 'lucide-react';
import { Parent, Student } from '../../../types';
import { getWhatsAppLink, generateResetPinWhatsAppMsg, generateRandomPin } from '../../shared/utils/whatsappHelper';
import { mockDb } from '../../shared/infrastructure/mockDb';

interface ParentMobileCardProps {
  parent: Parent; students: Student[]; isEditing: boolean; isAssociating: boolean;
  editForm: { fullName: string; phone: string; whatsapp: string; address: string; email?: string };
  setEditForm: (form: any) => void; selectedStudentId: string;
  setSelectedStudentId: (id: string) => void; onEdit: () => void; onSave: () => void;
  onCancelEdit: () => void; onStartAssociate: () => void; onCancelAssociate: () => void; onAssociate: () => void;
  onToggleEmailNotifs?: () => void;
}

export const ParentMobileCard: React.FC<ParentMobileCardProps> = ({
  parent, students, isEditing, isAssociating, editForm, setEditForm,
  selectedStudentId, setSelectedStudentId, onEdit, onSave, onCancelEdit,
  onStartAssociate, onCancelAssociate, onAssociate, onToggleEmailNotifs,
}) => {
  const myKids = students.filter((s) => s.parentId === parent.id);
  const isEmailEnabled = parent.emailNotificationsEnabled !== false;

  const handleSendPinWhatsApp = () => {
    let pin = parent.pin;
    if (!pin || pin.length !== 4) {
      pin = generateRandomPin();
      mockDb.saveParents(mockDb.getParents().map(p => p.id === parent.id ? { ...p, pin } : p));
    }
    const msg = generateResetPinWhatsAppMsg(parent.fullName, parent.phone, pin);
    window.open(getWhatsAppLink(parent.whatsapp || parent.phone, msg), '_blank');
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-3 hover:border-indigo-200 transition-all text-xs">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <div className="space-y-1 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nom Complet</label>
            <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="p-2 border border-slate-200 rounded-xl w-full font-bold text-slate-800" />
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div><h4 className="font-bold text-slate-800 text-sm">{parent.fullName}</h4><span className="text-[10px] font-medium text-slate-400">ID: {parent.id}</span></div>
            {onToggleEmailNotifs && (
              <button onClick={onToggleEmailNotifs} title="Basculer statut Brevo" className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer ${isEmailEnabled ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                {isEmailEnabled ? <Mail className="w-3 h-3 text-sky-600" /> : <BellOff className="w-3 h-3 text-slate-400" />}
                <span>Brevo: {isEmailEnabled ? 'ON' : 'OFF'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-50/50 p-2.5 rounded-xl space-y-2">
        {isEditing ? (
          <div className="space-y-1.5">
            <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="p-1.5 border border-slate-200 rounded-lg text-xs w-full" placeholder="Téléphone" />
            <input type="text" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="p-1.5 border border-slate-200 rounded-lg text-xs w-full" placeholder="E-mail (optionnel)" />
            <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="p-1.5 border border-slate-200 rounded-lg text-xs w-full" placeholder="Adresse" />
          </div>
        ) : (
          <div className="space-y-1 text-[11px]">
            <p className="text-slate-700 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>Tél: {parent.phone}</span></p>
            <p className="text-slate-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>{parent.email || <span className="italic text-slate-400">Pas d'e-mail</span>}</span></p>
            <p className="text-slate-500">Adresse: {parent.address}</p>
          </div>
        )}
      </div>

      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">Enfants associés:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {myKids.map((k) => <span key={k.id} className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-semibold border border-sky-100">{k.firstName} {k.lastName}</span>)}
          {myKids.length === 0 && <span className="text-slate-400 italic">Aucun enfant associé</span>}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
        {isEditing ? (
          <div className="flex items-center justify-end gap-2 w-full">
            <button onClick={onSave} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs cursor-pointer"><Check className="w-4 h-4" /> Enregistrer</button>
            <button onClick={onCancelEdit} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs cursor-pointer"><X className="w-4 h-4" /> Annuler</button>
          </div>
        ) : isAssociating ? (
          <div className="flex items-center gap-1.5 w-full">
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="flex-1 p-2 border border-slate-200 rounded-xl text-xs bg-white outline-none">
              <option value="">Sélectionner l'élève</option>
              {students.filter((s) => s.parentId !== parent.id).map((s) => <option key={s.id} value={s.id}>{s.firstName}</option>)}
            </select>
            <button onClick={onAssociate} className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs">Lier</button>
            <button onClick={onCancelAssociate} className="p-1.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200"><X className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 w-full">
            <button onClick={handleSendPinWhatsApp} className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl font-bold text-[10px]"><MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp</button>
            <button onClick={onEdit} className="flex items-center justify-center gap-1 bg-slate-100 text-slate-700 py-2 rounded-xl font-bold text-[10px]"><Edit className="w-3.5 h-3.5" /> Modifier</button>
            <button onClick={onStartAssociate} className="flex items-center justify-center gap-1 bg-indigo-50 text-indigo-600 py-2 rounded-xl font-bold text-[10px]"><UserPlus className="w-3.5 h-3.5" /> Associer</button>
          </div>
        )}
      </div>
    </div>
  );
};

