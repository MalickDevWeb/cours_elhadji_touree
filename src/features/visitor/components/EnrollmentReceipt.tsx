import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Preinscription } from '../../../types';

interface ReceiptProps {
  receipt: Preinscription;
  onClose: () => void;
}

export const EnrollmentReceipt: React.FC<ReceiptProps> = ({ receipt, onClose }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="text-center space-y-5 py-4"
    >
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border-4 border-emerald-100 shadow-sm"
      >
        <CheckCircle2 className="w-9 h-9" />
      </motion.div>
      <div>
        <h3 className="font-display font-black text-slate-800 text-lg">Pré-inscription Enregistrée !</h3>
        <p className="text-slate-400 text-[10px] mt-1">Votre dossier a été transmis avec succès à notre équipe académique.</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2 shadow-xs">
        <div className="flex justify-between border-b border-slate-200/50 pb-2">
          <span className="text-slate-400 font-semibold">Référence Dossier :</span>
          <span className="font-black text-slate-800 uppercase tracking-wider">{receipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Élève :</span>
          <span className="font-bold text-slate-700">{receipt.studentFirstName} {receipt.studentLastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Format :</span>
          <span className="font-bold text-slate-700">{receipt.courseType === 'INDIVIDUEL' ? 'Individuel' : 'Groupe'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Statut :</span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-bold text-[9px] border border-amber-100">En attente</span>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 leading-relaxed px-4 bg-sky-50/60 border border-sky-100 p-3 rounded-2xl text-left space-y-1">
        <p className="font-bold text-sky-800">✉️ Notification de validation :</p>
        <p>Dès que l'administration validera votre pré-inscription, vous recevrez une <strong>notification e-mail</strong>. Vous pourrez alors vous connecter à votre <strong>Espace Parent</strong> avec votre numéro ({receipt.parentPhone}) et votre code secret à 4 chiffres.</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
      >
        Fermer la fenêtre <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
