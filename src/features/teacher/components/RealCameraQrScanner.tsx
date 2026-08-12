import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Search } from 'lucide-react';

interface Props { onDetected: (code: string) => void; }

export const RealCameraQrScanner: React.FC<Props> = ({ onDetected }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(3.0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });

  const handleQrDetected = (text: string) => {
    const now = Date.now();
    if (lastScannedRef.current.code === text && now - lastScannedRef.current.time < 2500) return;
    lastScannedRef.current = { code: text, time: now };
    onDetected(text);
  };

  const applyZoomToTracks = (zoomVal: number) => {
    try {
      const videoEl = document.querySelector('#qr-camera-view video') as HTMLVideoElement | null;
      if (videoEl) {
        videoEl.style.transform = `scale(${zoomVal})`;
        videoEl.style.transformOrigin = 'center center';
        videoEl.style.transition = 'transform 0.2s ease-out';
      }
      if (scannerRef.current) {
        // @ts-ignore
        const stream = scannerRef.current.getRunningTrackCameraCapabilities ? scannerRef.current.getRunningTrackCameraCapabilities() : null;
      }
    } catch (e) {}
  };

  useEffect(() => {
    applyZoomToTracks(zoomLevel);
  }, [zoomLevel, cameraActive]);

  const startCamera = async () => {
    setErrorMsg(null); setIsStarting(true); setCameraActive(false);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          s.getTracks().forEach(t => t.stop());
        } catch {
          try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            s.getTracks().forEach(t => t.stop());
          } catch {}
        }
      }
      if (!scannerRef.current) scannerRef.current = new Html5Qrcode('qr-camera-view');
      if (scannerRef.current.isScanning) await scannerRef.current.stop();
      const devices = (await Html5Qrcode.getCameras().catch(() => [])) as Array<{ id: string; label: string }>;
      const config = { fps: 15, qrbox: { width: 240, height: 240 } };
      if (devices && devices.length > 0) {
        const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('arrière') || d.label.toLowerCase().includes('environment'));
        await scannerRef.current.start(backCam ? backCam.id : devices[0].id, config, handleQrDetected, () => {});
      } else {
        await scannerRef.current.start({ facingMode: 'environment' }, config, handleQrDetected, () => {});
      }
      setCameraActive(true);
      setTimeout(() => applyZoomToTracks(zoomLevel), 300);
    } catch (e: any) {
      setCameraActive(false); setErrorMsg(e?.message || "Accès caméra indisponible ou refusé.");
    } finally { setIsStarting(false); }
  };

  useEffect(() => {
    startCamera();
    return () => { if (scannerRef.current?.isScanning) scannerRef.current.stop().catch(() => {}); };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null); setIsProcessingFile(true);
    try {
      const qrcode = new Html5Qrcode('qr-file-dummy');
      const text = await qrcode.scanFile(file, true);
      handleQrDetected(text);
    } catch { setErrorMsg("Aucun QR Code valide trouvé sur cette photo."); } finally { setIsProcessingFile(false); }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div id="qr-file-dummy" className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      <div className="relative bg-slate-950 min-h-[280px] flex flex-col items-center justify-center overflow-hidden">
        <div id="qr-camera-view" className="w-full h-[280px] overflow-hidden" />
        {isStarting && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10">
            <div className="relative flex items-center justify-center"><div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" /><Camera className="w-5 h-5 text-amber-400 absolute" /></div>
            <p className="text-xs font-semibold text-amber-300">Initialisation de la caméra (Zoom {zoomLevel}x)...</p>
          </div>
        )}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="w-52 h-52 border-2 border-dashed border-amber-400 rounded-2xl relative animate-pulse">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-3 border-l-3 border-amber-400 -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-3 border-r-3 border-amber-400 -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-3 border-l-3 border-amber-400 -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-3 border-r-3 border-amber-400 -mb-1 -mr-1" />
            </div>
            <span className="absolute bottom-3 bg-slate-950/90 text-amber-300 text-[11px] font-bold px-3.5 py-1 rounded-full border border-amber-500/30 shadow-md">Pointez le QR Code ici (Zoom {zoomLevel}x)</span>
          </div>
        )}
        {!isStarting && !cameraActive && (
          <div className="p-6 text-center space-y-3 z-10 max-w-xs">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-xs font-medium text-slate-300">{errorMsg || "Caméra non détectée ou bloquée."}</p>
            <div className="flex flex-col gap-2 pt-1">
              <button type="button" onClick={startCamera} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"><RefreshCw className="w-3.5 h-3.5" /> Activer la Caméra</button>
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isProcessingFile} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center justify-center gap-2 cursor-pointer border border-slate-700"><Upload className="w-3.5 h-3.5 text-amber-400" /> {isProcessingFile ? "Analyse..." : "Importer photo de carte QR"}</button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar for Zoom */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => setZoomLevel(z => Math.max(1, +(z - 0.5).toFixed(1)))} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg text-xs flex items-center gap-1 active:scale-95"><ZoomOut className="w-3.5 h-3.5" /> Zoom -</button>
          <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm"><Search className="w-3.5 h-3.5" /><span>Zoom {zoomLevel}x</span></div>
          <button type="button" onClick={() => setZoomLevel(z => Math.min(6, +(z + 0.5).toFixed(1)))} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 active:scale-95"><ZoomIn className="w-3.5 h-3.5" /> Zoom +</button>
        </div>
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[10px] text-slate-400">Raccourcis:</span>
          {[1.8, 3.0, 4.5].map(v => (
            <button key={v} type="button" onClick={() => setZoomLevel(v)} className={`px-2 py-0.5 rounded text-[11px] font-bold ${zoomLevel === v ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{v}x</button>
          ))}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="ml-auto px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-medium flex items-center gap-1"><Upload className="w-3 h-3" /> Photo</button>
        </div>
      </div>
    </div>
  );
};

