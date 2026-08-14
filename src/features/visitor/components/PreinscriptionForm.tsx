import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Level, Subject, Preinscription, Settings, CourseOffer, Parent } from '../../../types';
import { EnrollmentParentStep } from './EnrollmentParentStep';
import { EnrollmentStudentStep } from './EnrollmentStudentStep';
import { EnrollmentCourseStep } from './EnrollmentCourseStep';
import { EnrollmentReceipt } from './EnrollmentReceipt';
import { EnrollmentStepper } from './EnrollmentStepper';
import { validateParent, validateStudent, ParentFormErrors, StudentFormErrors } from './enrollmentValidation';
import { arePhonesEqual } from '../../shared/utils/phoneUtils';

interface FormProps {
  levels: Level[]; subjects: Subject[]; settings: Settings; courseOffers: CourseOffer[]; parents?: Parent[]; loggedInParentPhone?: string;
  onSubmit: (data: Omit<Preinscription, 'id' | 'status' | 'date'>) => Preinscription; onClose: () => void;
  initialLevelId?: string; initialSubjectId?: string; initialCourseType?: 'INDIVIDUEL' | 'GROUPE'; initialCycleId?: string;
}

export const PreinscriptionForm: React.FC<FormProps> = ({ 
  levels, subjects, settings, courseOffers, parents = [], loggedInParentPhone, onSubmit, onClose, initialLevelId, initialSubjectId, initialCourseType, initialCycleId 
}) => {
  const [step, setStep] = useState(1);
  const [parentErrors, setParentErrors] = useState<ParentFormErrors>({});
  const [studentErrors, setStudentErrors] = useState<StudentFormErrors>({});
  const [parent, setParent] = useState({ name: '', phone: '', whatsapp: '', address: '', email: '', pin: '', confirmPin: '' });
  const [student, setStudent] = useState({ firstName: '', lastName: '', sex: 'M' as const, birthDate: '', levelId: initialLevelId || '' });
  const [course, setCourse] = useState({ type: initialCourseType || (settings.isIndividualPaused ? 'GROUPE' : 'INDIVIDUEL'), subjectIds: initialSubjectId ? [initialSubjectId] : [] });
  const [receipt, setReceipt] = useState<Preinscription | null>(null);

  const matchedParent = loggedInParentPhone ? parents.find(p => arePhonesEqual(p.phone, loggedInParentPhone)) : undefined;
  const isLoggedInParent = !!loggedInParentPhone || !!matchedParent;

  useEffect(() => {
    if (matchedParent) {
      setParent({ name: matchedParent.fullName, phone: matchedParent.phone, whatsapp: matchedParent.whatsapp || matchedParent.phone, address: matchedParent.address || 'Thiès', email: matchedParent.email || '', pin: matchedParent.pin || '1234', confirmPin: matchedParent.pin || '1234' });
      setStudent(s => ({ ...s, lastName: s.lastName || matchedParent.fullName.split(' ').slice(1).join(' ') || matchedParent.fullName }));
    } else if (loggedInParentPhone) {
      setParent(p => ({ ...p, phone: loggedInParentPhone, whatsapp: loggedInParentPhone, pin: '1234', confirmPin: '1234' }));
    }
  }, [loggedInParentPhone, matchedParent]);

  const submitDirectly = () => {
    const pData = matchedParent ? { name: matchedParent.fullName, phone: matchedParent.phone, whatsapp: matchedParent.whatsapp || matchedParent.phone, address: matchedParent.address || 'Thiès', email: matchedParent.email || parent.email || '', pin: matchedParent.pin || '1234' } : parent;
    setReceipt(onSubmit({
      parentName: pData.name || 'Parent Connecté', parentPhone: pData.phone || loggedInParentPhone || '', parentWhatsapp: pData.whatsapp || pData.phone || '',
      parentAddress: pData.address || 'Thiès', parentEmail: pData.email || parent.email || '', parentPin: pData.pin || '1234', studentFirstName: student.firstName, studentLastName: student.lastName,
      studentSex: student.sex, studentBirthDate: student.birthDate, levelId: student.levelId, subjectIds: course.subjectIds, courseType: course.type
    }));
  };

  const handleNext = () => {
    if (step === 1 && student.levelId) setStep(2);
    else if (step === 2) {
      const result = validateStudent(student);
      if (!result.success) { setStudentErrors(result.errors || {}); return; }
      setStudentErrors({});
      if (isLoggedInParent) submitDirectly(); else setStep(3);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggedInParent) {
      const res = validateStudent(student);
      if (!res.success) { setStudentErrors(res.errors || {}); return; }
      submitDirectly(); return;
    }
    const res = validateParent(parent);
    if (!res.success) { setParentErrors(res.errors || {}); return; }
    setParentErrors({}); submitDirectly();
  };

  if (receipt) return <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md max-w-lg mx-auto animate-in fade-in duration-200"><EnrollmentReceipt receipt={receipt} onClose={onClose} /></div>;
  if (settings.isIndividualPaused && settings.isGroupPaused) return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-md mx-auto text-center py-8 space-y-4 font-sans"><div className="inline-flex p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100"><Lock className="w-6 h-6" /></div><p className="font-bold text-slate-800">Inscriptions Suspendues</p><button type="button" onClick={onClose} className="w-full bg-slate-900 text-white font-bold p-3 rounded-xl cursor-pointer">Fermer</button></div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md relative space-y-5 font-sans animate-in fade-in duration-200">
      <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button>
      <div className="border-b border-slate-100 pb-3">
        <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md">Pré-inscription en ligne</span>
        <h3 className="font-display font-black text-slate-800 text-base mt-1">Fiche d'Inscription</h3>
        {isLoggedInParent && matchedParent && <p className="text-[11px] text-slate-500 mt-1 font-medium">Inscrire un enfant sous le compte de <strong className="text-slate-700">{matchedParent.fullName}</strong></p>}
      </div>
      <EnrollmentStepper step={step} isLoggedInParent={isLoggedInParent} />
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {step === 1 && <EnrollmentCourseStep levels={levels} subjects={subjects} settings={settings} courseOffers={courseOffers} course={course} setCourse={setCourse} student={student} setStudent={setStudent} onNext={handleNext} initialCycleId={initialCycleId} />}
        {step === 2 && <EnrollmentStudentStep levels={levels} student={student} setStudent={(s: any) => { setStudent(s); setStudentErrors({}); }} errors={studentErrors} />}
        {step === 3 && !isLoggedInParent && <EnrollmentParentStep parent={parent} setParent={(p: any) => { setParent(p); setParentErrors({}); }} errors={parentErrors} parents={parents} />}
        {step > 1 && (
          <div className="flex gap-3 pt-3 border-t border-slate-100 justify-between">
            <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center gap-1 text-xs cursor-pointer"><ChevronLeft className="w-4 h-4" /> Précédent</button>
            {step === 2 && !isLoggedInParent ? (
              <button type="button" onClick={handleNext} className="ml-auto px-5 py-2.5 bg-slate-900 hover:bg-sky-600 text-white font-bold rounded-xl flex items-center gap-1 text-xs cursor-pointer">Suivant <ChevronRight className="w-4 h-4" /></button>
            ) : (
              <button type="submit" disabled={course.type === 'INDIVIDUEL' ? settings.isIndividualPaused : settings.isGroupPaused} className="ml-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer">Valider la pré-inscription</button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
