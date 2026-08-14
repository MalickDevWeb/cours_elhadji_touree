import React from 'react';
import { Camera, AlertCircle, RefreshCw, Upload } from 'lucide-react';

interface Props {
  isStarting: boolean;
  cameraActive: boolean;
  errorMsg: string | null;
  zoomLevel: number;
  isProcessingFile: boolean;
  onStartCamera: () => void;
  onUploadClick: () => void;
}

export const ScannerOverlay: React.FC<Props> = ({
  isStarting, cameraActive, errorMsg, zoomLevel, isProcessingFile, onStartCamera, onUploadClick
}) => {
  if (isStarting) {
    return (
      <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
          <Camera className="w-5 h-5 text-amber-400 absolute" />
        </div>
        <p className="text-xs font-semibold text-amber-300">Initialisation caméra (Zoom {zoomLevel}x)...</p>
      </div>
    );
  }

  if (cameraActive) {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="w-52 h-52 border-2 border-dashed border-amber-400 rounded-2xl relative animate-pulse">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-3 border-l-3 border-amber-400 -mt-1 -ml-1" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-3 border-r-3 border-amber-400 -mt-1 -mr-1" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-3 border-l-3 border-amber-400 -mb-1 -ml-1" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-3 border-r-3 border-amber-400 -mb-1 -mr-1" />
        </div>
        <span className="absolute bottom-3 bg-slate-950/90 text-amber-300 text-[11px] font-bold px-3.5 py-1 rounded-full border border-amber-500/30 shadow-md">
          Pointez le QR Code ici (Zoom {zoomLevel}x)
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 text-center space-y-3 z-10 max-w-xs">
      <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
      <p className="text-xs font-medium text-slate-300">{errorMsg || "Caméra non détectée ou bloquée."}</p>
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={onStartCamera}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Activer la Caméra
        </button>
        <button
          type="button"
          onClick={onUploadClick}
          disabled={isProcessingFile}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          {isProcessingFile ? "Analyse..." : "Importer photo de carte QR"}
        </button>
      </div>
    </div>
  );
};
