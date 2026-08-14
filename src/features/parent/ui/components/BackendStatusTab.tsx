import React, { useEffect, useState } from 'react';
import { Database, Cloud, Zap, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export function BackendStatusTab() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backend/status');
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  return (
    <div className="space-y-3 text-xs animate-in fade-in duration-150">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <h4 className="font-bold text-slate-800 text-xs">Statut Services Backend Real-Time</h4>
          <p className="text-[10px] text-slate-400">Suivi des connexions Neon (DB), Cloudinary (Images) et Redis (Cache).</p>
        </div>
        <button onClick={fetchStatus} disabled={loading} className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer text-[10px] disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Rafraîchir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Neon PostgreSQL (Base de Données)</p>
              <p className="text-[9.5px] text-slate-500">{status?.neon?.message || (status?.neon?.configured ? 'Configuration détectée' : 'Mode Fallback JSON local actif')}</p>
            </div>
          </div>
          {status?.neon?.connected ? (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[9.5px] rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connecté</span>
          ) : (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 font-bold text-[9.5px] rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-600" /> Standby / JSON</span>
          )}
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Cloudinary (Stockage Média & Photos)</p>
              <p className="text-[9.5px] text-slate-500">{status?.cloudinary?.configured ? `Cloud: ${status.cloudinary.cloudName || 'Oui'}` : 'Prêt pour l\'envoi d\'images & reçus'}</p>
            </div>
          </div>
          {status?.cloudinary?.configured ? (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[9.5px] rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Configuré</span>
          ) : (
            <span className="px-2 py-1 bg-sky-100 text-sky-800 font-bold text-[9.5px] rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-sky-600" /> Prêt</span>
          )}
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Redis (Moteur de Cache Haute Performance)</p>
              <p className="text-[9.5px] text-slate-500">{status?.redis?.active ? 'Cache actif pour requêtes rapides' : (status?.redis?.hasUrl ? 'Tentative de reconnexion...' : 'Prêt pour REDIS_URL dans .env.example')}</p>
            </div>
          </div>
          {status?.redis?.active ? (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[9.5px] rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Actif</span>
          ) : (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 font-bold text-[9.5px] rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3 text-slate-400" /> Prêt</span>
          )}
        </div>
      </div>
    </div>
  );
}
