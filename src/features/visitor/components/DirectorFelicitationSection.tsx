import React from 'react';
import { motion } from 'motion/react';
import { Award, ThumbsUp, Heart, Star, MapPin, Quote } from 'lucide-react';
import elhadjiToureImg from '../../../assets/images/elhadji_toure_perfect_1784489343491.jpg';
import { SpringCounter } from './SpringCounter';

export const DirectorFelicitationSection: React.FC = () => {
  const fallbackPhoto = 'https://ui-avatars.com/api/?name=Elhadji+Toure&background=f59e0b&color=000&bold=true&size=256';
  const initialPhoto = typeof elhadjiToureImg === 'string' ? elhadjiToureImg : (elhadjiToureImg as any)?.src || fallbackPhoto;
  const [photoSrc, setPhotoSrc] = React.useState(initialPhoto);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl mb-12"
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Message de Félicitations</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
              Alhamdoulilah ! <span className="text-amber-400">❤</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              Nous remercions le Bon Dieu pour cette belle réussite. Nos sincères félicitations à tous les candidats admis au Baccalauréat.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Award className="w-7 h-7 text-slate-950 font-bold" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Taux de Réussite d'Élite</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                <SpringCounter valeur={81.42} suffix=" %" decimals={2} /> au BAC
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5"><Heart className="w-3.5 h-3.5 fill-sky-400 text-sky-400" /></div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Profonde gratitude aux <strong className="text-white">PARENTS</strong> qui nous ont fait confiance tout au long de l'année.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5"><ThumbsUp className="w-3.5 h-3.5 text-indigo-400" /></div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Un grand merci également à tous les <strong className="text-white">PROFESSEURS & ENCADREURS</strong> pour leurs sacrifices.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-48 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl bg-slate-950 group">
            <img 
              src={photoSrc} 
              alt="" 
              onError={() => setPhotoSrc(fallbackPhoto)}
              className="w-full h-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl px-2.5 py-1.5 flex items-center justify-center gap-1.5 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-amber-400 fill-amber-400/10 shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-200">Takhikao, Thiès</span>
            </div>
          </div>

          <div className="mt-4 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 max-w-xs relative text-center">
            <Quote className="absolute -top-2.5 left-3 w-5 h-5 text-amber-500/20 fill-amber-500/5" />
            <p className="text-[10px] text-amber-100 font-medium italic leading-relaxed pt-1">
              "Chaque effort compte, chaque jour vous rapproche de votre objectif. N'abandonnez jamais !"
            </p>
            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mt-1.5">— Elhadji Touré</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-800/60">
        {[
          { title: 'Suivi Rigoureux', text: 'Encadrement personnalisé de haut niveau' },
          { title: 'Méthodes Efficaces', text: 'Exercices, corrigés et conseils pratiques' },
          { title: 'Objectif Excellence', text: 'Votre réussite au Baccalauréat !' }
        ].map((p, idx) => (
          <div key={idx} className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 text-center">
            <p className="text-[9px] font-black text-amber-400 uppercase tracking-wider">{p.title}</p>
            <p className="text-[10px] text-slate-300 mt-0.5">{p.text}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
