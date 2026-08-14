import React from 'react';
import { AlertTriangle, Clock, MapPin, UserX } from 'lucide-react';
import { PlanningConflict } from '../domain/planningDomain';

interface Props {
  conflicts: PlanningConflict[];
}

export const PlanningConflictAlert: React.FC<Props> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2 animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Conflit de planification détecté ({conflicts.length})</span>
      </div>
      <div className="space-y-1.5">
        {conflicts.map((c, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl text-[11px] border ${
              c.type === 'TEACHER_CONFLICT'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              {c.type === 'TEACHER_CONFLICT' ? (
                <UserX className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span>{c.message}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[10px] opacity-90 pl-4.5">
              <span className="font-semibold">{c.conflictingTitle}</span>
              <span className="flex items-center gap-0.5 font-mono">
                <Clock className="w-3 h-3" /> {c.conflictingSchedule}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
