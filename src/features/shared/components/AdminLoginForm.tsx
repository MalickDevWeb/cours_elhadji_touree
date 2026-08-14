import React, { useState } from 'react';
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function AdminLoginForm({ onSuccess, onError }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@soutien.sn') &&
      (password === 'admin' || password === 'admin123')
    ) {
      onError('');
      onSuccess();
    } else {
      onError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-1">
        <label className="block text-slate-500 font-semibold">Identifiant Administrateur</label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            id="admin-popup-username" type="text" placeholder="ex: admin" value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition bg-slate-50/50"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-slate-500 font-semibold">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            id="admin-popup-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition bg-slate-50/50"
            required
          />
          <button
            type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit" id="admin-popup-submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md"
      >
        <LogIn className="w-4 h-4" /> Se connecter (Espace Admin)
      </button>

      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2 text-slate-500 mt-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Administration de démo</span>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('admin123');
            }}
            className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/20 transition flex justify-between items-center text-[10px] text-slate-600"
          >
            <span className="font-semibold">Elhadji Touré (Directeur)</span>
            <span className="font-mono text-slate-400">admin / admin123</span>
          </button>
        </div>
      </div>
    </form>
  );
}
