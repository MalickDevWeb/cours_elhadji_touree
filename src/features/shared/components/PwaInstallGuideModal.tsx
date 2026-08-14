import React, { useState } from 'react';
import { X, Share, MoreVertical, Download, Smartphone, Monitor, CheckCircle2, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detectedOs: 'android' | 'ios' | 'desktop';
  isIframe?: boolean;
}

export const PwaInstallGuideModal: React.FC<Props> = ({ isOpen, onClose, detectedOs, isIframe }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(detectedOs);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3.5 relative text-xs">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-full transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-2xl">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Guide d'Installation App</h3>
            <p className="text-[11px] text-slate-400">Installez l'application sur votre écran d'accueil</p>
          </div>
        </div>

        {isIframe && (
          <div className="bg-amber-500/15 border border-amber-500/30 text-amber-200 p-3 rounded-2xl flex items-center justify-between gap-2">
            <p className="text-[11px] leading-tight"><strong>Mode Prévisualisation :</strong> Les navigateurs bloquent l'installation PWA dans une iframe.</p>
            <button onClick={() => window.open(window.location.href, '_blank')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded-xl text-[11px] shrink-0 flex items-center gap-1 cursor-pointer">
              <ExternalLink className="w-3 h-3" /> Ouvrir
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 font-bold">
          <button onClick={() => setActiveTab('android')} className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${activeTab === 'android' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>
            <Smartphone className="w-3.5 h-3.5" /> Android
          </button>
          <button onClick={() => setActiveTab('ios')} className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${activeTab === 'ios' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>
            <Share className="w-3.5 h-3.5" /> iPhone
          </button>
          <button onClick={() => setActiveTab('desktop')} className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${activeTab === 'desktop' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>
            <Monitor className="w-3.5 h-3.5" /> PC / Mac
          </button>
        </div>

        <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
          {activeTab === 'android' && (
            <div className="space-y-2">
              <p className="text-slate-300 flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span> Ouvrez le menu Chrome (<MoreVertical className="w-3.5 h-3.5 inline text-sky-400" /> 3 points en haut).</p>
              <p className="text-slate-300 flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span> Cliquez sur <strong className="text-white">"Installer l'application"</strong> ou "Ajouter à l'écran d'accueil".</p>
              <p className="text-slate-300 flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span> Validez pour l'ajouter à vos applications.</p>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-2">
              <p className="text-slate-300 flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span> Dans Safari, appuyez sur <strong className="text-white">Partager</strong> (<Share className="w-3.5 h-3.5 inline text-sky-400" /> en bas).</p>
              <p className="text-slate-300 flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span> Défilez et touchez <strong className="text-white">"Sur l'écran d'accueil"</strong>.</p>
              <p className="text-slate-300 flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span> Appuyez sur <strong className="text-white">"Ajouter"</strong> en haut à droite.</p>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-2.5">
              {isIframe && (
                <button onClick={() => window.open(window.location.href, '_blank')} className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
                  <ExternalLink className="w-4 h-4" /> 1. Ouvrir l'application en plein écran
                </button>
              )}
              <p className="text-slate-300 flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Sur <strong>Chrome / Edge</strong> : Cliquez sur l'icône <Download className="w-3.5 h-3.5 inline text-sky-400" /> ou <strong>⊕</strong> dans la barre d'adresse URL en haut à droite.</span>
              </p>
              <p className="text-slate-300 flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Ou via le Menu (⋮) &rarr; <strong className="text-white">"Installer Soutien Scolaire"</strong>.</span>
              </p>
              <p className="text-slate-300 flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Sur <strong>Mac (Safari)</strong> : Menu <strong className="text-white">Fichier &rarr; Ajouter au Dock</strong>.</span>
              </p>
            </div>
          )}
        </div>

        <button onClick={onClose} className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Compris
        </button>
      </div>
    </div>
  );
};

