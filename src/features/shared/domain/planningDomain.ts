export interface ParsedTimeSlot {
  day: string; startMinutes: number; endMinutes: number; startTime: string; endTime: string;
}

export interface ConflictCheckItem {
  id?: string; type?: 'INDIVIDUEL' | 'GROUPE'; teacherId: string; studentId?: string;
  groupId?: string; roomOrLocation: string; schedule: string; title?: string;
}

export interface PlanningConflict {
  type: 'TEACHER_CONFLICT' | 'ROOM_CONFLICT' | 'STUDENT_CONFLICT';
  severity: 'CRITICAL' | 'WARNING';
  message: string; conflictingTitle: string; conflictingSchedule: string;
}

const DAYS_LIST = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export function parseHourStringToMinutes(hStr: string): number {
  if (!hStr) return 0;
  const [hPart, mPart] = hStr.trim().toLowerCase().replace('h', ':').split(':');
  return ((parseInt(hPart, 10) || 0) % 24) * 60 + ((parseInt(mPart, 10) || 0) % 60);
}

export function formatMinutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

export function parseScheduleSlots(schedule: string): ParsedTimeSlot[] {
  if (!schedule || !schedule.trim()) return [];
  const lower = schedule.toLowerCase();
  const matched = DAYS_LIST.filter(d => lower.includes(d)).map(d => d.charAt(0).toUpperCase() + d.slice(1));
  const effectiveDays = matched.length > 0 ? matched : ['Tous les jours'];
  const match = schedule.match(/(\d{1,2}(?:[:h]\d{1,2}|h)?)\s*(?:-|à|to)\s*(\d{1,2}(?:[:h]\d{1,2}|h)?)/i);
  let sMin = match ? parseHourStringToMinutes(match[1]) : 600;
  let eMin = match ? parseHourStringToMinutes(match[2]) : 720;
  if (eMin <= sMin) eMin = sMin + 120;
  return effectiveDays.map(day => ({
    day, startMinutes: sMin, endMinutes: eMin,
    startTime: formatMinutesToTime(sMin), endTime: formatMinutesToTime(eMin)
  }));
}

export function doSlotsOverlap(a: ParsedTimeSlot, b: ParsedTimeSlot): boolean {
  if (a.day !== b.day && a.day !== 'Tous les jours' && b.day !== 'Tous les jours') return false;
  return Math.max(a.startMinutes, b.startMinutes) < Math.min(a.endMinutes, b.endMinutes);
}

export function findPlanningConflicts(target: ConflictCheckItem, existing: ConflictCheckItem[]): PlanningConflict[] {
  if (!target.schedule || !target.schedule.trim()) return [];
  const targetSlots = parseScheduleSlots(target.schedule);
  const conflicts: PlanningConflict[] = [];

  for (const item of existing) {
    if (target.id && item.id === target.id) continue;
    const itemSlots = parseScheduleSlots(item.schedule);
    const hasOverlap = targetSlots.some(t => itemSlots.some(i => doSlotsOverlap(t, i)));
    if (!hasOverlap) continue;

    if (target.teacherId && item.teacherId && target.teacherId === item.teacherId) {
      conflicts.push({
        type: 'TEACHER_CONFLICT', severity: 'CRITICAL',
        message: 'Ce professeur a déjà un autre cours programmé sur ce créneau.',
        conflictingTitle: item.title || 'Autre cours', conflictingSchedule: item.schedule
      });
    }

    const nLocT = (target.roomOrLocation || '').trim().toLowerCase();
    const nLocI = (item.roomOrLocation || '').trim().toLowerCase();
    if (nLocT && nLocI && nLocT === nLocI && nLocT !== 'domicile' && !nLocT.includes('domicile')) {
      conflicts.push({
        type: 'ROOM_CONFLICT', severity: 'WARNING',
        message: `La salle "${target.roomOrLocation}" est déjà réservée sur ce créneau.`,
        conflictingTitle: item.title || 'Autre cours', conflictingSchedule: item.schedule
      });
    }
  }
  return conflicts;
}
