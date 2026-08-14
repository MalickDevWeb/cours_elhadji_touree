import React from 'react';
import { PreinscriptionForm } from './PreinscriptionForm';
import { PricingPrograms } from './PricingPrograms';
import { DirectorContactCard } from './DirectorContactCard';
import { ArrowRight, Phone } from 'lucide-react';

interface VisitorSpaceContainerProps {
  db: any;
  state: any;
}

export function VisitorSpaceContainer({ db, state }: VisitorSpaceContainerProps) {
  if (state.isRegistering) {
    return (
      <PreinscriptionForm
        levels={db.levels}
        subjects={db.subjects}
        settings={db.settings}
        courseOffers={db.courseOffers}
        parents={db.parents}
        loggedInParentPhone={state.loggedInParentPhone}
        onSubmit={db.addPreinscription}
        onClose={() => {
          state.setIsRegistering(false);
          state.setSelectedOffer(null);
        }}
        initialLevelId={state.selectedOffer?.levelId}
        initialSubjectId={state.selectedOffer?.subjectId}
        initialCourseType={state.selectedOffer?.type}
        initialCycleId={state.selectedOffer?.cycleId}
      />
    );
  }

  const whatsappNumber = (db.settings.whatsapp || '+221 77 644 12 12').replace(/[^\d+]/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Bonjour M. Elhadji Touré, je souhaite des informations sur le soutien scolaire."
  )}`;

  return (
    <div className="space-y-6 relative max-w-6xl mx-auto">
      <DirectorContactCard settings={db.settings} />

      <PricingPrograms 
        settings={db.settings} 
        subjects={db.subjects} 
        levels={db.levels} 
        courseOffers={db.courseOffers} 
        onSelectOffer={(offer) => { state.setSelectedOffer(offer); state.setIsRegistering(true); }} 
      />

      <div className="bg-sky-50 rounded-3xl p-6 text-center border border-sky-200/80 shadow-sm mt-6">
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">Assurez la réussite scolaire de votre enfant dès aujourd'hui</h3>
        <p className="text-slate-600 text-xs max-w-lg mx-auto mb-4">
          Places limitées en classe (12 élèves max) pour garantir un encadrement optimal.
        </p>
        <button
          type="button"
          onClick={() => state.setIsRegistering(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md inline-flex items-center gap-2 cursor-pointer text-xs"
        >
          Commencer la pré-inscription <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group font-black"
        aria-label="Contactez M. Elhadji Touré sur WhatsApp"
      >
        <Phone className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-xs font-bold whitespace-nowrap ml-0 group-hover:ml-2">
          WhatsApp Elhadji Touré
        </span>
      </a>
    </div>
  );
}
