import { Assignment } from '../../../types';

export function isScanAuthorized(
  assignment: Assignment,
  simulatedTimeStr: string
): { authorized: boolean; reason?: string } {
  const date = new Date(simulatedTimeStr);
  if (isNaN(date.getTime())) {
    return { authorized: false, reason: 'Date simulée invalide.' };
  }

  const daysMap: Record<string, number> = {
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
    dimanche: 0,
  };

  const scheduleLower = assignment.schedule.toLowerCase();
  let scheduleDayNum = -1;
  for (const [dayName, num] of Object.entries(daysMap)) {
    if (scheduleLower.includes(dayName)) {
      scheduleDayNum = num;
      break;
    }
  }

  if (scheduleDayNum !== -1 && date.getDay() !== scheduleDayNum) {
    return {
      authorized: false,
      reason: `Ce cours n'est pas programmé pour ce jour (attendu : ${assignment.schedule.split(' ')[0]}).`,
    };
  }

  // Parse hour range e.g. "10h - 12h"
  const match = scheduleLower.match(/(\d+)\s*h\s*(?:-\s*(\d+)\s*h)?/);
  if (match) {
    const startHour = parseInt(match[1], 10);
    const endHour = match[2] ? parseInt(match[2], 10) : startHour + 2;
    const simHour = date.getHours();
    
    // Give a margin of 15 minutes before the class and allow scanning during the class
    if (simHour < startHour && (startHour - simHour > 1 || date.getMinutes() < 45)) {
      return { authorized: false, reason: `Trop tôt pour scanner (${assignment.schedule.split(' ').slice(1).join(' ')}).` };
    }
    if (simHour >= endHour) {
      return { authorized: false, reason: `Le cours est déjà terminé (${assignment.schedule.split(' ').slice(1).join(' ')}).` };
    }
  }

  return { authorized: true };
}
