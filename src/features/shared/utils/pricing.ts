import { CourseOffer, SchoolCycle } from '../../../types';

export function calculatePreinscriptionPrice(
  levelId: string,
  type: 'INDIVIDUEL' | 'GROUPE',
  subjectIds: string[],
  courseOffers: CourseOffer[],
  cycles?: SchoolCycle[],
  levelName?: string
): number {
  if (!levelId) return 0;

  const selectedIds = subjectIds.length > 0 ? subjectIds : [];
  
  // Try finding specific course offer override
  if (selectedIds.length > 0) {
    const firstMatch = courseOffers.find(o => o.type === type && o.levelId === levelId && selectedIds.includes(o.subjectId));
    if (firstMatch) return firstMatch.price * Math.max(1, selectedIds.length);
  }

  // Find cycle default price if available
  const cycle = cycles?.find(c => {
    if (!levelName) return false;
    return c.levels.some(l => l.toLowerCase() === levelName.toLowerCase() || levelName.toLowerCase().includes(l.toLowerCase()));
  });

  if (type === 'GROUPE' && cycle?.monthlyFee) {
    return cycle.monthlyFee;
  }

  const isPrimary = levelId <= 'lvl-06';
  if (isPrimary) {
    return type === 'GROUPE' ? (cycle?.monthlyFee || 3000) : 35000;
  }

  const idNum = parseInt(levelId.replace('lvl-', ''), 10);
  const isLycee = idNum >= 11;
  const defaultPrice = type === 'GROUPE' 
    ? (cycle?.monthlyFee || (isLycee ? 7000 : 4000)) 
    : (isLycee ? 45000 : 35000);

  return defaultPrice * Math.max(1, selectedIds.length);
}

