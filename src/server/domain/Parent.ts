export interface ParentEntity {
  readonly id: string;
  readonly fullName: string;
  readonly phone: string;
  readonly email?: string;
  readonly address?: string;
  readonly childrenIds: readonly string[];
}

export function createParentEntity(data: Partial<ParentEntity>): ParentEntity {
  if (!data.fullName || !data.phone) {
    throw new Error('Nom complet et téléphone requis');
  }
  return {
    id: data.id || `par_${Date.now()}`,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    address: data.address,
    childrenIds: data.childrenIds || []
  };
}
