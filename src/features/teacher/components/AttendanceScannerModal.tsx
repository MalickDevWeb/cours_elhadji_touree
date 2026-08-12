import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { X, QrCode, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface AttendanceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedCode: string) => void;
  title?: string;
}

export const AttendanceScannerModal: React.FC<AttendanceScannerModalProps> = ({
  isOpen, onClose, onScanSuccess, title = "Scanner Carte d'Élève"
}) => {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleResult = (result: any) => {
    if (result?.text && isScanning) {
      const code = result.text.trim();
      setLastScanned(code);
      setIsScanning(false);
      onScanSuccess(code);
      setTimeout(() => {
        setIsScanning(true);
        setLastScanned(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1">
              {title} <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-slate-400 text-[10px]">Pointez la caméra vers le QR code de la carte scolaire</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 aspect-square flex items-center justify-center">
          {isScanning ? (
            <QrReader
              onResult={handleResult}
              constraints={{ facingMode: 'environment' }}
              className="w-full h-full object-cover"
              scanDelay={500}
            />
          ) : (
            <div className="text-center space-y-2 p-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <p className="text-xs font-bold text-emerald-300">Code détecté : {lastScanned}</p>
              <button
                onClick={() => setIsScanning(true)}
                className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scanner à nouveau
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 text-center">
          Vérifiez que l'accès à la caméra est autorisé dans votre navigateur.
        </p>
      </div>
    </div>
  );
};
