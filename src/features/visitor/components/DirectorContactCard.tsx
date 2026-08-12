import React from 'react';
import { Phone, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { Settings } from '../../../types';
import elhadjiImg from '../../../assets/images/elhadji_toure_perfect_1784489343491.jpg';

interface DirectorContactCardProps {
  settings: Settings;
}

export const DirectorContactCard: React.FC<DirectorContactCardProps> = ({ settings }) => {
  const directorName = settings.directorName || 'Elhadji Touré';
  const phone = settings.phone || '+221 77 644 12 12';
  const rawPhone = (settings.whatsapp || phone).replace(/[^\d+]/g, '').replace('+', '');
  const address = settings.address || 'Takhikao, Thiès, Sénégal';
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Bonjour M. ${directorName}, je souhaite des informations.`
  )}`;

  const fallbackPhoto = 'https://ui-avatars.com/api/?name=Elhadji+Toure&background=10b981&color=fff&bold=true&size=128';
  const initialPhoto = typeof elhadjiImg === 'string' ? elhadjiImg : (elhadjiImg as any)?.src || fallbackPhoto;
  const [photoSrc, setPhotoSrc] = React.useState(initialPhoto);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-emerald-500 shrink-0 shadow-sm bg-emerald-50">
            <img 
              src={photoSrc} 
              alt="" 
              onError={() => setPhotoSrc(fallbackPhoto)}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="En ligne" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100 mb-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Direction & Fondateur
            </div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">M. {directorName}</h3>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl transition shadow-sm text-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Direct</span>
          </a>

          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-2xl border border-slate-200 transition text-xs cursor-pointer"
          >
            <Phone className="w-4 h-4 text-sky-600" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
