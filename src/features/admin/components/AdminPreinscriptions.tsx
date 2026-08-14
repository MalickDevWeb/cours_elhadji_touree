import React from 'react';
import { Clock, Check, User, Phone, MapPin, BookOpen, AlertCircle, MessageCircle } from 'lucide-react';
import { Preinscription, Level, Subject } from '../../../types';
import { ApprovedPreinscriptionMobileCard } from './ApprovedPreinscriptionMobileCard';
import { getWhatsAppLink, generateApprovalWhatsAppMsg, generateRandomPin } from '../../shared/utils/whatsappHelper';

interface PreinscriptionsProps {
  preinscriptions: Preinscription[]; levels: Level[]; subjects: Subject[]; onApprove: (id: string) => void;
}

export const AdminPreinscriptions: React.FC<PreinscriptionsProps> = ({
  preinscriptions, levels, subjects, onApprove
}) => {
  const pending = preinscriptions.filter(p => p.status === 'EN_ATTENTE');
  const approved = preinscriptions.filter(p => p.status === 'CONFIRMEE');

  const handleApproveAndSendWhatsApp = (p: Preinscription) => {
    const pin = (p.parentPin && p.parentPin.length === 4) ? p.parentPin : generateRandomPin();
    onApprove(p.id);
    const levelName = levels.find(l => l.id === p.levelId)?.name || '';
    const studentName = `${p.studentFirstName} ${p.studentLastName}`;
    const msg = generateApprovalWhatsAppMsg(p.parentName, studentName, p.parentPhone, pin, levelName);
    const url = getWhatsAppLink(p.parentWhatsapp || p.parentPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h3 className="font-display font-bold text-slate-800 text-lg">Inscriptions en Attente</h3>
        <p className="text-slate-400 text-[10px]">Modérez et approuvez les demandes des parents d'élèves.</p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-1">
          <AlertCircle className="w-6 h-6 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">Aucune demande en attente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pending.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display font-bold text-slate-800 text-sm">{p.studentFirstName} {p.studentLastName}</h4>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{levels.find(l => l.id === p.levelId)?.name}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</span>
                </div>
                <div className="space-y-1 pt-1.5 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-400" /> <span>Parent : {p.parentName}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> <span>{p.parentPhone}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{p.parentAddress}</span></div>
                  <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> <span>{p.subjectIds.map(id => subjects.find(s => s.id === id)?.name).join(', ')}</span></div>
                </div>
              </div>
              <button id={`approve-btn-${p.id}`} onClick={() => handleApproveAndSendWhatsApp(p)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
                <Check className="w-4 h-4" /> Valider & Envoyer WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-3 pt-4">
          <h4 className="font-display font-semibold text-slate-700 text-xs uppercase">Historique des Demandes Validées ({approved.length})</h4>
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {approved.map(p => <ApprovedPreinscriptionMobileCard key={p.id} preinscription={p} levelName={levels.find(l => l.id === p.levelId)?.name} />)}
          </div>
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
                  <th className="p-3">Élève</th><th className="p-3">Parent</th><th className="p-3">Classe</th><th className="p-3">Date</th><th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {approved.map(p => (
                  <tr key={p.id} className="text-slate-600 hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{p.studentFirstName} {p.studentLastName}</td>
                    <td className="p-3">{p.parentName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-sky-50 text-sky-600 font-semibold">{levels.find(l => l.id === p.levelId)?.name}</span></td>
                    <td className="p-3 text-[10px] text-slate-400">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1"><Check className="w-3 h-3" /> Validé</span>
                        <button onClick={() => handleApproveAndSendWhatsApp(p)} title="Renvoyer identifiants WhatsApp" className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
