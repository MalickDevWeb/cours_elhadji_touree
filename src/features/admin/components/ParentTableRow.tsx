import React from 'react';
import { Edit, UserPlus, Check, X, MessageCircle, Mail, BellOff } from 'lucide-react';
import { Parent, Student } from '../../../types';
import { getWhatsAppLink, generateResetPinWhatsAppMsg, generateRandomPin } from '../../shared/utils/whatsappHelper';
import { mockDb } from '../../shared/infrastructure/mockDb';

interface ParentTableRowProps {
  parent: Parent; students: Student[]; isEditing: boolean; isAssociating: boolean;
  editForm: { fullName: string; phone: string; whatsapp: string; address: string; email?: string };
  setEditForm: (form: any) => void; selectedStudentId: string; setSelectedStudentId: (id: string) => void;
  onEdit: () => void; onSave: () => void; onCancelEdit: () => void;
  onStartAssociate: () => void; onCancelAssociate: () => void; onAssociate: () => void;
  onToggleEmailNotifs?: () => void;
}

export const ParentTableRow: React.FC<ParentTableRowProps> = ({
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
      const parents = mockDb.getParents();
      mockDb.saveParents(parents.map(p => p.id === parent.id ? { ...p, pin } : p));
    }
    const msg = generateResetPinWhatsAppMsg(parent.fullName, parent.phone, pin);
    window.open(getWhatsAppLink(parent.whatsapp || parent.phone, msg), '_blank');
  };

  return (
    <tr className="hover:bg-slate-50/50 text-xs">
      <td className="p-4">
        {isEditing ? <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="p-1.5 border border-slate-200 rounded-lg w-full font-bold" /> : <span className="font-bold text-slate-800">{parent.fullName}</span>}
      </td>
      <td className="p-4 space-y-1">
        {isEditing ? (
          <div className="space-y-1">
            <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="p-1 border border-slate-200 rounded-lg text-[11px] w-full" placeholder="Téléphone" />
            <input type="text" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="p-1 border border-slate-200 rounded-lg text-[11px] w-full" placeholder="E-mail (Brevo)" />
          </div>
        ) : (
          <div>
            <p className="text-slate-700 font-medium">Tél: {parent.phone}</p>
            <p className="text-slate-500 text-[10px] truncate max-w-[180px]">{parent.email || <span className="italic text-slate-400">Pas d'e-mail</span>}</p>
            {onToggleEmailNotifs && (
              <button onClick={onToggleEmailNotifs} title="Cliquer pour activer/désactiver les e-mails Brevo pour ce parent" className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition ${isEmailEnabled ? 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}>
                {isEmailEnabled ? <Mail className="w-2.5 h-2.5 text-sky-600" /> : <BellOff className="w-2.5 h-2.5 text-slate-400" />}
                <span>Brevo: {isEmailEnabled ? 'Actif' : 'Désactivé'}</span>
              </button>
            )}
          </div>
        )}
      </td>
      <td className="p-4">
        {isEditing ? <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="p-1.5 border border-slate-200 rounded-lg w-full text-slate-500" /> : <span className="text-slate-500">{parent.address}</span>}
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {myKids.map((k) => <span key={k.id} className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-semibold border border-sky-100">{k.firstName} {k.lastName}</span>)}
          {myKids.length === 0 && <span className="text-slate-400 text-[10px] italic">Aucun enfant</span>}
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {isEditing ? (
            <div className="flex items-center justify-center gap-1">
              <button onClick={onSave} title="Valider" className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"><Check className="w-3 h-3" /> Save</button>
              <button onClick={onCancelEdit} title="Annuler" className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-[10px] cursor-pointer"><X className="w-3 h-3" /></button>
            </div>
          ) : isAssociating ? (
            <div className="flex items-center gap-1">
              <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="p-1 border border-slate-200 rounded-lg text-[10px] bg-white outline-none">
                <option value="">Sélectionner</option>
                {students.filter((s) => s.parentId !== parent.id).map((s) => <option key={s.id} value={s.id}>{s.firstName}</option>)}
              </select>
              <button onClick={onAssociate} className="px-2 py-1 bg-sky-500 text-white rounded-lg font-bold text-[10px]">Lier</button>
              <button onClick={onCancelAssociate} className="p-1 text-slate-400"><X className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <>
              <button onClick={handleSendPinWhatsApp} title="Code secret WhatsApp" className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 cursor-pointer"><MessageCircle className="w-3.5 h-3.5" /></button>
              <button onClick={onEdit} title="Modifier" className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={onStartAssociate} title="Associer élève" className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 cursor-pointer"><UserPlus className="w-3.5 h-3.5" /></button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

