import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  itemName,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '221') {
      onConfirm();
      setCode('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-xs overflow-hidden border border-slate-100 shadow-2xl relative p-5 space-y-4">
        <button
          type="button" onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 border border-rose-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm">{title}</h4>
            {itemName && <p className="text-slate-500 text-[10px] font-semibold mt-0.5 truncate max-w-[200px]">{itemName}</p>}
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            Pour valider la suppression définitive de cet élément, veuillez saisir le code de sécurité <span className="font-bold text-slate-700">221</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <input
              type="text" required placeholder="Code de sécurité" value={code}
              onChange={e => { setCode(e.target.value); setError(false); }}
              className={`w-full px-3 py-2 bg-slate-50 border ${error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-250 focus:border-sky-500'} rounded-xl text-center font-bold text-xs tracking-widest outline-none transition-colors`}
            />
            {error && (
              <p className="text-rose-500 text-[9px] font-bold text-center">Code incorrect ! Veuillez saisir "221".</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-[10px] transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-xl text-[10px] transition cursor-pointer"
            >
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
