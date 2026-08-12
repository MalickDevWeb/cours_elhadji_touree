import React, { useState } from 'react';
import { Check, MessageSquare, Send } from 'lucide-react';
import { Student } from '../../../types';

interface StudentRowProps {
  student: Student; currentStatus?: 'PRESENT' | 'ABSENT' | 'RETARD'; currentJustification?: string;
  onUpdateStatus: (status: 'PRESENT' | 'ABSENT' | 'RETARD', justification?: string) => void;
  onAddObservation: (text: string) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({
  student, currentStatus, currentJustification = '', onUpdateStatus, onAddObservation
}) => {
  const [showObsForm, setShowObsForm] = useState(false);
  const [obsText, setObsText] = useState('');
  const [showJustify, setShowJustify] = useState(false);
  const [justifyText, setJustifyText] = useState(currentJustification);

  const handleSendObs = () => { if (!obsText.trim()) return; onAddObservation(obsText.trim()); setObsText(''); setShowObsForm(false); };
  const handleSendJustify = () => { if (currentStatus) { onUpdateStatus(currentStatus, justifyText.trim()); setShowJustify(false); } };

  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-[11px]">{student.firstName} {student.lastName}</h4>
            <p className="text-[9px] text-slate-400 font-semibold">Carte : SEN-2026-{student.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { status: 'PRESENT', label: 'Présent', color: 'bg-emerald-500 text-white' },
            { status: 'ABSENT', label: 'Absent', color: 'bg-rose-500 text-white' },
            { status: 'RETARD', label: 'Retard', color: 'bg-amber-500 text-white' },
          ].map(btn => (
            <button key={btn.status} onClick={() => onUpdateStatus(btn.status as any, justifyText)} className={`px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer ${currentStatus === btn.status ? btn.color : 'hover:bg-slate-50 text-slate-400 border border-slate-200'}`}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 text-[10px] pt-1">
        <button onClick={() => setShowObsForm(!showObsForm)} className="text-slate-500 font-bold hover:text-amber-600 flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg cursor-pointer"><MessageSquare className="w-3.5 h-3.5" /> Remarque</button>
        {(currentStatus === 'ABSENT' || currentStatus === 'RETARD') && (
          <button onClick={() => setShowJustify(!showJustify)} className="text-slate-500 font-bold hover:text-amber-600 flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg cursor-pointer">✏️ Justifier {currentJustification && '✅'}</button>
        )}
      </div>

      {showJustify && (
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center gap-2">
          <input type="text" placeholder="Ex: Raison médicale..." value={justifyText} onChange={e => setJustifyText(e.target.value)} className="flex-1 bg-white border border-slate-250 rounded-lg px-2 py-1 text-[10px] outline-none text-slate-700" />
          <button onClick={handleSendJustify} className="bg-slate-800 text-white p-1.5 rounded-lg cursor-pointer hover:bg-slate-700"><Check className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {showObsForm && (
        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/80 space-y-2">
          <textarea placeholder={`Remarque pour ${student.firstName}`} value={obsText} onChange={e => setObsText(e.target.value)} className="w-full bg-white border border-slate-250 rounded-lg p-2 text-[10px] outline-none text-slate-700 h-14 resize-none" />
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-amber-600 font-bold uppercase">🔔 Notifies parent</span>
            <button onClick={handleSendObs} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-3 py-1 rounded-lg text-[9px] flex items-center gap-1 cursor-pointer">Envoyer <Send className="w-3 h-3" /></button>
          </div>
        </div>
      )}
    </div>
  );
};
