import React from 'react';
import { Download, Printer, Share2, CheckCircle, Mail, MessageSquare } from 'lucide-react';

interface PdfActionsSidebarProps {
  loading: boolean;
  successMsg: string;
  emailForm: { show: boolean; email: string; sent: boolean };
  setEmailForm: React.Dispatch<React.SetStateAction<{ show: boolean; email: string; sent: boolean }>>;
  handleDownloadPDF: () => void;
  handlePrint: () => void;
  handleSendWhatsApp: () => void;
  handleSendEmail: (e: React.FormEvent) => void;
}

export const PdfActionsSidebar: React.FC<PdfActionsSidebarProps> = ({
  loading, successMsg, emailForm, setEmailForm,
  handleDownloadPDF, handlePrint, handleSendWhatsApp, handleSendEmail,
}) => {
  return (
    <div className="p-6 bg-white space-y-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 text-sm">Génération de documents</h4>
          <p className="text-slate-400 text-[10px]">
            Téléchargez la version PDF finale ou envoyez-la directement aux parents d'élèves via nos connecteurs intégrés.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0" /> <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-2">
          <button id="pdf-btn-download" onClick={handleDownloadPDF} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-3 rounded-xl transition shadow-xs text-xs cursor-pointer">
            <Download className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
            {loading ? 'Génération du PDF...' : 'Télécharger le PDF'}
          </button>
          <button id="pdf-btn-print" onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs cursor-pointer">
            <Printer className="w-4 h-4" /> Imprimer le document
          </button>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-3">
          <h5 className="font-bold text-slate-700 text-xs flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-slate-500" /> Options d'envoi rapide</h5>
          <button id="pdf-btn-whatsapp" onClick={handleSendWhatsApp} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition text-xs cursor-pointer">
            <MessageSquare className="w-4 h-4" /> Envoyer par WhatsApp
          </button>

          {!emailForm.show ? (
            <button id="pdf-btn-show-email" onClick={() => setEmailForm(prev => ({ ...prev, show: true }))} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-xs cursor-pointer">
              <Mail className="w-4 h-4" /> Envoyer par Email
            </button>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-600 text-[10px]">Indiquez l'adresse email :</p>
              <input type="email" value={emailForm.email} onChange={e => setEmailForm({ ...emailForm, email: e.target.value })} placeholder="parent@example.com" className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-sky-500" required />
              <div className="flex gap-2">
                <button type="button" onClick={() => setEmailForm({ show: false, email: '', sent: false })} className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg">Annuler</button>
                <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-white text-[10px] font-bold py-1.5 rounded-lg">{emailForm.sent ? 'Envoi...' : 'Envoyer'}</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Aide & Astuce</span>
        <p className="text-[10px] text-slate-500 mt-1">Le PDF généré respecte le format standard A4 de bureau pour vos classeurs et dossiers physiques. Assurez-vous d'avoir configuré l'imprimante en orientation "Portrait".</p>
      </div>
    </div>
  );
};
