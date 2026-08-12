import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export interface ScanResultData {
  success: boolean;
  status: 'SUCCESS' | 'ALREADY_SCANNED' | 'INVALID';
  studentName?: string;
  reason?: string;
  time?: string;
}

interface Props {
  result: ScanResultData | null;
  onClear?: () => void;
}

export const ScanResultOverlay: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  if (result.status === 'SUCCESS') {
    return (
      <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/80 text-emerald-950 text-center space-y-2 animate-in zoom-in-95 duration-200 shadow-lg">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm sm:text-base text-emerald-800 tracking-tight">
            ✅ ACCÈS VALIDÉ !
          </h4>
          {result.studentName && (
            <p className="font-bold text-xs sm:text-sm text-emerald-900 mt-0.5">
              Élève : <span className="underline decoration-emerald-400">{result.studentName}</span>
            </p>
          )}
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Présence enregistrée à {result.time || 'l\'instant'}
          </p>
        </div>
      </div>
    );
  }

  if (result.status === 'ALREADY_SCANNED') {
    return (
      <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/80 text-amber-950 text-center space-y-2 animate-in zoom-in-95 duration-200 shadow-lg">
        <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-pulse">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm sm:text-base text-amber-900 tracking-tight">
            ⚠️ DÉJÀ SCANNÉ AUJOURD'HUI !
          </h4>
          {result.studentName && (
            <p className="font-bold text-xs sm:text-sm text-amber-900 mt-0.5">
              Élève : {result.studentName}
            </p>
          )}
          <p className="text-[11px] text-amber-800 font-semibold mt-1">
            {result.reason || 'Une seule validation de présence est autorisée par jour.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/80 text-rose-950 text-center space-y-2 animate-in zoom-in-95 duration-200 shadow-lg">
      <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-pulse">
        <XCircle className="w-7 h-7" />
      </div>
      <div>
        <h4 className="font-extrabold text-sm sm:text-base text-rose-900 tracking-tight">
          ❌ SCAN NON RECONNU
        </h4>
        <p className="text-[11px] text-rose-800 font-bold mt-1">
          {result.reason || "Carte QR Code introuvable ou invalide."}
        </p>
      </div>
    </div>
  );
};
