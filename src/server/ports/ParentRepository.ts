import { ParentEntity } from '../domain/Parent';

export interface ParentRepository {
  findAll(): Promise<ParentEntity[]>;
  findById(id: string): Promise<ParentEntity | null>;
  findByPhone(phone: string): Promise<ParentEntity | null>;
  save(parent: ParentEntity): Promise<ParentEntity>;
}
