import { Assignment } from '../../../types';
import { parseScheduleSlots, parseHourStringToMinutes, formatMinutesToTime } from '../../shared/domain/planningDomain';

export interface ScanAuthResult {
  authorized: boolean;
  reason?: string;
  currentFormatted: string;
  scheduleWindow?: string;
  isExactScheduledTime?: boolean;
}

const FRENCH_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function isScanAuthorized(
  assignment: Assignment,
  dateTimeInput?: string | Date,
  _allowFlexible = true
): ScanAuthResult {
  const date = dateTimeInput ? new Date(dateTimeInput) : new Date();
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  const currentDayName = FRENCH_DAYS[validDate.getDay()];
  const currentDateStr = validDate.toISOString().split('T')[0];
  const currentMinutes = validDate.getHours() * 60 + validDate.getMinutes();
  const currentFormatted = `${currentDayName} ${validDate.toLocaleDateString('fr-FR')} à ${formatMinutesToTime(currentMinutes)}`;

  const slots = parseScheduleSlots(assignment.schedule);
  const slot = slots[0];
  const startMin = assignment.startTime ? parseHourStringToMinutes(assignment.startTime) : (slot ? slot.startMinutes : 0);
  const endMin = assignment.endTime ? parseHourStringToMinutes(assignment.endTime) : (slot ? slot.endMinutes : 1439);
  const scheduleWindow = `${formatMinutesToTime(startMin)} - ${formatMinutesToTime(endMin)}`;

  const schedLower = (assignment.schedule || '').toLowerCase();
  const definedDays = assignment.days && assignment.days.length > 0
    ? assignment.days.map(d => d.toLowerCase())
    : FRENCH_DAYS.filter(d => schedLower.includes(d.toLowerCase())).map(d => d.toLowerCase());

  const isMatchingDay = definedDays.length === 0 || definedDays.includes(currentDayName.toLowerCase());
  const isMatchingTime = startMin > 0 && endMin > 0
    ? currentMinutes >= (startMin - 45) && currentMinutes <= (endMin + 60)
    : true;

  const isExactScheduledTime = isMatchingDay && isMatchingTime;

  return {
    authorized: true,
    isExactScheduledTime,
    currentFormatted,
    scheduleWindow,
    reason: isExactScheduledTime ? undefined : `Session en direct (${currentFormatted})`
  };
}
