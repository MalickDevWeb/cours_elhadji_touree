import React from 'react';
import { Upload, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface Props {
  previewUrl: string | null;
  isAnalyzing: boolean;
  errorMsg: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRunAiAnalysis: () => void;
  onTestOrangeLogo?: () => void;
}

const ORANGE_LOGO_SAMPLE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="%23f97316"/><circle cx="100" cy="100" r="60" fill="%23ea580c"/><text x="100" y="110" font-family="sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">LOGO</text></svg>`;

export function AIPaletteUploadSection({
  previewUrl,
  isAnalyzing,
  errorMsg,
  onFileChange,
  onRunAiAnalysis,
  onTestOrangeLogo,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 block">
          Charger le logo de votre établissement :
        </label>
        {onTestOrangeLogo && (
          <button
            type="button"
            onClick={onTestOrangeLogo}
            className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-lg border border-orange-200 transition cursor-pointer"
          >
            🍊 Tester logo orange
          </button>
        )}
      </div>

      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-sky-400 bg-slate-50/50 transition-all">
        {previewUrl ? (
          <img src={previewUrl} alt="Aperçu logo" className="h-16 object-contain rounded-lg shadow-xs" />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-300" />
        )}
        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" id="logo-input" />
        <label
          htmlFor="logo-input"
          className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 rounded-xl hover:bg-sky-100 cursor-pointer flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          {previewUrl ? 'Changer de logo' : 'Sélectionner un fichier image'}
        </label>
      </div>

      <button
        onClick={onRunAiAnalysis}
        disabled={!previewUrl || isAnalyzing}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
      >
        {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
        {isAnalyzing ? 'Extraction des couleurs...' : 'Extraire la palette du logo'}
      </button>
      {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
    </div>
  );
}
export { ORANGE_LOGO_SAMPLE };
