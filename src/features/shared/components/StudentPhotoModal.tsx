import React from 'react';
import { Camera, Upload, Loader2, X } from 'lucide-react';

const presetPhotos = {
  M: [
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250&h=250'
  ],
  F: [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250&h=250'
  ]
};

interface StudentPhotoModalProps {
  isOpen: boolean; onClose: () => void; studentName: string; sex: 'M' | 'F';
  isUploading: boolean; onSelectCamera: () => void; onSelectFile: () => void;
  onSelectPreset: (url: string) => void;
}

export function StudentPhotoModal({
  isOpen, onClose, studentName, sex, isUploading, onSelectCamera, onSelectFile, onSelectPreset
}: StudentPhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl border border-slate-100 text-slate-800 animate-in zoom-in-95 duration-150 text-xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h4 className="font-bold text-xs text-slate-800">Photo: {studentName}</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-2">
          <button disabled={isUploading} onClick={onSelectCamera} className="w-full p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold flex items-center gap-2.5 transition cursor-pointer">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-sky-600" />} Photo en direct
          </button>
          <button disabled={isUploading} onClick={onSelectFile} className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2.5 transition cursor-pointer">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-slate-600" />} Choisir une image
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-[9px] font-extrabold uppercase text-slate-400 block mb-2">Ou un avatar preset</span>
          <div className="flex gap-2 justify-center">
            {presetPhotos[sex].map((p, idx) => (
              <button key={idx} onClick={() => { onSelectPreset(p); onClose(); }} className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 hover:border-sky-500 transition cursor-pointer">
                <img src={p} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
