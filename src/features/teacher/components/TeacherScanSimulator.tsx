import React, { useState } from 'react';
import { Student } from '../../../types';
import { getFormattedId } from '../../admin/components/StudentCardUtils';
import { RealCameraQrScanner } from './RealCameraQrScanner';
import { QrCode, Camera } from 'lucide-react';
import { ScanResultOverlay, ScanResultData } from './ScanResultOverlay';

interface TeacherScanSimulatorProps {
  qrCodeInput: string;
  setQrCodeInput: (val: string) => void;
  courseStudents: Student[];
  onSubmit: (e: React.FormEvent) => void;
  onCodeDetected?: (code: string) => void;
  scanResult: ScanResultData | null;
}

export function TeacherScanSimulator({
  qrCodeInput,
  setQrCodeInput,
  courseStudents,
  onSubmit,
  onCodeDetected,
  scanResult
}: TeacherScanSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');

  const handleDetected = (code: string) => {
    setQrCodeInput(code);
    if (onCodeDetected) {
      onCodeDetected(code);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
            activeTab === 'camera' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> Caméra Réelle & Scan Photo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition ${
            activeTab === 'manual' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" /> Sélection Manuelle / Test
        </button>
      </div>

      {activeTab === 'camera' ? (
        <RealCameraQrScanner onDetected={handleDetected} />
      ) : (
        <form onSubmit={onSubmit} className="bg-amber-50/60 p-4 rounded-3xl border border-amber-200/80 space-y-3 text-center">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Sélection Rapide d'Élève</span>
          <p className="text-slate-500 text-[10.5px]">Sélectionnez un élève inscrit pour valider sa carte sans caméra :</p>
          
          <div className="flex gap-2 max-w-sm mx-auto">
            <select value={qrCodeInput} onChange={e => setQrCodeInput(e.target.value)} className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-[11px] outline-none text-slate-700">
              <option value="">-- Choisir un élève à scanner --</option>
              {courseStudents.map(s => <option key={s.id} value={getFormattedId(s)}>{s.firstName} {s.lastName} ({getFormattedId(s)})</option>)}
            </select>
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition cursor-pointer text-xs">Valider</button>
          </div>
        </form>
      )}

      <ScanResultOverlay result={scanResult} />
    </div>
  );
}
