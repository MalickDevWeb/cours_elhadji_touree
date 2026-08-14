import React, { useEffect, useState, useRef } from 'react';
import { Upload, CheckCircle2, Cloud, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useDynamicTheme } from '../../shared/hooks/useDynamicTheme';

interface Props { logoUrl?: string; onLogoChange: (url: string) => void; }

export const LogoCloudinaryUploader: React.FC<Props> = ({ logoUrl, onLogoChange }) => {
  const [status, setStatus] = useState<{ configured: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { analyzeLogoAndApply, isAnalyzing } = useDynamicTheme();

  useEffect(() => {
    fetch('/api/cloudinary/status').then((r) => r.json()).then(setStatus).catch(() => setStatus({ configured: false }));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true); setAiSuccess(false);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result;
        let finalUrl = base64Data;
        try {
          const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64Data, folder: 'center' }) });
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        } catch { /* fallback base64 */ }
        onLogoChange(finalUrl);
        try { await analyzeLogoAndApply(base64Data); setAiSuccess(true); } catch (e) { console.error(e); } finally { setLoading(false); }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-700 flex items-center gap-1.5"><Cloud className="w-4 h-4 text-sky-500" /> Logo & Couleurs de l'établissement</span>
        {status?.configured && <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Connecté</span>}
      </div>

      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" /> : <ImageIcon className="w-7 h-7 text-slate-300" />}
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-[11px] text-slate-500 leading-tight">L'analyse de votre logo adapte automatiquement la palette de couleurs.</p>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={loading || isAnalyzing} className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              {loading || isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {loading || isAnalyzing ? "Analyse en cours..." : "Changer le logo (Upload direct)"}
            </button>
            {aiSuccess && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1"><Sparkles className="w-3 h-3 text-emerald-600" /> Palette adaptée !</span>}
          </div>
        </div>
      </div>
    </div>
  );
};


