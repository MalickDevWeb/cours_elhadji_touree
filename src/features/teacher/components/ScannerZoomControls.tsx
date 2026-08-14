import React from 'react';
import { ZoomIn, ZoomOut, Search, Upload } from 'lucide-react';

interface Props {
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onUploadClick: () => void;
}

export const ScannerZoomControls: React.FC<Props> = ({ zoomLevel, setZoomLevel, onUploadClick }) => {
  return (
    <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setZoomLevel(z => Math.max(1, +(z - 0.5).toFixed(1)))}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg text-xs flex items-center gap-1 active:scale-95"
        >
          <ZoomOut className="w-3.5 h-3.5" /> Zoom -
        </button>
        <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm">
          <Search className="w-3.5 h-3.5" />
          <span>Zoom {zoomLevel}x</span>
        </div>
        <button
          type="button"
          onClick={() => setZoomLevel(z => Math.min(6, +(z + 0.5).toFixed(1)))}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 active:scale-95"
        >
          <ZoomIn className="w-3.5 h-3.5" /> Zoom +
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-800/60">
        <span className="text-[10px] text-slate-400">Raccourcis:</span>
        {[1.8, 3.0, 4.5].map(v => (
          <button
            key={v}
            type="button"
            onClick={() => setZoomLevel(v)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              zoomLevel === v ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {v}x
          </button>
        ))}
        <button
          type="button"
          onClick={onUploadClick}
          className="ml-auto px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-medium flex items-center gap-1"
        >
          <Upload className="w-3 h-3" /> Photo
        </button>
      </div>
    </div>
  );
};
