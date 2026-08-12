import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { AttendanceRecord } from '../../domain/parentMockData';

interface StudentAttendanceProps {
  attendance: AttendanceRecord[];
  presenceRate: number;
  attendedCount: number;
  totalScheduledCount: number;
  retardCount: number;
}

export function StudentAttendance({
  attendance,
  presenceRate,
  attendedCount,
  totalScheduledCount,
  retardCount
}: StudentAttendanceProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-left">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" /> Présences & Ponctualité
        </h3>
        <div className="text-right">
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Taux {presenceRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
        <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
          <span className="text-[9px] text-slate-400 block uppercase font-bold">Cours suivis</span>
          <p className="text-sm font-black text-slate-700 font-mono">{attendedCount} / {totalScheduledCount}</p>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-2xl text-center">
          <span className="text-[9px] text-slate-400 block uppercase font-bold">Retards constatés</span>
          <p className="text-sm font-black text-amber-600 font-mono">{retardCount}</p>
        </div>
      </div>

      <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
        {attendance.length === 0 ? (
          <p className="text-slate-400 italic text-[10px] py-4 text-center">Aucun enregistrement de présence.</p>
        ) : (
          attendance.map((record, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-slate-50/50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                {record.status === 'PRESENT' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {record.status === 'RETARD' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                {record.status === 'ABSENT' && <XCircle className="w-4 h-4 text-rose-500" />}
                <div>
                  <span className="font-bold text-slate-700 text-[10.5px]">{record.subjectName}</span>
                  <span className="text-slate-400 text-[8.5px] block font-mono">Le {record.date} à {record.time}</span>
                </div>
              </div>

              <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                record.status === 'RETARD' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {record.status === 'PRESENT' ? 'Présent' : record.status === 'RETARD' ? 'Retard' : 'Absent'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
