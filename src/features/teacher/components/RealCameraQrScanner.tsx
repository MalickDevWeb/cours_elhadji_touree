import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScannerZoomControls } from './ScannerZoomControls';
import { ScannerOverlay } from './ScannerOverlay';

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
      if (videoEl) { videoEl.style.transform = `scale(${zoomVal})`; videoEl.style.transformOrigin = 'center center'; videoEl.style.transition = 'transform 0.2s ease-out'; }
    } catch (e) {}
  };

  useEffect(() => { applyZoomToTracks(zoomLevel); }, [zoomLevel, cameraActive]);

  const startCamera = async () => {
    setErrorMsg(null); setIsStarting(true); setCameraActive(false);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        try { (await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })).getTracks().forEach(t => t.stop()); }
        catch { try { (await navigator.mediaDevices.getUserMedia({ video: true })).getTracks().forEach(t => t.stop()); } catch {} }
      }
      if (!scannerRef.current) scannerRef.current = new Html5Qrcode('qr-camera-view');
      if (scannerRef.current.isScanning) await scannerRef.current.stop();
      const devices = (await Html5Qrcode.getCameras().catch(() => [])) as Array<{ id: string; label: string }>;
      const config = { fps: 30, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0, videoConstraints: { facingMode: 'environment', width: { min: 640, ideal: 1280, max: 1920 }, height: { min: 480, ideal: 720, max: 1080 } } };
      if (devices && devices.length > 0) {
        const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('arrière') || d.label.toLowerCase().includes('environment'));
        await scannerRef.current.start(backCam ? backCam.id : devices[0].id, config, handleQrDetected, () => {});
      } else {
        await scannerRef.current.start({ facingMode: 'environment' }, config, handleQrDetected, () => {});
      }
      setCameraActive(true);
      setTimeout(() => applyZoomToTracks(zoomLevel), 300);
    } catch (e: any) { setCameraActive(false); setErrorMsg(e?.message || "Accès caméra indisponible ou refusé."); }
    finally { setIsStarting(false); }
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
        <ScannerOverlay
          isStarting={isStarting}
          cameraActive={cameraActive}
          errorMsg={errorMsg}
          zoomLevel={zoomLevel}
          isProcessingFile={isProcessingFile}
          onStartCamera={startCamera}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      </div>
      <ScannerZoomControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} onUploadClick={() => fileInputRef.current?.click()} />
    </div>
  );
};
