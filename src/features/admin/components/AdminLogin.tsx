import React, { useState } from 'react';
import { LogIn, ShieldAlert, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps { onLoginSuccess: () => void; }

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    if ((u === 'admin' || u === 'admin@soutien.sn') && (password === 'admin' || password === 'admin123')) {
      setError(''); onLoginSuccess();
    } else { setError('Identifiants incorrects. Veuillez réessayer.'); }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-xs mt-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto border border-sky-100 shadow-2xs">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-slate-800 text-lg">Espace Administration</h3>
        <p className="text-slate-400">Veuillez vous authentifier pour accéder au tableau de bord.</p>
      </div>
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-slate-500 font-semibold">Identifiant ou Email</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input id="admin-login-username" type="text" placeholder="ex: admin" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition bg-slate-50/50" required />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-slate-500 font-semibold">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input id="admin-login-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition bg-slate-50/50" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" id="admin-submit-login-btn" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-slate-100">
          <LogIn className="w-4 h-4" /> Se Connecter
        </button>
      </form>
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1 text-slate-500">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Accès de test (Démo)</span>
        <p className="text-[10px] leading-relaxed">Pour tester la plateforme, utilisez les identifiants :</p>
        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono mt-1 pt-1 border-t border-slate-200/60">
          <div>Identifiant : <span className="font-bold text-slate-700">admin</span></div>
          <div>Mot de passe : <span className="font-bold text-slate-700">admin123</span></div>
        </div>
      </div>
    </div>
  );
};
