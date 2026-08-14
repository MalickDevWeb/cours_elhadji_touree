import React from 'react';
import { QrCode, Camera, Sparkles } from 'lucide-react';

interface Props {
  showScanner: boolean;
  onToggleScan: () => void;
  authorized?: boolean;
  reason?: string;
}

export const MaxitQrCard: React.FC<Props> = ({ showScanner, onToggleScan }) => {
  return (
    <button
      type="button"
      onClick={onToggleScan}
      className={`w-full group relative overflow-hidden rounded-2xl p-3.5 transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-between border ${
        showScanner
          ? 'bg-slate-950 border-orange-500 text-white'
          : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 border-orange-400 text-slate-950 hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md transition ${
          showScanner ? 'bg-orange-500 text-slate-950' : 'bg-slate-950 text-orange-400 border border-orange-400/30'
        }`}>
          <QrCode className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
              showScanner ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-950/20 text-slate-950'
            }`}>
              MAXIT QR PASS
            </span>
            <Sparkles className={`w-3 h-3 ${showScanner ? 'text-orange-400' : 'text-slate-950'}`} />
          </div>
          <h4 className={`font-display font-extrabold text-xs mt-0.5 ${showScanner ? 'text-white' : 'text-slate-950'}`}>
            {showScanner ? 'Fermer le Scanner' : 'Scanner le QR Code (Caméra)'}
          </h4>
          <p className={`text-[10px] font-medium ${showScanner ? 'text-slate-400' : 'text-slate-900/80'}`}>
            {showScanner ? 'Masquer le scanner de présence' : 'Cliquez ici pour ouvrir la caméra et valider la carte'}
          </p>
        </div>
      </div>

      <div className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-sm ${
        showScanner ? 'bg-rose-500 text-white' : 'bg-slate-950 text-white group-hover:bg-slate-900'
      }`}>
        <Camera className="w-3.5 h-3.5 text-orange-400" />
        <span>{showScanner ? 'Fermer' : 'Ouvrir'}</span>
      </div>
    </button>
  );
};
