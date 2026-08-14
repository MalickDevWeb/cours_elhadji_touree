import React from 'react';

interface StepperProps {
  step: number;
  isLoggedInParent?: boolean;
}

export const EnrollmentStepper: React.FC<StepperProps> = ({ step, isLoggedInParent }) => {
  const steps = isLoggedInParent ? [
    { stepNum: 1, label: '1. Classe' },
    { stepNum: 2, label: '2. Élève' }
  ] : [
    { stepNum: 1, label: '1. Classe' },
    { stepNum: 2, label: '2. Élève' },
    { stepNum: 3, label: '3. Parent & Sécurité' }
  ];

  return (
    <div className="flex items-center justify-between px-1 py-1 bg-slate-50 rounded-2xl p-2 text-[10px] border border-slate-100">
      {steps.map((s, idx) => (
        <React.Fragment key={s.stepNum}>
          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] transition-all duration-300 ${
              step === s.stepNum 
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-110' 
                : step > s.stepNum 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s.stepNum ? '✓' : s.stepNum}
            </span>
            <span className={`font-bold transition-all duration-300 ${step === s.stepNum ? 'text-slate-800' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-300 ${
              step > s.stepNum ? 'bg-emerald-500' : 'bg-slate-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
