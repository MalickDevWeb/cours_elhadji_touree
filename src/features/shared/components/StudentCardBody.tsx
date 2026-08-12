import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student, Level } from '../../../types';
import { getFormattedId } from '../../admin/components/StudentCardUtils';

interface StudentCardBodyProps {
  student: Student;
  level?: Level | string;
}

export const getStudentPhoto = (studentId: string, sex: 'M' | 'F') => {
  const hash = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const males = [
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=250&h=250'
  ];
  const females = [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=250&h=250'
  ];
  const list = sex === 'M' ? males : females;
  return list[hash % list.length];
};

export function StudentCardBody({ student, level }: StudentCardBodyProps) {
  const formattedId = getFormattedId(student);
  const levelName = typeof level === 'string' ? level : level?.name || 'Classe';
  const photoUrl = student.photoUrl || getStudentPhoto(student.id, student.sex);

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-3.5 sm:p-4 rounded-[22px] shadow-2xl border border-slate-800/80 relative overflow-hidden flex flex-col justify-between w-full aspect-[1.586/1] min-h-[225px] select-none text-left font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:12px_20px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-slate-800/80 pb-2">
        <div>
          <h5 className="font-extrabold text-[10.5px] tracking-wider uppercase bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent leading-none">Soutien Scolaire d'Élite</h5>
          <p className="text-[6.5px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Thiès • Sénégal</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7.5px] font-bold text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700/60">2026-2027</span>
          <span className="border border-amber-400/50 text-[7.5px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 shadow-sm">ÉLÈVE</span>
        </div>
      </div>

      {/* Main Row: Photo | Info | Enlarged QR Code */}
      <div className="flex items-center justify-between gap-3 my-auto z-10 py-1">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className="w-[70px] h-[86px] bg-slate-800 rounded-xl overflow-hidden border-2 border-amber-400/90 shadow-lg flex items-center justify-center relative">
            <img src={photoUrl} alt={`${student.firstName}`} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[6px] px-1.5 py-0.5 rounded-sm uppercase tracking-tighter whitespace-nowrap shadow-md border border-amber-200/80">
            VALIDÉ
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div>
            <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest block">Nom Complet</span>
            <h4 className="font-display font-black text-xs text-white truncate uppercase tracking-wide leading-tight">{student.firstName} {student.lastName}</h4>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest block">Classe</span>
              <span className="text-[9.5px] font-extrabold text-amber-300 uppercase truncate block">{levelName}</span>
            </div>
            <div>
              <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest block">Genre</span>
              <span className="text-[9.5px] font-bold text-slate-200 uppercase block">{student.sex}</span>
            </div>
          </div>
          <div>
            <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest block">Identifiant Unique</span>
            <span className="text-[9px] font-mono font-bold text-amber-400 tracking-wider block">{formattedId}</span>
          </div>
        </div>

        {/* Enlarged QR Code Column without yellow border */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-slate-900/90 border border-slate-800/90 p-2 rounded-2xl shadow-xl">
          <div className="bg-white p-1.5 rounded-xl flex items-center justify-center shadow-inner">
            <QRCodeSVG value={formattedId} size={62} level="H" fgColor="#020617" bgColor="#ffffff" />
          </div>
          <span className="text-[6px] font-mono font-black text-amber-300/90 uppercase tracking-widest mt-1.5">SCAN ACCÈS</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center z-10 border-t border-slate-800/80 pt-1.5 text-[7px] text-slate-400">
        <span className="font-mono tracking-wider text-slate-400">ID: {student.id}</span>
        <span className="font-semibold text-amber-400/90 uppercase tracking-wider">Carte Officielle d'Élite</span>
      </div>
    </div>
  );
}
