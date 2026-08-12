import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { School, X, Download, HelpCircle, ExternalLink, Check } from 'lucide-react';
import { PwaInstallGuideModal } from './PwaInstallGuideModal';

export function PWAInstallBanner() {
  const { isInstallable, handleInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [menuHint, setMenuHint] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [detectedOs, setDetectedOs] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    setIsIframe(window.self !== window.top);
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setDetectedOs('ios');
    else if (/android/.test(ua)) setDetectedOs('android');
    else setDetectedOs('desktop');

    if (isInstallable) {
      if (!sessionStorage.getItem('pwa_banner_dismissed')) setIsDismissed(false);
    } else {
      setIsDismissed(false);
    }
  }, [isInstallable]);

  const onDismiss = () => {
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
    setIsDismissed(true);
  };

  const onInstallClick = async () => {
    if (isIframe) { window.open(window.location.href, '_blank'); return; }
    if (detectedOs === 'ios') { setShowGuide(true); return; }
    if (isInstallable) { await handleInstall(); setIsDismissed(true); }
    else { setMenuHint(true); }
  };

  if (isDismissed) return null;

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-[380px] z-[9999] bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 animate-in fade-in">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 border border-sky-200 text-sky-700">
            <School className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-slate-900 leading-tight">Installer Soutien Scolaire</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {isIframe ? "Ouvrez en grand écran pour installer l'application." : menuHint ? "Ouvrez le menu du navigateur (⋮) puis 'Installer'." : "Ajoutez l'application sur votre écran d'accueil pour un accès ultra-rapide."}
            </p>
          </div>
          <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Fermer"><X className="w-4 h-4" /></button>
        </div>

        {menuHint && (
          <div className="p-2 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-sky-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Menu (⋮) &rarr; <strong>"Installer l'application"</strong>.</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <button onClick={() => setShowGuide(true)} className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5" /> Guide
          </button>
          <div className="flex gap-2 justify-end">
            <button onClick={onDismiss} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer">Plus tard</button>
            <button onClick={onInstallClick} className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
              {isIframe ? <><ExternalLink className="w-3.5 h-3.5" /> Ouvrir</> : <><Download className="w-3.5 h-3.5" /> Installer</>}
            </button>
          </div>
        </div>
      </div>

      <PwaInstallGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} detectedOs={detectedOs} isIframe={isIframe} />
    </>
  );
}
