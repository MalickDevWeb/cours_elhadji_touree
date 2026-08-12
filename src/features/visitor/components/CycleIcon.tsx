import React from 'react';
import { BookOpen, School, GraduationCap, BookMarked } from 'lucide-react';

interface CycleIconProps {
  name: string;
  code?: string;
  size?: 'sm' | 'lg';
}

export const CycleIcon: React.FC<CycleIconProps> = ({ name, code, size = 'sm' }) => {
  const lower = (name + ' ' + (code || '')).toLowerCase();
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4 shrink-0';

  if (lower.includes('prim')) return <BookOpen className={`${cls} text-sky-600`} />;
  if (lower.includes('cem') || lower.includes('coll')) return <School className={`${cls} text-amber-600`} />;
  if (lower.includes('lyc')) return <GraduationCap className={`${cls} text-emerald-600`} />;
  return <BookMarked className={`${cls} text-sky-600`} />;
};
