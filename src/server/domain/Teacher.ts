export interface TeacherEntity {
  readonly id: string;
  readonly fullName: string;
  readonly phone: string;
  readonly email: string;
  readonly subjectIds: readonly string[];
  readonly bio?: string;
  readonly isOnline?: boolean;
}

export function createTeacherEntity(data: Partial<TeacherEntity>): TeacherEntity {
  if (!data.fullName || !data.email) {
    throw new Error('Nom complet et email requis');
  }
  return {
    id: data.id || `tea_${Date.now()}`,
    fullName: data.fullName,
    phone: data.phone || '+221 77 000 00 00',
    email: data.email,
    subjectIds: data.subjectIds || [],
    bio: data.bio,
    isOnline: data.isOnline ?? true
  };
}
