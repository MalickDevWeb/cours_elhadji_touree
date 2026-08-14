import { validatePreinscription } from '../validation/PreinscriptionValidation';

export interface PreinscriptionEntity {
  readonly id: string;
  readonly childFirstName: string;
  readonly childLastName: string;
  readonly levelId: string;
  readonly parentName: string;
  readonly parentPhone: string;
  readonly status: 'PENDING' | 'APPROVED' | 'REJECTED';
  readonly date: string;
}

export function createPreinscriptionEntity(data: unknown): PreinscriptionEntity {
  const validated = validatePreinscription(data);
  return {
    id: validated.id || `pre_${Date.now()}`,
    childFirstName: validated.childFirstName,
    childLastName: validated.childLastName,
    levelId: validated.levelId,
    parentName: validated.parentName,
    parentPhone: validated.parentPhone,
    status: validated.status,
    date: validated.date || new Date().toISOString().split('T')[0]
  };
}
