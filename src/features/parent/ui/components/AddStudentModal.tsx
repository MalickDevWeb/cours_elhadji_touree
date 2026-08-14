import { useState } from 'react';
import { X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Level, Subject, Parent, Preinscription } from '../../../../types';
import { StudentStepOne } from './StudentStepOne';
import { StudentStepTwo } from './StudentStepTwo';

interface AddStudentModalProps {
  isOpen: boolean; onClose: () => void; levels: Level[]; subjects: Subject[]; currentParent: Parent;
  onSubmit: (data: Omit<Preinscription, 'id' | 'status' | 'date'>) => void;
}

export function AddStudentModal({ isOpen, onClose, levels, subjects, currentParent, onSubmit }: AddStudentModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: currentParent.fullName.split(' ').slice(1).join(' ') || '',
    sex: 'M' as 'M' | 'F', birthDate: '', levelId: levels[0]?.id || '',
    courseType: 'GROUPE' as 'INDIVIDUEL' | 'GROUPE', selectedSubjects: [] as string[]
  });

  if (!isOpen) return null;
  const handleChange = (f: string, v: any) => setForm(p => ({ ...p, [f]: v }));
  const toggleSubject = (id: string) => setForm(p => ({
    ...p, selectedSubjects: p.selectedSubjects.includes(id) ? p.selectedSubjects.filter(s => s !== id) : [...p.selectedSubjects, id]
  }));

  const handleSend = () => {
    onSubmit({
      parentName: currentParent.fullName, parentPhone: currentParent.phone, parentWhatsapp: currentParent.whatsapp,
      parentAddress: currentParent.address, studentFirstName: form.firstName, studentLastName: form.lastName,
      studentSex: form.sex, studentBirthDate: form.birthDate, levelId: form.levelId, subjectIds: form.selectedSubjects, courseType: form.courseType
    });
    setForm({ firstName: '', lastName: '', sex: 'M', birthDate: '', levelId: levels[0]?.id || '', courseType: 'GROUPE', selectedSubjects: [] });
    setStep(1); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none text-xs overflow-y-auto pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100"><Sparkles className="w-4 h-4" /></div>
            <div>
              <h3 className="font-display font-black text-slate-800 text-sm">Nouvelle inscription</h3>
              <p className="text-[10px] text-slate-400 font-medium">Pour : {currentParent.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          {step === 1 ? <StudentStepOne {...form} levels={levels} onChange={handleChange} /> : <StudentStepTwo courseType={form.courseType} selectedSubjects={form.selectedSubjects} subjects={subjects} onChange={handleChange} onToggleSubject={toggleSubject} />}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          {step === 1 ? <button onClick={onClose} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer">Annuler</button> : <button onClick={() => setStep(1)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Retour</button>}
          {step === 1 ? <button onClick={() => setStep(2)} disabled={!form.firstName.trim() || !form.lastName.trim() || !form.birthDate} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1">Suivant <ArrowRight className="w-3.5 h-3.5" /></button> : <button onClick={handleSend} disabled={form.selectedSubjects.length === 0} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black rounded-xl transition cursor-pointer">Inscrire l'élève</button>}
        </div>
      </div>
    </div>
  );
}
