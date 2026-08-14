import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { useDynamicTheme } from '../hooks/useDynamicTheme';
import { AppPalette } from '../utils/themeEngine';
import { AIPaletteUploadSection, ORANGE_LOGO_SAMPLE } from './AIPaletteUploadSection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS: { name: string; palette: AppPalette }[] = [
  { name: 'Orange Énergie', palette: { primary: '#ea580c', primaryHover: '#c2410c', primaryLight: '#ffedd5', secondary: '#431407', accent: '#f59e0b', darkNav: '#290e05', bgTint: '#fff7ed', description: 'Thème Orange Flamboyant' } },
  { name: 'Soutien Scolaire Bleue', palette: { primary: '#0284c7', primaryHover: '#0369a1', primaryLight: '#e0f2fe', secondary: '#0f172a', accent: '#f59e0b', darkNav: '#0f172a', bgTint: '#f8fafc', description: 'Palette officielle Soutien Scolaire' } },
  { name: 'Émeraude Éducatif', palette: { primary: '#059669', primaryHover: '#047857', primaryLight: '#d1fae5', secondary: '#064e3b', accent: '#d97706', darkNav: '#022c22', bgTint: '#f0fdf4', description: 'Teintes vertes de réussite' } },
  { name: 'Bordeaux Académique', palette: { primary: '#b91c1c', primaryHover: '#991b1b', primaryLight: '#fee2e2', secondary: '#450a0a', accent: '#eab308', darkNav: '#2a0808', bgTint: '#fef2f2', description: 'Blason traditionnel' } },
  { name: 'Violet Excellence', palette: { primary: '#7c3aed', primaryHover: '#6d28d9', primaryLight: '#ede9fe', secondary: '#2e1065', accent: '#06b6d4', darkNav: '#1e1b4b', bgTint: '#faf5ff', description: 'Académie de prestige' } },
];

export function AIPaletteModal({ isOpen, onClose }: Props) {
  const { currentPalette, isAnalyzing, setPalette, analyzeLogoAndApply, resetToDefault } = useDynamicTheme();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async () => {
    if (!previewUrl) { setErrorMsg('Veuillez choisir un logo'); return; }
    setErrorMsg(null);
    try { await analyzeLogoAndApply(previewUrl); } catch (err: any) { setErrorMsg(err.message || 'Échec extraction'); }
  };

  const handleTestOrangeLogo = async () => {
    setPreviewUrl(ORANGE_LOGO_SAMPLE);
    setErrorMsg(null);
    try {
      await analyzeLogoAndApply(ORANGE_LOGO_SAMPLE);
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec extraction logo orange');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 rounded-xl text-sky-600"><Palette className="w-5 h-5" /></div>
            <div><h3 className="font-bold text-sm">Palette du Logo</h3><p className="text-xs text-slate-500">Thème adapté au logo</p></div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <AIPaletteUploadSection
          previewUrl={previewUrl}
          isAnalyzing={isAnalyzing}
          errorMsg={errorMsg}
          onFileChange={handleFileChange}
          onRunAiAnalysis={handleRunAnalysis}
          onTestOrangeLogo={handleTestOrangeLogo}
        />

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
          <span className="text-xs font-bold text-slate-700">Couleurs actives :</span>
          <div className="flex gap-2">
            {[currentPalette.primary, currentPalette.primaryHover, currentPalette.primaryLight, currentPalette.accent, currentPalette.darkNav].map((c, i) => (
              <span key={i} className="w-6 h-6 rounded-lg border shadow-2xs" style={{ backgroundColor: c }} />
            ))}
          </div>
          {currentPalette.description && <p className="text-[11px] text-slate-600 italic leading-tight">{currentPalette.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => setPalette(p.palette)} className={`p-2 rounded-xl border text-left flex items-center justify-between text-xs cursor-pointer ${currentPalette.primary === p.palette.primary ? 'border-sky-500 bg-sky-50 font-bold' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.palette.primary }} /><span className="truncate">{p.name}</span></div>
              {currentPalette.primary === p.palette.primary && <Check className="w-3.5 h-3.5 text-sky-600" />}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <button onClick={resetToDefault} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Par défaut</button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Terminer</button>
        </div>
      </div>
    </div>
  );
}
