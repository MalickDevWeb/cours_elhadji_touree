import { ParentRepository } from '../ports/ParentRepository';
import { ParentEntity } from '../domain/Parent';
import { ParentMapper } from '../mappers/ParentMapper';
import { readDb, writeDb } from '../dbHelper';

export class JsonParentRepository implements ParentRepository {
  async findAll(): Promise<ParentEntity[]> {
    const db = readDb();
    return (db.parents || []).map(ParentMapper.toEntity);
  }

  async findById(id: string): Promise<ParentEntity | null> {
    const db = readDb();
    const parent = (db.parents || []).find((p: any) => p.id === id);
    return parent ? ParentMapper.toEntity(parent) : null;
  }

  async findByPhone(phone: string): Promise<ParentEntity | null> {
    const db = readDb();
    const target = phone.trim().replace(/\s+/g, '');
    const parent = (db.parents || []).find((p: any) => p.phone.trim().replace(/\s+/g, '') === target);
    return parent ? ParentMapper.toEntity(parent) : null;
  }

  async save(parent: ParentEntity): Promise<ParentEntity> {
    const db = readDb();
    const parents = db.parents || [];
    const index = parents.findIndex((p: any) => p.id === parent.id);
    const dto = ParentMapper.toDto(parent);
    if (index >= 0) {
      parents[index] = dto;
    } else {
      parents.push(dto);
    }
    db.parents = parents;
    writeDb(db);
    return parent;
  }
}
